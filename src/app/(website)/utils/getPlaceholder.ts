import { getPlaiceholder } from "plaiceholder";

export default async function getPlaceholder(src: string | null | undefined) {
  if (!src) return undefined;

  // Avoid fetching remote images during SSG — each one adds latency to Vercel builds.
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return undefined;
  }

  let result: string | undefined;
  try {
    const { base64 } = await fetch(src)
      .then(async (res) => Buffer.from(await res.arrayBuffer()))
      .then((buffer) =>
        getPlaiceholder(buffer, {
          size: 5,
        })
      );
    result = base64;
  } catch {
    // console.log("error");
  }
  return result;
}
