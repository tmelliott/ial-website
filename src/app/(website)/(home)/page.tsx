import LandingPage from "./components/01-landing";

import Footer from "../components/Footer";
import Data from "./components/02-data";
import OurWork from "./components/03-our-work";

export default async function Home() {
  // const collaborators = await payload.findGlobal({
  //   slug: "homeCollaborators",
  // });

  return (
    <div className="text-white">
      <LandingPage />
      <Data />
      <OurWork />
      <Footer />
    </div>
  );
}
