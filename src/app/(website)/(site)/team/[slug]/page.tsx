import { getPayload } from "payload";
import config from "@payload-config";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Link from "next/link";
import Image from "next/image";
import { Keyword } from "@payload-types";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "team",
    where: {
      slug: {
        equals: slug,
      },
    },
  });
  const person = result.docs[0];

  const { team } = await payload.findGlobal({
    slug: "about",
  });
  const ourTeam = await payload.find({
    collection: "team",
    sort: "order",
    where: {
      slug: {
        not_equals: slug,
      },
    },
  });

  return (
    <div className="">
      <div className="p-4 bg-gray-100">
        <section className="my-8 lg:mt-24 flex flex-col lg:flex-row gap-8 lg:gap-24 max-w-6xl mx-auto">
          {team && (
            <div className="space-y-6 lg:w-1/3">
              <h2 className="text-accent-600 font-display text-xl lg:text-2xl">
                {team.heading}
              </h2>
              <div className="lg:text-lg">
                {team.description && <RichText data={team.description} />}
              </div>
            </div>
          )}
        </section>

        <section className="mb-8 lg:mb-24 flex flex-col-reverse lg:flex-row gap-8 lg:gap-12 max-w-6xl mx-auto">
          <div className="lg:w-2/5 space-y-2 border-t border-gray-200 pt-2">
            {ourTeam.docs.map((person) => (
              <Link
                href={"/team/" + person.slug}
                key={person.id}
                className="w-full flex gap-4 lg:pr-24"
              >
                <div className="">
                  <div className="text-accent-600 text-sm">
                    {person.name.title} {person.name.first} {person.name.last}
                  </div>
                  <div className="text-xs">{person.role}</div>
                </div>
              </Link>
            ))}
          </div>
          <div className="flex-1 space-y-4  lg:-mt-44 col-span-2">
            <div className="w-1/3 aspect-square bg-gray-300 relative">
              {person.photo && typeof person.photo !== "number" && (
                <Image
                  src={person.photo.url ?? ""}
                  fill
                  alt={person.name.first}
                  className="shadow"
                />
              )}
            </div>
            <div className="border-b border-gray-300 pb-6">
              <div className="text-accent-600">
                {person.name.title} {person.name.first} {person.name.last}
              </div>
              <div className="text-sm">{person.role}</div>
              <div className="text-gray-600 text-xs pt-1">{person.iwi}</div>
            </div>
            <div className="border-b border-gray-300 pb-2">
              {typeof person.bio !== "number" && <RichText data={person.bio} />}
            </div>
            <div className="border-b border-gray-300 pb-6 space-y-2 text-sm">
              {person.email && (
                <div>
                  Email: <a href="mailto:">{person.email}</a>
                </div>
              )}
              {person.socialMedia && person.socialMedia.length > 0 && (
                <>
                  <h5 className="text-xs font-bold pt-2">Other socials:</h5>
                  {person.socialMedia?.map((social) => (
                    <div key={social.id}>
                      {social.url && (
                        <a href={social.url} className="underline">
                          {new URL(social.url).hostname}
                          {social.name && ": " + social.name}
                        </a>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
            {person.keywords && (
              <div className="">
                <h4 className="text-x2-font-bold pb-2">
                  Research areas &amp; specialisations
                </h4>

                <div className="flex flex-wrap gap-4 text-xs">
                  {person.keywords.map((kw) => {
                    if (typeof kw === "number") return <></>;
                    return (
                      <div
                        key={kw.id}
                        className="border px-2 p-1 rounded border-gray-300 bg-gray-200/60"
                      >
                        {kw.title}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
