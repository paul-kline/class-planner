export interface RawCourse {
  course: string;
  path: string;
  coursename: string;
  credits: string;
  startdate: string;
  enddate: string;
  maxenr: string;
  totalenr: string;
  schedules?: SchedulesEntity[] | null;
  detailsPromise: DetailsPromise;
  division: string;
  description: string;
  prereqs?: string;
  coreqs?: string;
  equivalents?: string;
}
export interface SchedulesEntity {
  instructor: string;
  room: string;
  days: string;
  date: string;
  starttime: string;
  endtime: string;
  maxenr: string;
  totalenr: string;
}
export interface DetailsPromise {}
