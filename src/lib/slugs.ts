import { Team } from "@payload-types";
import { FieldHook } from "payload";

export const format = (val: string): string =>
  val
    .replace(/ /g, "-")
    // replace accented e.g., ā with standard letter
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w-]+/g, "")
    .toLowerCase();

export const formatSlug =
  (name: string): FieldHook =>
  ({ data, value }) => {
    // if (typeof value === "string") {
    //   return format(value);
    // }
    const newvalue = data?.[name];
    if (newvalue && typeof newvalue === "string") {
      return format(newvalue);
    }
    return value;
  };

export const formatNameSlug =
  (): FieldHook<Team> =>
  ({ data, operation, value }) => {
    if (typeof value === "string") {
      return format(value);
    }
    if (operation === "create" || !data?.name) {
      const fallbackData = data?.name?.first + "-" + data?.name?.last;
      if (fallbackData && typeof fallbackData === "string") {
        return format(fallbackData);
      }
    }
    return value;
  };
