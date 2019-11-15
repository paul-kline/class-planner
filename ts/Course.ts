import { RawCourse } from "./types";
import { toTitleCase } from "./Utils";
const dayOrder = ["M", "T", "W", "R", "F", "S", "U", "N", "\\", "A"];
export default class Course {
  constructor(public rawCourse: RawCourse) {}
  _events: any[] | null = null;
  get events() {
    if (!this._events) {
      this._events = this.toEvents();
    }
    return this._events;
  }
  toEvents(): any[] {
    // {
    //     name: 'Weekly Meeting',
    //     start: '2019-01-07 09:00',
    //     end: '2019-01-07 10:00',
    //   }
    const scheds = this.rawCourse.schedules;
    const events: any = [];
    if (!scheds) return events;
    const shortername = this.course.match(/(\w+\d+)/);
    const eventName =
      shortername && shortername.length > 1 ? shortername[1] : this.course;
    scheds.forEach(sched => {
      const start = sched.starttime;
      const end = sched.endtime;
      const days =
        sched.days == "N\\A" || sched.days == "N/A"
          ? []
          : sched.days
              .split("")
              .map(letter => toDateThisWeek(letter, new Date()));
      console.log(days);
      //each of the dates need their times set.
      const starttimes = [];
      const endtimes = [];
      days.forEach(d => {
        const event: any = {};
        event.startDate = withTime(d, start);
        event.start = toVuetifyCalString(event.startDate);
        event.endDate = withTime(d, end);
        event.end = toVuetifyCalString(event.endDate);
        event.name = eventName + "-" + sched.room;
        event.originalCourse = this;
        event.color = this.color;
        events.push(event);
      });
    });
    return events;
  }
  get color() {
    const ms = ["CS", "MA"];
    const codes = [
      "AA",
      "AC",
      "AG",
      "AR",
      "BI",
      "CA",
      "CH",
      "CO",
      "CS",
      "EC",
      "ED",
      "EN",
      "FS",
      "HI",
      "JA",
      "LD",
      "LE",
      "MA",
      "MG",
      "MK",
      "MU",
      "PE",
      "PH",
      "PR",
      "PS",
      "PY",
      "SM",
      "SP",
      "SS",
      "TH",
      "WR"
    ];
    const colors = [
      "blue",
      "purple lighten-1",
      "red",
      "pink",
      "purple",
      "deep-purple",
      "indigo",
      "light-blue",
      "cyan",
      "teal",
      "green",
      "light-green",
      "amber",
      "orange",
      "deep-orange",
      "brown",
      "blue-grey",
      "grey"
    ];
    const me = this;
    const i: number = codes.indexOf(
      codes.find(x => me.course.startsWith(x)) || ""
    );
    if (i >= 0) {
      console.log("color", colors[i]);
      return colors[i % colors.length];
    } else {
      console.log("color", "orange", me.course);
      return "deep-purple";
    }
  }
  get days(): string {
    const x = this.rawCourse;
    return x.schedules
      ? x.schedules
          .map(s => s.days)
          .reduce((acc, curr) => (acc.includes(curr) ? acc : acc + curr), "")
          .split("")
          .sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b))
          .join("")
      : "?";
  }
  get instructor(): string {
    return instructorify(this.rawCourse);
  }
  get course(): string {
    return this.rawCourse.course;
  }
  get timeIntervals(): string[] {
    const r = this.rawCourse.schedules;
    if (!r) return [];
    return r.map(s => s.starttime + "-" + s.endtime);
  }

  get coursename(): string {
    return this.rawCourse.coursename;
  }
  get division(): string {
    return this.rawCourse.division;
  }
  get description(): string {
    return this.rawCourse.description;
  }
  get prereqs() {
    return this.rawCourse.prereqs;
  }
  get coreqs() {
    return this.rawCourse.coreqs;
  }
  get equivalents() {
    return this.rawCourse.equivalents;
  }
  get prettyCourseName(): string {
    return toTitleCase(this.rawCourse.coursename);
  }
  get creditsString(): string {
    return this.rawCourse.credits;
  }
  get courseHTML(): string {
    return courseify(this.rawCourse.course);
  }
}
function withTime(date: Date, time: string) {
  // "8:50:00 PM".match(/(\d+):(\d+):(\d+)(\w+)/)
  const d = new Date(date);
  //@ts-ignore
  const [, hourstr, minutestr, secondstr, pm] = time.match(
    /(\d+):(\d+):(\d+)\s*([A-Z]+)/
  );
  let hour = Number.parseInt(hourstr, 10);
  const minute = Number.parseInt(minutestr, 10);
  const second = Number.parseInt(secondstr, 10);
  if (pm.toUpperCase() == "PM" && hour < 12) {
    hour += 12;
  }
  d.setHours(hour);
  d.setMinutes(minute);
  d.setSeconds(second);
  d.setMilliseconds(0);
  return d;
}
const days = ["U", "M", "T", "W", "R", "F", "S"];
function toDateThisWeek(letter: string, date: Date) {
  const d = new Date(date);
  const dayi = d.getDay();
  const letteri = days.indexOf(letter);
  d.setDate(d.getDate() + (letteri - dayi));
  return d;
}
function toVuetifyCalString(d: Date) {
  // '2019-01-07 09:00'
  return `${d.getFullYear()}-${twof(d.getMonth() + 1)}-${twof(
    d.getDate()
  )} ${twof(d.getHours())}:${twof(d.getMinutes())}`;
}
function twof(x: number | string) {
  let r = "" + x;
  if (r.length < 2) {
    return "0" + r;
  } else {
    return r;
  }
}
function courseify(str: string): string {
  const [, dept, num, lec] = str.match(/([A-Z]+)(\d+)(\w+)/);
  return `<span>${dept} ${num}</span><span style="font-size:0.65em;">(${lec})</span> `;
}
function instructorify(course: RawCourse) {
  const str = course.schedules
    ? course.schedules.reduce(
        (acc, s) =>
          acc.includes(s.instructor)
            ? acc
            : acc + (acc ? "/" : "") + s.instructor,
        ""
      )
    : "?";
  return str;
}
