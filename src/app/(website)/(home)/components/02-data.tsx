import { getPayload } from "payload";
import config from "@payload-config";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Button from "../../components/Button";

import DataSVG from "./02-data-image";
import DataCard from "./02-data-card";

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
    <div className="bg-linear-150 from-bg-gradient-start from-15% to-bg-gradient-end to-[125%] pb-60 lg:pb-80 h-full overflow-clip">
      <div className="text-white px-8">
        <div className="max-w-6xl mx-auto flex flex-col justify-between lg:justify-start gap-12 pt-12 lg:pt-24 relative h-full">
          {/* image background */}
          <div className="absolute top-0 lg:translate-y-0 lg:top-0 -right-8 lg:-right-30 w-full lg:w-3/4 z-0">
            <DataSVG className="w-full -z-10" />
          </div>

          {/* header section */}
          <div className="flex flex-col lg:w-5/9 z-10">
            <h2
              className="text-2xl md:text-6xl tracking-tight leading-tight mb-8 lg:mb-10"
              dangerouslySetInnerHTML={{
                __html: title,
              }}
            />
            <RichText
              data={heroGroup.heroDescription}
              className="text-lg md:text-2xl mb-4 md:mb-8 bg-white/5 backdrop-blur p-4 border border-white/20 shadow md:p-0 md:border-0 lg:backdrop-blur-none md:shadow-none"
            />
            <div className="text-lg hidden md:flex">
              <Button type="alternate">About us</Button>
            </div>
          </div>

          {/* grid items */}
          <div className="overflow-x-scroll -mx-8 px-8 snap-x snap-mandatory">
            <div className="flex lg:grid items-stretch lg:grid-cols-3 lg:gap-12 lg:flex-1 lg:place-content-center justify-start relative h-full w-[600%] lg:w-auto">
              {itemArray.map((item) => (
                <DataCard
                  key={item.key}
                  className="mr-4 p-4 px-8 lg:py-8 lg:m-0 gap-2 flex-col backdrop-blur lg:border border-white/5 rounded shadow bg-white text-black lg:text-white lg:bg-white/5 first:bg-white first:lg:text-black last:lg:bg-black w-[90%] flex lg:flex lg:w-auto whitespace-pre-wrap snap-center"
                >
                  <h4 className="text-base lg:text-2xl">{heroMap[item.key]}</h4>
                  <div className="">
                    <RichText
                      className="text-sm opacity-90 lg:[&_strong]:underline [&_strong]:font-medium lg:[&_strong]:font-bold"
                      data={item}
                    />
                  </div>
                </DataCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
