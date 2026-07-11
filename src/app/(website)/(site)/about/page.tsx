import type { Metadata } from "next";
import { getPayload } from "payload";
import config from "@payload-config";
import { RichText } from "../../components/RichText";
import Link from "next/link";
import Button from "../../components/Button";
import cn from "../../utils/cn";
import PersonCard from "../../components/PersonCard";
import CTA from "../../components/CTA";
import PageHeader from "../../components/PageHeader";
import ActionCard from "../../components/ActionCard";

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config });
  const { metadata } = await payload.findGlobal({ slug: "about" });
  const { metadata: generalMetadata } = await payload.findGlobal({
    slug: "general",
  });

  const title =
    metadata?.title ||
    generalMetadata?.title ||
    "About - iNZight Analytics Ltd";
  const description =
    metadata?.description ||
    generalMetadata?.description ||
    "Learn about iNZight Analytics Ltd and our mission to provide data analysis and visualisation services.";

  const imageUrl =
    (metadata?.image &&
      typeof metadata.image !== "number" &&
      metadata.image.url) ||
    (generalMetadata?.image &&
      typeof generalMetadata.image !== "number" &&
      generalMetadata.image.url) ||
    undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: title,
            },
          ]
        : undefined,
    },
  };
}

export default async function Page() {
  const payload = await getPayload({ config });
  const { heading, purpose, pillars, team } = await payload.findGlobal({
    slug: "about",
  });
  const ourTeam = await payload.find({
    collection: "team",
    sort: "order",
    pagination: false,
    depth: 1,
  });

  const { feature } = await payload.findGlobal({
    slug: "homeCollaborators",
  });

  return (
    <div className="">
      <PageHeader primary="Mō mātau" secondary="About">
        {heading && <RichText data={heading} />}
      </PageHeader>

      <div className="px-8">
        <section className="pt-24 flex flex-col-reverse gap-12 md:grid md:grid-cols-2 lg:gap-24 max-w-6xl mx-auto">
          {pillars && (
            <div className="relative z-10 flex flex-col gap-6 lg:gap-8 lg:-mt-40">
              {pillars.map((pillar) => (
                <Link href={pillar.url} key={pillar.id} className="group block">
                  <div className="flex overflow-hidden rounded-tr-lg rounded-br-lg rounded-bl-lg border border-gray-100 border-l-0 bg-white shadow-sm transition hover:shadow-md hover:border-gray-200">
                    <div
                      className="w-1 flex-shrink-0 bg-accent-600 group-hover:bg-accent-700 transition-colors"
                      aria-hidden
                    />
                    <div className="flex-1 p-6 lg:p-8 min-w-0">
                      <h4 className="text-accent-600 font-display text-lg lg:text-xl font-semibold mb-3 group-hover:text-accent-700 transition-colors">
                        {pillar.heading}
                      </h4>
                      <RichText
                        data={pillar.description}
                        className="text-sm text-black/80 [&_strong]:font-medium"
                      />
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
                    View our projects
                  </Button>
                </Link>
              </div>

              {feature && (
                <div className="min-w-0 overflow-hidden mt-12">
                  <ActionCard
                    title={feature.title ?? ""}
                    description={feature.description}
                    button={{
                      text: feature.buttonText ?? "",
                      url: feature.buttonURL ?? "",
                    }}
                    variant="feature-rev"
                  />
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      <div
        className={cn("h-48 bg-gradient-to-b from-white to-[#F0F0F0] shadow")}
      ></div>

      <div className="px-8">
        <section
          id="team"
          className="pt-24 grid gap-12 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 max-w-6xl mx-auto pb-24"
        >
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

          {ourTeam.docs.map((person) => (
            <Link
              href={"/team/" + person.slug}
              key={person.id}
              className={
                cn()
                // index === 2 && "lg:col-start-2",
                // index > 1 && index < 5 && "lg:-translate-x-1/3"
              }
            >
              <PersonCard person={person} />
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
