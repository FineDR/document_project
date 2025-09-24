export interface Job {
  source: string;
  title: string;
  company: string | null;
  location: string | null;
  link: string;
  date_posted: string | null;
}