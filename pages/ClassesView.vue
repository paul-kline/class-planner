<template>
  <div>
    <!-- <v-expansion-panels multiple>
      <v-expansion-panel>
        <v-expansion-panel-header>Calendar</v-expansion-panel-header>
        <v-expansion-panel-content class="container"></v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>-->
    <v-card>
      <ClassCalendar :events="selectedEvents"></ClassCalendar>
    </v-card>
    <div class="d-flex flex-row align-baseline">
      <v-btn v-on:click="myclear()">Clear</v-btn>

      <div>Credit Hours Selected: {{creditHours}}</div>
      <v-select
        style="width: max-content; max-width: max-content; "
        :items="terms"
        label="Term"
        v-model="selectedTerm"
        class="mb-0"
        solo
      ></v-select>
    </div>

    <v-text-field v-model="search" label="Search" hide-details outlined append-icon="search"></v-text-field>
    <v-data-table
      v-if="courses && headers"
      fixed-header
      :search="search"
      v-model="selected"
      :headers="headers"
      :items="courses"
      :single-select="false"
      item-key="course"
      show-select
      :single-expand="false"
      :expanded.sync="expanded"
      show-expand
      :click:row="clickedRow"
      class="elevation-1"
    >
      <template v-slot:item.course="{ item }">
        <span v-html="item.courseHTML"></span>
      </template>
      <template v-slot:item.coursename="{ item }">{{ item.prettyCourseName }}</template>
      <!-- 
      <template v-slot:item.instructor="{ item }">
        {{ instructorify(item) }}
      </template>
      
      <template v-slot:item.days="{ item }">
        {{ days(item) }}
      </template>-->
      <template v-slot:expanded-item="{ item, headers }">
        <td :colspan="headers.length">
          <ClassComponent :colspan="headers.length" :course="item"></ClassComponent>
        </td>

        <!-- <div>{{ item.description }}</div> -->
      </template>
    </v-data-table>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">{{selectedTerm}} Data saved!</v-card-title>
        <v-card-text>You can now access this page directly. The class information has been saved to this browser when you select the term {{selectedTerm}}.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
// import { RawCourse } from "../ts/types";
import { fetchClasses, toTitleCase } from "../ts/Utils";
import ClassComponent from "~/components/ClassComponent.vue";
import ClassCalendar from "~/components/ClassCalendar.vue";
import Course from "../ts/Course";
// @Component
@Component({ components: { ClassComponent, ClassCalendar } })
export default class ClassesView extends Vue {
  // @Prop() name!: string;
  courses: Course[] | null = null;
  search: string = "";
  selected: any[] = [];
  expanded = [];
  terms: string[] = [];
  selectedTerm: string = "";
  dialog = false;
  get creditHours(): number {
    const sels = this.selected as Course[];
    return sels.reduce(
      (acc, c) => acc + (Number.parseInt(c.creditsString, 10) || 0),
      0
    );
  }
  // term = "";
  // middleware ({ store, redirect }) {

  get selectedEvents() {
    return this.selected.flatMap(x => x.events);
  }
  myclear() {
    console.log("clearing...");
    // this.selected = [];
    this.$nextTick(() => {
      this.selected = [];
    });
  }
  async asyncData(context: any) {
    const id = context.req.body.id;
    return { id };
  }

  headers = [
    { text: "", value: "data-table-expand" },
    {
      text: "#",
      align: "left",
      sortable: true,
      value: "course"
    },
    {
      text: "Title",
      align: "left",
      sortable: true,
      value: "coursename"
    },
    {
      text: "Instructor",
      align: "left",
      sortable: true,
      value: "instructor"
    },
    {
      text: "Credits",
      align: "left",
      sortable: true,
      value: "creditsString"
    },
    {
      text: "Days",
      align: "left",
      sortable: true,
      value: "days"
    },
    { text: "", value: "data-table-expand" }
  ];
  title = toTitleCase;
  created() {}
  mounted() {
    this.setupPageMessages();
    this.courses = this.populateClasses();
    (window as any).courses = this.courses;
    console.log("classes", this.courses);
  }
  populateClasses(): Course[] {
    const localTerms = localStorage.getItem("terms");
    if (localTerms) {
      console.log("localTerms are", localTerms);
      const termsArray = JSON.parse(localTerms);
      console.log("terms read from storage:", termsArray);
      this.terms = termsArray;
    }
    const selectedTerm = localStorage.getItem("selectedTerm");
    if (selectedTerm) {
      this.selectedTerm = selectedTerm;
      const coursesStr = localStorage.getItem(selectedTerm);
      if (coursesStr) {
        const courses = JSON.parse(coursesStr);
        if (courses && courses.length > 0) {
          return courses;
        }
      }
    }
    //if no local storage version was found.
    this.selectedTerm = "FA-19";
    if (!this.terms.includes(this.selectedTerm)) {
      this.terms.push(this.selectedTerm);
    }
    return fetchClasses().map(x => new Course(x));
  }
  asCourses(ls: any[]) {
    return ls.map(this.asCourse);
  }
  asCourse(x: any) {
    Object.setPrototypeOf(x, Course.prototype);
    return x;
  }
  @Watch("selectedTerm")
  onTermChanged(val: string, oldVal: string) {
    console.info("term changed");
    const str = localStorage.getItem(val);
    if (str) {
      const d = JSON.parse(str);
      if (d && d.length > 0) {
        console.log("setting courese!", d);

        this.courses = this.asCourses(d);
      } else {
        console.error(
          "could not change terms. desired term",
          val,
          "data read was:",
          d,
          "leaving term as is. "
        );
        this.selectedTerm = oldVal;
      }
    }
  }
  setupPageMessages() {
    const me = this;
    window.addEventListener("message", receiveMessage, false);
    function receiveMessage(event: any) {
      if (typeof event.data !== "string") return;
      const d = JSON.parse(event.data);
      if (
        d.term &&
        d.classes &&
        d.classes instanceof Array &&
        d.classes[0].course
      ) {
        console.log("thanks for the data!!");
        console.log("replacing data...");
        me.courses = d.classes.map((x: any) => new Course(x));
        me.selectedTerm = d.term;
        if (!me.terms.includes(me.selectedTerm)) {
          me.terms.push(me.selectedTerm);
        }
        me.writeOut();
        (window as any).data = d;
        me.dialog = true;
      }

      console.log("message received!", event);

      // ...
    }
    console.log("requesting classes from opener");
    try {
      window.opener.postMessage("classes now plz", "*");
    } catch (e) {
      console.log("couldn't post message to opener");
    }
  }
  writeOut() {
    localStorage.setItem("selectedTerm", this.selectedTerm);
    const ts = localStorage.getItem("terms");
    let existingTerms = ts ? JSON.parse(ts) : [];

    //make sure each term has data attached. consistency check.
    //I don't think these will get out of sync, but maybe?
    existingTerms = existingTerms.filter((t: string) => {
      const x = localStorage.getItem(t);
      return x && x.length > 0;
    });
    if (!existingTerms.includes(this.selectedTerm)) {
      existingTerms.push(this.selectedTerm);
    }
    localStorage.setItem("terms", JSON.stringify(existingTerms));
    //term set and terms set.
    //setting current class data.
    localStorage.setItem(this.selectedTerm, JSON.stringify(this.courses));
  }
  clickedRow(r: any) {
    console.log("row clicked", r);
  }
}
</script>
