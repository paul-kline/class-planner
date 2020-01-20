<template>
  <div>
    <v-calendar
      v-if="events"
      :first-interval="startInterval"
      type="custom-daily"
      :start="firstDate"
      :end="lastDate"
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
          <v-btn icon @click="close">
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
          <v-btn text color="secondary" @click="close">Cancel</v-btn>
          <v-btn
            v-if="includeRemove"
            text
            color="secondary"
            @click="remove(selectedEvent.originalCourse)"
          >Remove</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { RawCourse } from "../ts/types";
import { toTitleCase, mkDay, strDate, dateFromString } from "../ts/Utils";
import Course from "../ts/Course";
@Component
export default class ClassCalendar extends Vue {
  @Prop() events!: any[];
  @Prop() includeRemove!: boolean;
  @Prop() minimizeSize!: boolean;
  originalColor: string = "";
  remove(course: Course) {
    this.$emit("remove", course);
    this.close();
  }

  get startInterval() {
    return (
      Math.min(
        this.minimizeSize ? 24 : 8,
        ...this.events.map(e => e.startDate).map(d => d.getHours())
      ) + (this.minimizeSize ? -1 : 0)
    );
  }
  close() {
    console.log("close called");
    this.selectedOpen = false;
    if (this.originalColor && this.changedEvents.length > 0) {
      this.changedEvents.forEach(e => (e.color = this.originalColor));
      this.originalColor = "";
      this.changedEvents = [];
      this.selectedEvent = null;
    }
  }
  selectedEvent: any = null;
  selectedElement: any = null;
  selectedOpen: boolean = false;
  changedEvents: any[] = [];
  //@ts-ignore
  showEvent({ nativeEvent, event }) {
    console.log("boo000000000p");
    const open = () => {
      if (this.selectedEvent) this.close();
      this.originalColor = event.color;
      const me = this;
      this.changedEvents = event.originalCourse.events;
      this.changedEvents.forEach((e: any) => {
        e.color = "black";
      });

      this.selectedEvent = event;
      (window as any).selectedEvent = this.selectedEvent;
      this.selectedElement = nativeEvent.target;

      setTimeout(() => (this.selectedOpen = true), 10);
    };

    if (this.selectedOpen) {
      // this.selectedOpen = false;
      this.close();
      setTimeout(open, 10);
    } else {
      open();
    }

    nativeEvent.stopPropagation();
  }
  get firstDate(): string {
    let r: string = this.events
      .map(e => e.start)
      .reduce((acc, x) => (acc < x ? acc : x), this.mkMonday(false));
    const asDate = dateFromString(r);
    if (asDate.getDay() != 1) {
      //it's not monday. make it monday!
      r = strDate(mkDay("M", true, asDate));
    }
    console.log("first date:", r);
    return r;
  }
  mkMonday(past: boolean = true): string {
    const m = mkDay("M", past);
    console.log("monday is:", m);
    return strDate(m);
  }

  mkFriday(): string {
    // return strDate(mkDay("F", false));
    return strDate(mkDay("F", false, dateFromString(this.mkMonday())));
  }
  get lastDate(): string {
    return strDate(mkDay("F", false, dateFromString(this.firstDate)));
    // const friday = this.mkFriday();
    // const r = this.events
    //   .map(e => e.end)
    //   .reduce((acc, x) => (acc > x ? acc : x), friday);
    // console.log("last date", r);
    // return r > friday ? friday : r;
  }
  get numIntervals() {
    //startinteval is <= 8.
    // const lastHour = this.endingHour();

    return Math.max(
      this.minimizeSize ? 0 : 8,
      this.endingHour() + 1 - this.startInterval
    );
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
