import { getPayload } from "payload";
import config from "@payload-config";

import Link from "next/link";
import Card from "./Card";
import { RichText } from "@payloadcms/richtext-lexical/react";

export default async function AppCard({
  id,
  variant = "left",
}: {
  id: number;
  variant?: "left" | "right";
}) {
  const payload = await getPayload({ config });
  const app = await payload.findByID({
    collection: "apps",
    id: id,
  });

  return (
    <Link href={"/apps/" + app.slug}>
      <Card
        title={app.title}
        image={app.banner}
        keywords={app.keywords}
        variant={variant}
      >
        <RichText data={app.content} />
      </Card>
    </Link>
  );
}
