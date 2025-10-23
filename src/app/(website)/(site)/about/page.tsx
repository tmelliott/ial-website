import { getPayload } from "payload";
import config from "@payload-config";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Link from "next/link";
import Button from "../../components/Button";
import cn from "../../utils/cn";
import PersonCard from "../../components/PersonCard";
import CTA from "../../components/CTA";
import PageHeader from "../../components/PageHeader";

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
      <PageHeader primary="Mō mātau" secondary="About">
        {heading && <RichText data={heading} />}
      </PageHeader>

      <div className="px-8">
        <section className="pt-24 flex flex-col-reverse gap-12 md:grid md:grid-cols-2 lg:gap-24 max-w-6xl mx-auto">
          {pillars && (
            <div className="flex flex-col gap-8 lg:-mt-40">
              {pillars.map((pillar) => (
                <Link href={pillar.url} key={pillar.id}>
                  <div className="p-8 card-gradient-white border border-gray-100 shadow rounded group hover:card-gradient-bright hover:text-white">
                    <h4 className="text-[#E83150] font-display lg:text-xl mb-4 group-hover:text-white">
                      {pillar.heading}
                    </h4>
                    <div>
                      <RichText data={pillar.description} className="text-sm" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {purpose && (
            <div className="pt-8">
              <h2 className="font-display text-2xl lg:text-5xl leading-tight mb-12">
                {purpose.heading}
              </h2>
              <div className="lg:text-xl">
                {purpose.description && (
                  <RichText data={purpose.description} className="[&_p]:mb-8" />
                )}
              </div>

              <div className="flex flex-col gap-4 mt-24">
                <Link href="/contact" className="w-full">
                  <Button type="primary" className="w-full">
                    Want to get started? Get in touch
                  </Button>
                </Link>
                <Link href="/projects" className="w-full">
                  <Button type="secondary" className="w-full">
                    View our work
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </section>
      </div>

      <div
        className={cn("h-48 bg-gradient-to-b from-white to-[#F0F0F0] shadow")}
      ></div>

      <div className="px-8">
        <section className="pt-24 grid gap-12 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-6xl mx-auto pb-24">
          {team && (
            <div className="col-span-2 flex flex-col gap-4 lg:gap-8 pr-12">
              <h2 className="font-display text-2xl lg:text-3xl">
                {team.heading}
              </h2>
              <div className="text-lg lg:text-xl">
                {team.description && <RichText data={team.description} />}
              </div>
            </div>
          )}

          {ourTeam.docs.map((person, index) => (
            <Link
              href={"/team/" + person.slug}
              key={person.id}
              className={cn(
                index === 2 && "lg:col-start-2",
                index > 1 && index < 5 && "lg:-translate-x-1/3"
              )}
            >
              <PersonCard id={person.id} />
            </Link>
          ))}
        </section>
        <CTA
          text1="Want to work with us?"
          text2=""
          text3="Get in touch"
          url="/contact"
        />
      </div>
    </div>
  );
}
