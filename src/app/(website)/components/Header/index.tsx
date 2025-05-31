import { getPayload } from "payload";
import config from "@payload-config";
import Link from "next/link";
// import Image from "next/image";
// import { Image as PImage } from "@payload-types";

// const isValidLogo = (image: number | PImage): image is PImage => {
//   return typeof image !== "number";
// };

export default async function Header() {
  const payload = await getPayload({ config });
  const { logo } = await payload.findGlobal({
    slug: "general",
  });

  if (typeof logo === "number") throw "Bad image";

  return (
    <div className="text-white bg-black px-8 py-4 flex justify-between items-center absolute z-10  w-full h-[var(--header-height)]">
      {/* Left hand side - logo */}
      <Link href="https://inzight.co.nz">
        LOGO
        {/* {logo.url && logo.alt && logo.width && logo.height && (
          <Image
            src={logo.url}
            alt={logo.alt}
            width={logo.width}
            height={100}
          />
        )} */}
      </Link>

      {/* Right hand size - nav */}
      <nav>NAV</nav>
    </div>
  );
}
