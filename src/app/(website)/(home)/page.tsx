import type { Metadata, Viewport } from "next";
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

  const { metadata } = await payload.findGlobal({
    slug: "general",
  });

  if (!metadata) {
    return {
      title: "iNZight Analytics Ltd",
      description:
        "iNZight Analytics Ltd is a New Zealand-based company that provides data analysis and visualisation services.",
    };
  }

  const logo =
    metadata.image && typeof metadata.image !== "number" && metadata.image.url
      ? metadata.image.url
      : undefined;

  return {
    title: metadata.title || "iNZight Analytics Ltd",
    description:
      metadata.description ||
      "iNZight Analytics Ltd is a New Zealand-based company that provides data analysis and visualisation services.",
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-icon.png",
    },
    openGraph: {
      title: metadata.title ?? "",
      description: metadata.description ?? "",
      images: logo
        ? [
            {
              url: logo,
              alt: "iNZight Analytics Ltd",
            },
          ]
        : undefined,
    },
  };
}

export function generateViewport(): Viewport {
  return {
    themeColor: "#e83150",
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
