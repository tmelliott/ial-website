import { getPayload } from "payload";
import config from "@payload-config";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Image from "next/image";
import cn from "../../utils/cn";
import { isImage } from "../../utils/asImage";
import CTA from "../../components/CTA";
import ActionCard from "../../components/ActionCard";
import getPlaceholder from "../../utils/getPlaceholder";

export default async function OurCollab() {
  const payload = await getPayload({ config });
  const { title, description, feature, collaborators } =
    await payload.findGlobal({
      slug: "homeCollaborators",
    });

  return (
    <div className="px-8 bg-white text-black">
      <div className="max-w-6xl py-8 lg:py-36 mx-auto grid lg:grid-cols-3 gap-4 lg:gap-24 overflow-hidden">
        <div className="flex flex-col">
          <h3 className="text-xl lg:text-3xl mb-4">{title}</h3>
          <div className="text-sm">
            <RichText data={description} />
          </div>
        </div>
        <div className="lg:col-span-2 lg:row-span-2 lg:order-first">
          <div className="grid grid-cols-2 md:grid-cols-12 gap-y-6 md:gap-y-12">
            {[...collaborators!, ...collaborators!]
              ?.filter((x, i) => i < 11)
              .map(async (collab, index) => (
                <div
                  key={collab.id + index.toString()}
                  className={cn(
                    "md:border-l border-gray-200 inset-0 p-6 place-content-center text-center",
                    index < 3
                      ? "md:col-span-4 text-lg"
                      : "md:col-span-3 text-base",
                    index === 2 || index % 4 === 2
                      ? "md:border-r"
                      : "last:border-r",
                    index > 5 && "hidden md:block"
                  )}
                >
                  {isImage(collab.image) ? (
                    <div
                      className={cn(
                        "relative h-full w-full",
                        index < 3 ? "min-h-28" : "min-h-16"
                      )}
                    >
                      <Image
                        alt={collab.name}
                        src={collab.image.url ?? ""}
                        fill
                        className="object-contain"
                        placeholder="blur"
                        blurDataURL={await getPlaceholder(collab.image.url)}
                      />
                    </div>
                  ) : (
                    collab.name
                  )}
                </div>
              ))}
          </div>
        </div>
        {feature && (
          <ActionCard
            title={feature.title ?? ""}
            description={feature.description}
            button={{
              text: feature.buttonText ?? "",
              url: feature.buttonURL ?? "",
            }}
            variant="feature-rev"
          />
        )}
      </div>

      <CTA
        text1="Want to work with us?"
        text2="Get in touch."
        text3="Contact us"
        url="/contact"
      />
    </div>
  );
}
