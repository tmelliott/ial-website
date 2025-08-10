import { getPayload } from "payload";
import config from "@payload-config";
import Link from "next/link";
import Image from "next/image";
import MainMenu from "./MainMenu";

export default async function Header() {
  const payload = await getPayload({ config });
  const { logo, mainMenu } = await payload.findGlobal({
    slug: "general",
  });

  if (typeof logo === "number") throw "Bad image";

  return (
    <div className="text-white bg-black px-8 py-4 flex justify-between items-center absolute z-10  w-full h-[var(--header-height)]">
      {/* Left hand side - logo */}
      <Link
        href={process.env.NEXT_PUBLIC_URL ?? ""}
        className="relative h-full aspect-[3]"
      >
        <Image
          src={logo.url ?? ""}
          alt="iNZight Analytics Ltd"
          fill
          className="object-contain object-left"
        />
      </Link>

      {/* Right hand size - nav */}
      <MainMenu items={mainMenu} />
    </div>
  );
}
