import { getPayload } from "payload";
import config from "@payload-config";
import Button from "../../components/Button";
import Link from "next/link";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Image from "next/image";

export default async function OurTeam() {
  const payload = await getPayload({ config });
  const { teamTitle, teamDescription, image, buttonText } =
    await payload.findGlobal({
      slug: "homeTeam",
    });

  return (
    <div className="px-8 py-36 bg-gray-100 text-black">
      <div className="max-w-6xl mx-auto mb-12 grid lg:grid-cols-2 items-center">
        <div className="flex flex-col">
          <h3 className="text-2xl lg:text-5xl mb-6">{teamTitle}</h3>

          <div className="mb-12 text-xl">
            <RichText data={teamDescription} />
          </div>
          <div className="flex">
            <Button
              type="alternate"
              className="text-sm text-black/80 border-black/80"
            >
              {buttonText}
            </Button>
          </div>
        </div>
        <div className="overflow-clip">
          {image && typeof image !== "number" && (
            <Image
              src={image.url ?? ""}
              alt="The iNZight Team"
              width={image.width ?? 500}
              height={image.height ?? 500}
              className="object-contain shadow-lg rounded hover:scale-[1000%] transition duration-[5000ms] origin-[32%_40%] ease-in"
            />
          )}
        </div>
      </div>
    </div>
  );
}
