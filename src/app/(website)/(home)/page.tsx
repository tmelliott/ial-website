import type { Metadata } from "next";
import { getPayload } from "payload";
import config from "@payload-config";

import LandingPage from "./components/01-landing";

import Footer from "../components/Footer";
import Data from "./components/02-data";
import OurWork from "./components/03-our-work";
import OurTeam from "./components/04-our-team";
import OurCollab from "./components/05-our-collab";
import LatestNews from "./components/06-latest-news";

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config });

  const { metaTitle, metaDescription } = await payload.findGlobal({
    slug: "homeHero",
  });

  const { logo } = await payload.findGlobal({
    slug: "general",
  });

  const logoUrl =
    logo && typeof logo !== "number" && logo.url ? logo.url : undefined;

  return {
    title: metaTitle || "iNZight Analytics Ltd",
    description:
      metaDescription ||
      "iNZight Analytics Ltd is a New Zealand-based company that provides data analysis and visualisation services.",
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-icon.png",
    },
    themeColor: "#e83150",
    openGraph: {
      title: metaTitle || "iNZight Analytics Ltd",
      description:
        metaDescription ||
        "iNZight Analytics Ltd is a New Zealand-based company that provides data analysis and visualisation services.",
      images: logoUrl
        ? [
            {
              url: logoUrl,
              alt: "iNZight Analytics Ltd",
            },
          ]
        : undefined,
    },
  };
}

export default async function Home() {
  return (
    <div className="text-white">
      <LandingPage />
      <Data />
      <OurWork />
      <OurTeam />
      <OurCollab />
      <LatestNews />
      <Footer />
    </div>
  );
}
