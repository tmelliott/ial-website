import { getPayload } from "payload";
import config from "@payload-config";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Image from "next/image";
import Button from "@/app/(website)/components/Button";
import { SocialIcon } from "react-social-icons";
import PersonCard from "@/app/(website)/components/PersonCard";
import CTA from "@/app/(website)/components/CTA";
import Link from "next/link";

export async function generateStaticParams() {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "team",
    pagination: false,
  });

  return result.docs.map((person) => ({
    slug: person.slug,
  }));
}

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

  const keywords = person.keywords?.filter(
    (kw) => kw !== undefined && typeof kw !== "number"
  );

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
      <header className="bg-linear-20 from-15% from-[var(--color-bg-gradient-start)] to-[150%] to-[var(--color-bg-gradient-end)]  px-8 text-white shadow-sm">
        <div className="max-w-6xl grid grid-cols-5 lg:grid-cols-6 gap-8 mx-auto pt-12 lg:pt-36 pb-8 lg:pb-12">
          <div className="col-span-3">
            <h1 className="text-2xl lg:text-4xl font-display pb-4 lg:pb-8">
              {person.name.title} {person.name.first}&nbsp;{person.name.last}
            </h1>
            <div className="lg:text-2xl pb-2 lg:pb-4">{person.role}</div>
            <div className="lg:text-2xl text-accent-600">{person.iwi}</div>
          </div>
          <div className="hidden lg:block"></div>
          <div className="col-span-2 relative">
            <div className="lg:absolute left-0 right-0">
              <div className="relative aspect-square mb-4 lg:mb-12">
                <Image
                  src={
                    person.photo &&
                    typeof person.photo !== "number" &&
                    person.photo.url
                      ? person.photo.url
                      : "/profile-placeholder.png"
                  }
                  width={500}
                  height={500}
                  alt={person.name.first}
                  className="shadow object-cover"
                />
              </div>
              {person.email && (
                <Link href={`/contact?person=${person.slug}`}>
                  <Button
                    type="primary"
                    className="w-full text-sm lg:text-base"
                  >
                    Email {person.name.first}
                  </Button>
                </Link>
              )}
              <div className="lg:text-black pb-6 space-y-2 text-sm">
                {person.socialMedia && person.socialMedia.length > 0 && (
                  <>
                    <div className="flex gap-4 pt-4">
                      {person.socialMedia?.map((social) => (
                        <SocialIcon
                          url={social.url ?? ""}
                          key={social.id}
                          style={{
                            height: 36,
                            width: 36,
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="px-8">
        <section className="mb-8 lg:mb-12 grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto pt-12">
          <div className="">
            <div className="pb-12 lg:pb-24">
              {typeof person.bio !== "number" && (
                <RichText data={person.bio} className="[&_p]:pb-6" />
              )}
            </div>

            {keywords && keywords.length > 0 && (
              <div className="">
                <h4 className="text-x2-font-bold uppercase text-sm pb-4">
                  Research areas &amp; specialisations
                </h4>

                <div className="flex gap-4 flex-wrap">
                  {person.keywords
                    ?.filter((kw) => typeof kw !== "number")
                    .map((kw) => (
                      <Button
                        key={kw.id}
                        type="alternate"
                        className="text-gray-400 border-gray-400 text-xs lg:text-sm"
                      >
                        {kw.title}
                      </Button>
                    ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
      <div className="h-48 bg-gradient-to-b from-white to-[#F0F0F0]"></div>

      <div className="pt-8 md:-mt-36 px-8 ">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 lg:mb-24">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg">The rest of the team</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {ourTeam.docs.map((member) => (
                <PersonCard key={member.id} id={member.id} />
              ))}
            </div>
          </div>
        </div>

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
