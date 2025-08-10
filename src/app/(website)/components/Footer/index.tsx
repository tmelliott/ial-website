import config from "@payload-config";
import { Image } from "@payload-types";
import NextImage from "next/image";
import { getPayload } from "payload";

export default async function Footer() {
  const payload = await getPayload({ config });
  const { logo } = (await payload.findGlobal({
    slug: "general",
  })) as { logo: Image };

  return (
    <footer className="p-12 lg:p-24 flex flex-col gap-12">
      <div className="flex justify-between flex-col lg:flex-row">
        <div className="flex text-lg gap-24">
          <ol>
            <li>About</li>
            <li>News</li>
            <li>Projects</li>
            <li>Apps</li>
          </ol>
          <ol>
            <li>Cool stuff</li>
            <li>Horizon Europe</li>
          </ol>
        </div>

        <div className="flex flex-col items-center lg:items-end max-w-xs mt-12 lg:mt-0 mx-auto lg:mx-0">
          <p className="text-lg pb-12 lg:pb-38 text-center lg:text-right">
            Analytics, research, and data visualisation that make a difference.
          </p>
          <div className="relative h-24 w-full">
            <NextImage
              src={logo.url ?? ""}
              alt="iNZight Analytics Ltd"
              fill
              className="object-contain lg:object-right"
            />
          </div>
        </div>
      </div>
      <div className="text-sm text-center lg:text-left">
        &copy; iNZight Analytics Ltd 2025
      </div>
    </footer>
  );
}
