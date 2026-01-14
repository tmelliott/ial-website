import { getPayload } from "payload";
import config from "@payload-config";
import Button from "../../components/Button";
import Link from "next/link";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Image from "next/image";
import getPlaceholder from "../../utils/getPlaceholder";

export default async function OurTeam() {
  const payload = await getPayload({ config });
  const { teamTitle, teamDescription, image, buttonText } =
    await payload.findGlobal({
      slug: "homeTeam",
    });

  const imgurl =
    image && typeof image !== "number" && image.url ? image.url : "";
  const PH = await getPlaceholder(imgurl);

  return (
    <div className="px-8 py-12 lg:py-36 text-black bg-gradient-to-b from-white from:50% lg:from-70% to-[#F0F0F0]">
      <div className="max-w-6xl mx-auto mb-12 grid lg:grid-cols-2 items-center gap-12">
        <div className="flex flex-col">
          <h3 className="text-2xl lg:text-5xl mb-4 lg:mb-8">{teamTitle}</h3>

          <div className="mb-8 lg:mb-12 text-xl">
            <RichText data={teamDescription} />
          </div>
          <div className="flex">
            <Link href="/about#team">
              <Button
                type="alternate"
                className="text-sm text-black/80 border-black/80"
              >
                {buttonText}
              </Button>
            </Link>
          </div>
        </div>
        <div className="overflow-clip">
          {imgurl && (
            <Image
              src={imgurl}
              alt="The iNZight Team"
              width={560}
              height={320}
              className="object-contain shadow-lg rounded"
              placeholder="blur"
              blurDataURL={PH}
            />
          )}
        </div>
      </div>
    </div>
  );
}
