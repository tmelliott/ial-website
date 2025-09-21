import { getPayload } from "payload";
import config from "@payload-config";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Button from "../../components/Button";

import DataSVG from "./02-data-image";

const heroMap = {
  heroDataDesign: "Data Design",
  heroDataCollection: "Data Collection",
  heroDataAnalysis: "Data Analysis",
  heroDataVisualisation: "Data Visualisation",
  heroTraining: "Training",
  heroDataSovereignty: "Data Sovereignty",
} as const;

export default async function Data() {
  const payload = await getPayload({ config });
  const { heroGroup } = await payload.findGlobal({
    slug: "homeHero",
  });

  const title = heroGroup.heroTitle.replaceAll("|", "<br/> ");
  const itemKeys = Object.keys(
    heroGroup.heroItems
  ) as (keyof typeof heroGroup.heroItems)[];
  const itemArray = itemKeys.map((k) => ({
    key: k,
    ...heroGroup.heroItems[k],
  }));

  return (
    <div className="bg-linear-150 from-bg-gradient-start from-15% to-bg-gradient-end to-[125%] pb-80 h-full overflow-clip">
      <div className="text-white px-8 ">
        <div className="max-w-6xl mx-auto flex flex-col justify-between lg:justify-start gap-12 pt-24 relative h-full">
          {/* image background */}
          <div className="absolute top-full -translate-y-1/2 lg:translate-y-0 lg:top-0 -right-8 lg:-right-30 w-full lg:w-3/4 z-0">
            <DataSVG className="w-full -z-10" />
          </div>

          {/* header section */}
          <div className="flex flex-col lg:w-5/9">
            <h2
              className="text-4xl md:text-6xl tracking-tight leading-tight mb-10"
              dangerouslySetInnerHTML={{
                __html: title,
              }}
            />
            <RichText
              data={heroGroup.heroDescription}
              className="text-xl md:text-2xl mb-8"
            />
            <div className="flex text-lg">
              <Button type="alternate">About us</Button>
            </div>
          </div>

          {/* grid items */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-12 lg:flex-1 place-content-center">
            {itemArray.map((item) => (
              <div
                key={item.key}
                className="lg:py-6 lg:px-8 flex gap-2 flex-col lg:bg-white/5 lg:backdrop-blur lg:border border-white/5 rounded shadow first:lg:bg-white first:lg:text-black last:lg:bg-black"
              >
                <h4 className="text-lg lg:text-2xl">{heroMap[item.key]}</h4>
                <div className="hidden lg:block">
                  <RichText
                    className="text-sm opacity-90 [&_strong]:underline"
                    data={item}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
