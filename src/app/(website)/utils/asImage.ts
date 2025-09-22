import { Image } from "@payload-types";

export const asImage = (
  input: Image | number | null | undefined
): Image | undefined => {
  if (!input) return undefined;
  if (typeof input === "number") return undefined;
  return input;
};

export const isImage = (
  input: Image | number | null | undefined
): input is Image => {
  if (!input) return false;
  if (typeof input === "number") return false;
  return true;
};
