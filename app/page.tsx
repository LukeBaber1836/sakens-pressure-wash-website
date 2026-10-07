import { Hero } from "./components/hero";
import { ServiceArea } from "./components/service-area";
import { ServicesBreakdown } from "./components/services-breakdown";
import { SiteNav } from "./components/site-nav";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main className="flex flex-1 flex-col">
        <Hero />
        <ServicesBreakdown />
        <ServiceArea />
      </main>
    </>
  );
}
