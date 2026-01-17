import { getPayload } from "payload";
import config from "@payload-config";

import Image from "next/image";

export default async function PersonCard({
  id,
}: {
  id: number;
  featured?: boolean;
}) {
  const payload = await getPayload({ config });
  const person = await payload.findByID({
    collection: "team",
    id: id,
  });

  const photo = person.photo && typeof person.photo !== "number" ? person.photo : null;
  const objectPosition =
    photo?.focalX !== null && photo?.focalX !== undefined && photo?.focalY !== null && photo?.focalY !== undefined
      ? `${photo.focalX}% ${photo.focalY}%`
      : undefined;

  return (
    <div className="rounded shadow overflow-clip flex flex-col h-full">
      <div className="w-full aspect-square relative">
        <Image
          src={
            photo?.url
              ? photo.url
              : "/profile-placeholder.png"
          }
          fill
          alt={person.name.first}
          className="object-cover"
          style={objectPosition ? { objectPosition } : undefined}
        />
      </div>
      <div className="flex-1 py-2 px-4 md:py-4 md:px-6 flex flex-col">
        <div className="text-accent-600">
          {person.name.title} {person.name.first} {person.name.last}
        </div>
        <div className="text-sm flex-1 pb-2">{person.role}</div>
        <div className="text-gray-600 text-xs pt-1">{person.iwi}</div>
      </div>
    </div>
  );
}
