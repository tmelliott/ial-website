import { getPayload } from "payload";
import config from "@payload-config";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Link from "next/link";
import Image from "next/image";

export default async function Page() {
  const payload = await getPayload({ config });
  const { heading, purpose, pillars, team } = await payload.findGlobal({
    slug: "about",
  });
  const ourTeam = await payload.find({
    collection: "team",
    sort: "order",
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

      <div className="p-4 bg-gray-100">
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

        <section className="mb-8 lg:mb-24 lg:-mt-64 grid grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 max-w-4xl mx-auto lg:pl-36">
          <div className="hidden lg:block"></div>
          {ourTeam.docs.map((person) => (
            <Link
              href={"/team/" + person.slug}
              key={person.id}
              className="w-full space-y-4 bg-gray-300/10 p-2 rounded shadow hover:bg-gray-300/20"
            >
              <div className="w-full aspect-square bg-gray-300 relative">
                {person.photo && typeof person.photo !== "number" && (
                  <Image
                    src={person.photo.url ?? ""}
                    fill
                    alt={person.name.first}
                  />
                )}
              </div>
              <div className="">
                <div className="text-accent-600">
                  {person.name.title} {person.name.first} {person.name.last}
                </div>
                <div className="text-sm">{person.role}</div>
                <div className="text-gray-600 text-xs pt-1">{person.iwi}</div>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </div>
  );
}
