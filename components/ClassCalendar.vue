<template>
  <div>
    <v-calendar
      v-if="events"
      type="week"
      :first-interval="startInterval"
      :weekdays="[1, 2, 3, 4, 5]"
      :events="events"
      :interval-count="numIntervals"
      :event-color="(x => x.color)"
      @click:event="showEvent"
    ></v-calendar>
    <v-menu
      v-if="selectedEvent"
      v-model="selectedOpen"
      :close-on-content-click="false"
      :activator="selectedElement"
      full-width
      offset-x
    >
      <v-card color="grey darken-2" min-width="350px" flat>
        <v-toolbar :color="selectedEvent.color" dark>
          <v-btn icon>
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
          <v-spacer></v-spacer>
          <!-- <v-btn icon>
            <v-icon>mdi-heart</v-icon>
          </v-btn>-->
          <v-btn icon @click="selectedOpen = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <div class="flex-row d-flex">
            <div>{{selectedEvent.originalCourse.prettyCourseName}}</div>
            <v-spacer></v-spacer>
            <div>{{selectedEvent.originalCourse.days}}</div>
          </div>
          <div
            class="flex-row d-flex"
            v-for="(item, index) in selectedEvent.originalCourse.timeIntervals"
            :key="index"
          >
            <div>{{selectedEvent.originalCourse.rawCourse.schedules[index].days}}: {{item}}</div>
            <v-spacer></v-spacer>
            <div>enrollment: {{selectedEvent.originalCourse.rawCourse.schedules[index].totalenr}}/{{selectedEvent.originalCourse.rawCourse.schedules[index].maxenr}}</div>
          </div>
          <div class="flex-row d-flex">
            <span>Division: {{selectedEvent.originalCourse.division}}</span>
            <v-spacer></v-spacer>
          </div>
          <span>Instructor: {{selectedEvent.originalCourse.instructor}}</span>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="secondary" @click="selectedOpen = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { RawCourse } from "../ts/types";
import { toTitleCase } from "../ts/Utils";
import Course from "../ts/Course";
@Component
export default class ClassCalendar extends Vue {
  @Prop() events!: any[];

  get startInterval() {
    return Math.min(
      8,
      ...this.events.map(e => e.startDate).map(d => d.getHours())
    );
  }
  selectedEvent: any = null;
  selectedElement: any = null;
  selectedOpen: boolean = false;
  //@ts-ignore
  showEvent({ nativeEvent, event }) {
    console.log("boop");
    const open = () => {
      this.selectedEvent = event;
      (window as any).selectedEvent = this.selectedEvent;
      this.selectedElement = nativeEvent.target;
      setTimeout(() => (this.selectedOpen = true), 10);
    };

    if (this.selectedOpen) {
      this.selectedOpen = false;
      setTimeout(open, 10);
    } else {
      open();
    }

    nativeEvent.stopPropagation();
  }
  get numIntervals() {
    //startinteval is <= 8.
    // const lastHour = this.endingHour();

    return Math.max(8, this.endingHour() + 1 - this.startInterval);
  }
  endingHour() {
    return Math.max(...this.events.map(e => e.endDate).map(d => d.getHours()));
  }
  mounted() {
    console.log("class calendar mounted", this.events);
    //   this.course["Course Name"];
    //   this.course.Course
  }
}
</script>
