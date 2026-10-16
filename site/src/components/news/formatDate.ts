import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

export function formatNewsDate(iso: string): string {
  return dayjs(iso).format("DD MMMM YYYY");
}

export function formatNewsRowDate(iso: string): string {
  return dayjs(iso).format("Do MMMM YYYY");
}
