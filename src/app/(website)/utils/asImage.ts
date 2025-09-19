import { Image } from "@payload-types";

export const asImage = (
  input: Image | number | null | undefined
): Image | undefined => {
  if (!input) return undefined;
  if (typeof input === "number") return undefined;
  return input;
};
