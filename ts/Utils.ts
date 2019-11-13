import { RawCourse } from "./types";
import courses from "./courses.json";
export function fetchClasses(): RawCourse[] {
  return courses as RawCourse[];
}

export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
