<template>
  <div>
    <v-calendar
      v-if="events"
      type="week"
      :first-interval="startInterval"
      :weekdays="[1, 2, 3, 4, 5]"
      :events="events"
      :interval-count="numIntervals"
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
      <v-card color="grey lighten-4" min-width="350px" flat>
        <v-toolbar :color="selectedEvent.color" dark>
          <v-btn icon>
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-icon>mdi-heart</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </v-toolbar>
        <v-card-text>
          <span v-html="selectedEvent.details"></span>
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
  showEvent({ nativeEvent, event }) {
    console.log("boop");
    const open = () => {
      this.selectedEvent = event;
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

    return Math.max(8, this.endingHour() - this.startInterval);
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
