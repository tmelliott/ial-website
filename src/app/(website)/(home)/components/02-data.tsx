import { getPayload } from "payload";
import config from "@payload-config";
import { RichText } from "../../components/RichText";
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
    <div className="bg-black pb-60 lg:pb-80 h-full overflow-clip">
      <div className="text-white px-8">
        <div className="max-w-6xl mx-auto flex flex-col justify-between lg:justify-start gap-8 lg:gap-10 pt-12 lg:pt-24 relative h-full">
          {/* title + lead: image in right column (~50%), items below on solid black */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 items-start lg:items-end pb-6 lg:pb-10">
            <div className="flex flex-col relative z-10">
              <h2
                className="text-2xl md:text-6xl tracking-tight leading-tight mb-8 lg:mb-10"
                dangerouslySetInnerHTML={{
                  __html: title,
                }}
              />
              <RichText
                data={heroGroup.heroDescription}
                className="text-lg md:text-2xl mb-4 md:mb-8"
              />
              <div className="text-lg hidden md:flex">
                <Button type="alternate" href="/about">
                  About us
                </Button>
              </div>
            </div>

            <div className="hidden lg:block">
              <DataSVG className="w-full h-auto" />
            </div>
          </div>

          <div className="overflow-x-scroll lg:overflow-hidden -mx-8 px-8 snap-x snap-mandatory lg:snap-none">
            <div className="flex lg:grid items-stretch lg:grid-cols-3 lg:gap-12 lg:flex-1 lg:place-content-center justify-start relative h-full w-[600%] lg:w-auto">
              {itemArray.map((item) => (
                <DataCard
                  key={item.key}
                  className="mr-8 lg:m-0 flex gap-4 w-[85%] lg:w-auto snap-center cursor-default"
                >
                  <div
                    className="w-1 flex-shrink-0 rounded-full bg-accent-500"
                    aria-hidden
                  />
                  <div className="flex flex-col gap-2 min-w-0">
                    <h4 className="text-base lg:text-2xl font-semibold">
                      {heroMap[item.key]}
                    </h4>
                    <RichText
                      className="text-sm text-white/90 [&_strong]:font-medium lg:[&_strong]:font-bold"
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
