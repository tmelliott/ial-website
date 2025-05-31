import { getPayload } from "payload";
import config from "@payload-config";
import ScrollingNumbers from "./components/Home/ScrollingNumbers";
import { letters } from "./components/Home/letters";
import HeroIntro from "./components/Home/Hero/01-intro";
import SmoothScroll from "./components/SmoothScroll";
import HeroData from "./components/Home/Hero/02-data";

const randomNumbers = Array.from({ length: 10 }).map((i) =>
  Array.from({ length: 20 }).map(
    (j) => letters[Math.floor(Math.random() * letters.length)]
  )
);

export default async function Home() {
  const payload = await getPayload({ config });
  const { titleGroup, heroGroup } = await payload.findGlobal({
    slug: "homeHero",
  });

  return (
    <SmoothScroll snapAt={["section"]}>
      <div className="text-white">
        <div className="h-screen pt-[var(--header-height)] flex flex-col items-center justify-end text-white pb-[10vh] relative">
          {/* <ScrollingNumbers numbers={randomNumbers} /> */}
          <h1 className="text-4xl p-8 lg:text-7xl leading-tight max-w-6xl z-10 font-display">
            {titleGroup.title}
          </h1>
        </div>
        <HeroIntro
          title={heroGroup.heroTitle}
          desc={heroGroup.heroDescription}
        />
        <HeroData items={heroGroup.heroItems} />
      </div>
    </SmoothScroll>
  );
}
