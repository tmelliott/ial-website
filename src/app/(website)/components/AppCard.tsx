import { getPayload } from "payload";
import config from "@payload-config";

import cn from "../utils/cn";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Link from "next/link";
import BannerImage from "./media/BannerImage";

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
      <div
        className={cn(
          "rounded shadow md:shadow-lg overflow-clip grid grid-cols-4 md:grid-cols-2 border border-gray-100"
        )}
      >
        <div className="w-full md:aspect-square relative">
          {/* TODO: make a "Banner" image component */}
          <BannerImage image={app.banner} size={"square"} />
        </div>
        <div
          className={cn(
            "p-4 md:p-8 h-full bg-white text-black col-span-3 md:col-span-1 flex flex-col",
            variant === "left" && "md:order-first"
          )}
        >
          <h4
            className={cn(
              "text-lg md:text-3xl font-semibold mb-2 md:mb-4 text-accent-500"
            )}
          >
            {app.title}
          </h4>
          <div className="flex-1">
            <div className="text-sm md:text-lg line-clamp-3 lg:line-clamp-6 overflow-ellipsis md:mb-6">
              <RichText data={app.content} />
            </div>
          </div>
          {app.keywords && (
            <div className="hidden md:flex flex-wrap gap-2">
              {app.keywords.map((kw) => {
                if (typeof kw === "number") return <></>;
                return (
                  <div
                    key={kw.slug}
                    className={cn(
                      " rounded border px-2 py-1 text-gray-400 border-gray-400"
                    )}
                  >
                    {kw.title}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
