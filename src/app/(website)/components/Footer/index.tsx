import config from "@payload-config";
import NextImage from "next/image";
import Link from "next/link";
import { getPayload } from "payload";

import { SocialIcon } from "react-social-icons";

export default async function Footer() {
  const payload = await getPayload({ config });
  const { mainMenu, logo, footerMenu, socialLinks } = await payload.findGlobal({
    slug: "general",
  });

  return (
    <footer className="p-12 lg:p-24 bg-black text-white">
      <div className="max-w-6xl mx-auto flex justify-between flex-col lg:flex-row">
        <div className="flex flex-col gap-12 justify-between">
          <div className="flex text-sm gap-24">
            {mainMenu && (
              <ol className="flex flex-col gap-2">
                {mainMenu.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.location}
                      className="flex gap-4 items-center"
                    >
                      <div>{item.tereo}</div>
                      <div className="text-accent-600">{item.label}</div>
                    </Link>
                  </li>
                ))}
              </ol>
            )}
            {footerMenu && (
              <ol className="flex flex-col gap-2">
                {footerMenu.map((item) => (
                  <li key={item.id} className="flex gap-4 items-center">
                    <Link
                      href={item.location}
                      className="flex gap-4 items-center"
                    >
                      <div>{item.label}</div>
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="text-sm text-center lg:text-left flex flex-col gap-4">
            {socialLinks && (
              <div className="flex gap-4 justify-center lg:justify-start">
                {socialLinks.map((link) => (
                  <SocialIcon
                    url={link.url}
                    key={link.id}
                    style={{
                      height: "2em",
                      width: "2em",
                    }}
                  />
                ))}
              </div>
            )}
            <div>&copy; iNZight Analytics Ltd 2025</div>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col items-center lg:items-end max-w-xs mt-12 lg:mt-0 mx-auto lg:mx-0">
            <p className="text-lg pb-12 lg:pb-38 text-center lg:text-right">
              Analytics, research, and data visualisation that make a
              difference.
            </p>
            <div className="relative h-24 w-full">
              {typeof logo !== "number" && (
                <NextImage
                  src={logo.url ?? ""}
                  alt="iNZight Analytics Ltd"
                  fill
                  className="object-contain lg:object-right"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
