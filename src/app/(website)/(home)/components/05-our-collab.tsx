import { getPayload } from "payload";
import config from "@payload-config";
import Button from "../../components/Button";
import Link from "next/link";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Image from "next/image";
import cn from "../../utils/cn";
import { isImage } from "../../utils/asImage";

export default async function OurCollab() {
  const payload = await getPayload({ config });
  const { title, description, feature, collaborators } =
    await payload.findGlobal({
      slug: "homeCollaborators",
    });

  return (
    <div className="px-8 py-36 bg-white text-black">
      <div className="max-w-6xl mx-auto mb-12 grid lg:grid-cols-3 gap-8 lg:gap-24">
        <div className="flex flex-col ">
          <h3 className="text-xl lg:text-3xl mb-4">{title}</h3>
          <div className="text-sm">
            <RichText data={description} />
          </div>
        </div>
        <div className="lg:col-span-2 lg:row-span-2 lg:order-first">
          <div className="grid grid-cols-12 gap-y-12">
            {[...collaborators!, ...collaborators!]
              ?.filter((x, i) => i < 11)
              .map((collab, index) => (
                <div
                  key={collab.id + index.toString()}
                  className={cn(
                    "border-l border-gray-200 inset-0 p-6 place-content-center text-center",
                    index < 3 ? "col-span-4 text-lg" : "col-span-3 text-base",
                    index === 2 || index % 4 === 2
                      ? "border-r"
                      : "last:border-r"
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
          <div className="bg-linear-330 from-bg-gradient-start from-15% to-bg-gradient-end to-[125%] p-4 lg:p-8 rounded shadow-accent-600 text-white">
            <h5 className="text-xl lg:text-3xl mb-4">{feature.title}</h5>
            <div className="text-sm mb-8 lg:mb-12">
              {feature.description && <RichText data={feature.description} />}
            </div>
            {feature.buttonURL && (
              <Link href={feature.buttonURL}>
                <Button type="alternate">{feature.buttonText}</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
