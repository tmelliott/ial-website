import { getPayload } from "payload";
import config from "@payload-config";
import Button from "../../components/Button";
import ProjectCard from "../../components/ProjectCard";

export default async function OurWork() {
  const payload = await getPayload({ config });

  const projects = await payload.find({
    collection: "projects",
    where: {
      featured: {
        equals: true,
      },
    },
  });

  return (
    <div className="px-8 text-white -mt-80 mb-30 pt-36 z-10 relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12 w-full">
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

        <div className="grid md:grid-cols-3 gap-12">
          {projects.docs.map((project, index) => (
            <div key={project.id} className="first:col-span-full h-full">
              <ProjectCard
                id={project.id}
                direction={index === 0 ? "horizontal" : "vertical"}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
