<template>
  <v-card class="mb-2 mt-0 container" raised color="primary">
    <!-- <v-row justify="center" v-if="course.events.length > 0">
      <v-expansion-panels accordion>
        <v-expansion-panel>
          <v-expansion-panel-header>Schedule</v-expansion-panel-header>
    <v-expansion-panel-content class="container">-->
    <!-- </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-row>-->
    <ClassCalendar v-if="course.events.length > 0" :events="course.events" :minimizeSize="true"></ClassCalendar>

    <div v-else>No Schedule Set</div>
    <v-card-text>{{ course.description }}</v-card-text>
    <v-divider></v-divider>
    <v-list-item two-line v-if="course.prereqs">
      <v-list-item-content>
        <v-list-item-title>Pre-Reqs</v-list-item-title>
        <v-list-item-subtitle>{{ course.prereqs }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
    <v-list-item two-line v-if="course.coreqs">
      <v-list-item-content>
        <v-list-item-title>Co-Reqs</v-list-item-title>
        <v-list-item-subtitle>{{ course.coreqs }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>
<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
// import { Course } from "../ts/types";
import Course from "../ts/Course";
import { toTitleCase } from "../ts/Utils";
import ClassCalendar from "~/components/ClassCalendar.vue";
@Component({ components: { ClassCalendar } })
export default class ClassesView extends Vue {
  @Prop() course!: Course;

  mounted() {
    //   this.course["Course Name"];
    //   this.course.Course
  }
  get courseTitle() {
    return toTitleCase(this.course.coursename);
  }
}
</script>
