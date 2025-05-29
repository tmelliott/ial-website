import { getPayload } from "payload";
import config from "@payload-config";
import ScrollingNumbers from "./components/Home/ScrollingNumbers";
import { letters } from "./components/Home/letters";
import HeroIntro from "./components/Home/Hero/01-intro";
import SmoothScroll from "./components/SmoothScroll";

const randomNumbers = Array.from({ length: 50 }).map((i) =>
  Array.from({ length: 200 }).map(
    (j) => letters[Math.floor(Math.random() * letters.length)]
  )
);

export default async function Home() {
  const payload = await getPayload({ config });
  const { titleGroup, heroGroup } = await payload.findGlobal({
    slug: "homeHero",
  });

  return (
    <SmoothScroll>
      <div className="text-white">
        <div className="h-screen pt-[var(--header-height)] flex flex-col items-center justify-end text-white pb-[10vh] relative">
          <ScrollingNumbers numbers={randomNumbers} />
          <h1 className="text-8xl max-w-6xl z-10">{titleGroup.title}</h1>
        </div>
        <HeroIntro
          title={heroGroup.heroTitle}
          desc={heroGroup.heroDescription}
        />
      </div>
    </SmoothScroll>
  );
}
