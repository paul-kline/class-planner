<template>
  <div>
    <ClassCalendar :events="selectedEvents"></ClassCalendar>
    <v-text-field
      v-model="search"
      label="Search"
      hide-details
      outlined
      append-icon="search"
    ></v-text-field>
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
      ><template v-slot:item.course="{ item }">
        <span v-html="item.courseHTML"></span>
      </template>
      <template v-slot:item.coursename="{ item }">
        {{ item.prettyCourseName }}
      </template>
      <!-- 
      <template v-slot:item.instructor="{ item }">
        {{ instructorify(item) }}
      </template>
      
      <template v-slot:item.days="{ item }">
        {{ days(item) }}
      </template> -->
      <template v-slot:expanded-item="{ item, headers }">
        <td :colspan="headers.length">
          <ClassComponent
            :colspan="headers.length"
            :course="item"
          ></ClassComponent>
        </td>

        <!-- <div>{{ item.description }}</div> -->
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
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
  selected = [];
  expanded = [];
  get selectedEvents() {
    return this.selected.flatMap(x => x.events);
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

  mounted() {
    this.courses = fetchClasses().map(x => new Course(x));
    (window as any).courses = this.courses;
    console.log("classes", this.courses);
  }
  clickedRow(r) {
    console.log("row clicked", r);
  }
}
</script>
