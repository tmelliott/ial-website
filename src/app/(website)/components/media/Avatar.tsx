import { Team } from "@payload-types";
import Image from "next/image";

export default function Avatar({ person }: { person: Team }) {
  const img = person.photo;

  const avatar =
    img && typeof img != "number" && img.url ? (
      <Image src={img.url} alt={person.fullname} height={48} width={48} />
    ) : (
      <div className="text-lg flex items-center justify-center h-full w-full bg-gray-100">
        {person.name.first.substring(0, 1)}
        {person.name.last.substring(0, 1)}
      </div>
    );
  return (
    <div className="h-12 w-12 rounded-full overflow-clip shadow">{avatar}</div>
  );
}
