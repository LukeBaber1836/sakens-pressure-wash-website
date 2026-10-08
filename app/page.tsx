import { Hero } from "./components/hero";
import { MissionStatement } from "./components/mission-statement";
import { ServiceArea } from "./components/service-area";
import { ServicesBreakdown } from "./components/services-breakdown";
import { SiteFooter } from "./components/site-footer";
import { SiteNav } from "./components/site-nav";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main className="flex flex-1 flex-col">
        <Hero />
        <ServicesBreakdown />
        <MissionStatement />
        <ServiceArea />
      </main>
      <SiteFooter />
    </>
  );
}
