import { getPayload } from "payload";
import config from "@payload-config";

import Card from "./Card";
import { RichText } from "./RichText";
import type { App } from "@payload-types";
import { needsAppHydration } from "../utils/needsMediaHydration";

async function fetchApp(id: number) {
  const payload = await getPayload({ config });
  return payload.findByID({
    collection: "apps",
    id,
    depth: 2,
  });
}

async function resolveApp(appProp?: App, id?: number) {
  if (appProp && !needsAppHydration(appProp)) {
    return appProp;
  }
  const appId = appProp?.id ?? id;
  if (appId === undefined) return undefined;
  return fetchApp(appId);
}

export default async function AppCard({
  id,
  app: appProp,
  variant = "left",
}: {
  id?: number;
  app?: App;
  variant?: "left" | "right";
  direction?: "horizontal" | "vertical";
}) {
  const app = await resolveApp(appProp, id);
  if (!app) return null;

  return (
    <div id={app.slug}>
      <Card
        title={app.title}
        banner={app.banner}
        image={app.logo}
        keywords={app.keywords}
        url={app.link}
        type="app"
        linkType="button"
        variant={variant}
      >
        <RichText data={app.content} />
      </Card>
    </div>
  );
}
