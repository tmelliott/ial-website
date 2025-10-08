import { getPayload } from "payload";
import config from "@payload-config";
import ProjectCard from "../../components/ProjectCard";
import ActionCard from "../../components/ActionCard";
import CTA from "../../components/CTA";
import ChainPattern from "../../components/Patterns/Chain";

export default async function Page() {
  const payload = await getPayload({ config });

  const { heading } = await payload.findGlobal({
    slug: "projectsPage",
  });
  const { docs: projects } = await payload.find({
    collection: "projects",
    pagination: true,
  });

  return (
    <div className="">
      <header className="bg-linear-170 from-15% from-[var(--color-bg-gradient-start)] to-[125%] to-[var(--color-bg-gradient-end)]  p-4 text-white shadow-sm relative z-0">
        <div className="absolute inset-0 max-w-6xl mx-auto flex justify-end">
          <ChainPattern fillColor="#ffffff" className="w-full " />
        </div>
        <div className="max-w-6xl flex flex-col gap-8 mx-auto mt-8 lg:mt-36 mb-20">
          <h1 className="text-5xl font-display pb-12 flex flex-col gap-4">
            <div>Kaupapa</div>
            <div className="text-white/75">Projects</div>
          </h1>
        </div>
      </header>

      <div className="px-8 relative z-10">
        <section className="-mt-24 mb-24 flex flex-col gap-8 md:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-12 max-w-6xl mx-auto">
          <div className="md:col-span-2 h-full">
            <ActionCard
              title=""
              description={heading}
              variant="bright"
              button={{
                text: "Highlight button",
                url: "",
              }}
            />
          </div>
          {projects.map((item) => (
            <div key={item.id}>
              <ProjectCard id={item.id} direction="vertical" />
            </div>
          ))}
        </section>
        <CTA
          text1="Got a project idea?"
          text2="Let's work together"
          text3="Get in touch"
          url="/contact"
        />
      </div>
    </div>
  );
}
