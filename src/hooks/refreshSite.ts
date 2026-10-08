import { revalidatePath } from "next/cache";

const REBUILD_DEBOUNCE_MS = 20_000;

let rebuildTimer: ReturnType<typeof setTimeout> | undefined;

type StatusDoc = {
  _status?: string | null;
};

/**
 * Bust the local Next cache, and on the admin deploy schedule one Vercel
 * rebuild so the public site picks up the shared database.
 * Draft saves are ignored until a document is published or unpublished.
 */
export default function refreshSite(args?: {
  doc?: StatusDoc;
  previousDoc?: StatusDoc;
}) {
  const status = args?.doc?._status;
  const previous = args?.previousDoc?._status;
  if (status === "draft" && previous !== "published") return;

  try {
    revalidatePath("/", "layout");
  } catch (error) {
    console.error("revalidatePath failed", error);
  }

  scheduleVercelRebuild();
}

function scheduleVercelRebuild() {
  const hookUrl = process.env.VERCEL_BUILD_HOOK_URL;
  if (process.env.ADMIN_ONLY !== "true" || !hookUrl) return;

  if (rebuildTimer) clearTimeout(rebuildTimer);
  rebuildTimer = setTimeout(() => {
    rebuildTimer = undefined;
    void fetch(hookUrl, { method: "POST" })
      .then((response) => {
        if (!response.ok) {
          console.error(`Vercel rebuild hook failed: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error("Vercel rebuild hook failed", error);
      });
  }, REBUILD_DEBOUNCE_MS);
}
