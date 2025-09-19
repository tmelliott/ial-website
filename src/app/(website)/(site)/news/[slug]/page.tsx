import { getPayload } from "payload";
import config from "@payload-config";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Image from "next/image";
import Link from "next/link";
import { asImage } from "@/app/(website)/utils/asImage";

export async function generateStaticParams() {
  const payload = await getPayload({ config });
  const result = await payload.find({
    collection: "news",
    pagination: false,
  });

  return result.docs.map((item) => ({
    slug: item.slug,
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
    collection: "news",
    where: {
      slug: {
        equals: slug,
      },
    },
  });
  const item = result.docs[0];

  const banner = asImage(item.gallery && item.gallery[0]);

  return (
    <div className="">
      {banner && typeof banner !== "number" && (
        <div className="max-w-4xl mx-auto mt-12 h-36 lg:h-96 bg-gray-300 relative">
          <Image
            src={banner.url ?? ""}
            fill
            alt={banner.description ?? item.title}
            className="shadow object-cover"
          />
        </div>
      )}

      <div className="p-4">
        <section className="max-w-4xl mx-auto space-y-4 pb-12 lg:pb-24">
          <h1 className="text-accent-600 pt-4 lg:pt-6 lg:pb-4 text-2xl lg:text-4xl font-display leading-tight">
            {item.title}
          </h1>
          <div className="flex gap-4">
            {item.team?.map((member) => {
              if (typeof member === "number") return;
              const photo =
                member.photo && typeof member.photo !== "number"
                  ? member.photo
                  : undefined;
              return (
                <Link
                  href={`/team/${member.slug}`}
                  key={member.id}
                  className="rounded-full shadow overflow-clip"
                >
                  {photo ? (
                    <Image
                      width={48}
                      height={48}
                      src={photo?.url ?? ""}
                      alt={member.fullname}
                    />
                  ) : (
                    <div className="flex justify-center items-center h-12 w-12 text-xl">
                      {member.name.first.substring(0, 1) +
                        member.name.last.substring(0, 1)}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
          <div className="flex-1 space-y-4 col-span-2">
            <div className="border-b border-gray-300 pb-2">
              <RichText data={item.content} />
            </div>
            {item.link && (
              <div className="border-b border-gray-300 pb-2">
                <Link href={item.link}>{item.link}</Link>
              </div>
            )}
            {item.keywords && item.keywords.length > 0 && (
              <div className="border-b border-gray-300 pb-4 space-y-2 text-sm">
                <div className="flex flex-wrap gap-4 text-xs">
                  {item.keywords.map((kw) => {
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
            {/* {new.linkGroups && new.linkGroups.length > 0 && (
              <div className="border-b border-gray-300 pb-6">
                <h4 className="text-lg font-display pb-4">new links</h4>

                <div className="space-y-4">
                  {new.linkGroups.map((lg) => (
                    <div key={lg.id}>
                      <div className="">
                        <strong className="font-bold">{lg.label}</strong>
                        <ul className="list-disc list-inside">
                          {lg.groupLinks.map((link) => (
                            <li key={link.id}>
                              <Link href={link.link}>{link.description}</Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )} */}
          </div>
        </section>
      </div>
    </div>
  );
}
