import { getPayload } from "payload";
import config from "@payload-config";
import Button from "../../components/Button";
import ProjectCard from "../../components/ProjectCard";
import AppCarousel from "../../components/AppCarousel";

import CTA from "../../components/CTA";
import ActionCard from "../../components/ActionCard";

export default async function OurWork() {
  const payload = await getPayload({ config });
  const { featuredApps, featuredProjects, cards } = await payload.findGlobal({
    slug: "homeProjects",
  });

  // Grab featured apps that are not of type number and fetch their full data
  const featuredAppList =
    featuredApps !== undefined && Array.isArray(featuredApps)
      ? featuredApps.filter((app) => typeof app !== "number")
      : undefined;

  // Fetch full app data for all featured apps
  const appsData = featuredAppList
    ? await Promise.all(
        featuredAppList.map(async (app) => {
          const appData = await payload.findByID({
            collection: "apps",
            id: app.id,
          });

          // Fetch placeholder for banner image if it exists
          let placeholder: string | undefined;
          if (appData.banner && typeof appData.banner !== "number") {
            const getPlaceholder = (await import("../../utils/getPlaceholder"))
              .default;
            const imgsrc =
              appData.banner.sizes?.square?.url ?? appData.banner.url ?? null;
            placeholder = await getPlaceholder(imgsrc);
          }

          return {
            ...appData,
            bannerPlaceholder: placeholder,
          };
        })
      )
    : [];

  return (
    <div className="px-8 text-white -mt-80 pt-36 z-10 relative">
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex justify-between items-center mb-4 lg:mb-12 w-full">
          <h3 className="text-2xl">Our work</h3>

          <div className="flex items-center gap-12">
            <p className="text-sm hidden md:block">
              Want to see more of our work?
            </p>
            <Button type="alternate" className="text-sm">
              View all work
            </Button>
          </div>
        </div>

        <div className="mb-8 lg:mb-12">
          {appsData.length > 0 && (
            <div className="col-span-full h-full row-span-2">
              <AppCarousel apps={appsData} />
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {featuredProjects &&
            featuredProjects
              .filter((x) => typeof x !== "number")
              .map((project) => (
                <div key={project.id}>
                  <ProjectCard id={project.id} direction="vertical" />
                </div>
              ))}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-8 lg:gap-12">
            {cards?.map((card, index) => (
              <ActionCard
                key={card.id}
                title={card.label}
                button={{
                  text: card.linkText,
                  url: card.linkUrl,
                }}
                variant={index === 0 ? "bright" : "feature"}
              />
            ))}
          </div>
        </div>
      </div>

      <CTA
        text1="Got an idea for a project?"
        text2="Work with us."
        text3="Contact us"
        url="/contact"
      />
    </div>
  );
}
