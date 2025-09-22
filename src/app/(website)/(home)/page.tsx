import LandingPage from "./components/01-landing";

import Footer from "../components/Footer";
import Data from "./components/02-data";
import OurWork from "./components/03-our-work";
import OurTeam from "./components/04-our-team";
import OurCollab from "./components/05-our-collab";
import LatestNews from "./components/06-latest-news";

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
