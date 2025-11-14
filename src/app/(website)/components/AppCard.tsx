import { getPayload } from "payload";
import config from "@payload-config";

import Card from "./Card";
import { RichText } from "@payloadcms/richtext-lexical/react";

export default async function AppCard({
  id,
  variant = "left",
}: {
  id: number;
  variant?: "left" | "right";
  direction?: "horizontal" | "vertical";
}) {
  const payload = await getPayload({ config });
  const app = await payload.findByID({
    collection: "apps",
    id: id,
  });

  return (
    <div id={app.slug}>
      <Card
        title={app.title}
        image={app.banner}
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
