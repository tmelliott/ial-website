import { getPayload } from "payload";
import config from "@payload-config";
import ProjectCard from "../../components/ProjectCard";
import ActionCard from "../../components/ActionCard";

export default async function Page() {
  const payload = await getPayload({ config });

  const { heading } = await payload.findGlobal({
    slug: "projectsPage",
  });
  const { docs: projects } = await payload.find({
    collection: "projects",
    pagination: false,
  });

  return (
    <div className="">
      <header className="bg-linear-170 from-15% from-[var(--color-bg-gradient-start)] to-[125%] to-[var(--color-bg-gradient-end)]  p-4 text-white shadow-sm">
        <div className="max-w-6xl flex flex-col gap-8 mx-auto mt-8 lg:mt-36 mb-28">
          <h1 className="text-5xl font-display pb-12 flex gap-8">
            <strong>Kaupapa</strong>
            <div className="text-white/75">Projects</div>
          </h1>
        </div>
      </header>

      <div className="px-8">
        <section className="-mt-24 mb-24 flex flex-col gap-8 md:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-12 max-w-6xl mx-auto">
          <div className="md:col-span-2 h-full">
            <ActionCard title="" description={heading} variant="bright" />
          </div>
          {projects.map((item) => (
            <div key={item.id}>
              <ProjectCard id={item.id} direction="vertical" />
            </div>
          ))}
        </section>
      </div>

      <div className="bg-linear-355 from-15% from-[var(--color-bg-gradient-start)] to-[125%] to-[var(--color-bg-gradient-end)]  p-4 h-68"></div>
    </div>
  );
}
