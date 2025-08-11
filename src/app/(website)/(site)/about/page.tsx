import { getPayload } from "payload";
import config from "@payload-config";
import { RichText } from "@payloadcms/richtext-lexical/react";

export default async function Page() {
  const payload = await getPayload({ config });
  const { heading, purpose, pillars, team } = await payload.findGlobal({
    slug: "about",
  });

  return (
    <div className="">
      <header className="bg-accent-800 p-4 text-white">
        <div className="max-w-4xl flex flex-col gap-8 mx-auto mt-8 lg:mt-48 lg:mb-12 ">
          <h1 className="text-5xl font-display pb-4 border-b">About us</h1>

          {heading && (
            <div className="flex-1 text-lg lg:text-xl">
              <RichText data={heading} />
            </div>
          )}
        </div>
      </header>

      <div className="p-4">
        <section className="my-8 lg:my-24 flex flex-col lg:flex-row gap-8 lg:gap-24 max-w-4xl mx-auto">
          {purpose && (
            <div className="space-y-6 lg:w-2/5">
              <h2 className="text-accent-600 font-display text-xl lg:text-2xl">
                {purpose.heading}
              </h2>
              <div className="lg:text-lg">
                {purpose.description && <RichText data={purpose.description} />}
              </div>
            </div>
          )}

          {pillars && (
            <div className="space-y-12 flex-1 lg:mt-24">
              {pillars.map((pillar) => (
                <div
                  key={pillar.id}
                  className="border-t border-gray-200 pt-2 space-y-2"
                >
                  <h4 className="text-accent-600 font-display lg:text-lg">
                    {pillar.heading}
                  </h4>
                  <div>
                    <RichText data={pillar.description} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <div className="p-4 bg-gray-200">
        <section className="my-8 lg:my-24 flex flex-col lg:flex-row gap-8 lg:gap-24 max-w-4xl mx-auto">
          {team && (
            <div className="space-y-6 lg:w-2/5">
              <h2 className="text-accent-600 font-display text-xl lg:text-2xl">
                {team.heading}
              </h2>
              <div className="lg:text-lg">
                {team.description && <RichText data={team.description} />}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
