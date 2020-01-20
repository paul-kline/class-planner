import { RawCourse } from "./types";
import courses from "./courses.json";
export function fetchClasses(): RawCourse[] {
  return courses as RawCourse[];
}

/**
 * Converts a date into str format yyyy-mm-dd
 * @param d date to convert
 */
export function strDate(d: Date) {
  const twof = (x: number) => (x < 10 ? "0" + x : "" + x);
  return `${d.getFullYear()}-${twof(d.getMonth() + 1)}-${twof(d.getDate())}`;
}
/**
 *
 * @param str yyyy-mm-dd
 */
export function dateFromString(str: string) {
  let [y, m, d] = str.split("-").map(x => parseInt(x, 10));
  //@ts-ignore
  return new Date(y, m - 1, d);
}
/**
 *
 * @param day one of UMTWRFS for desired day.
 * @param past go backwards in time to reach day? defaults to true
 * @param date from date. defaults to new Date().
 */
export function mkDay(
  day: string,
  past: boolean = true,
  date: Date = new Date()
): Date {
  //0=sunday.
  const goal = Math.max(0, ["U", "M", "T", "W", "R", "F", "S"].indexOf(day));

  const val = past ? -1 : 1;
  while (date.getDay() !== goal) {
    date.setDate(date.getDate() + val);
  }
  return date;
}

export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, function(txt) {
    if (isRomanNumeral(txt)) {
      return txt;
    }
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
const ROMANS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
function isRomanNumeral(str: string): boolean {
  return ROMANS.includes(str);
}
