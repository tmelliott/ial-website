import { getPlaiceholder } from "plaiceholder";

export default async function getPlaceholder(src: string | null | undefined) {
  if (!src) return undefined;

  let result: string | undefined;
  try {
    const { base64 } = await fetch(src)
      .then(async (res) => Buffer.from(await res.arrayBuffer()))
      .then((buffer) => getPlaiceholder(buffer));
    result = base64;
  } catch {
    console.log("error");
  }
  return result;
}
