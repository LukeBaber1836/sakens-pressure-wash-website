import type { Metadata } from "next";
import { ServicesExplorer } from "../components/services-explorer";
import { SiteFooter } from "../components/site-footer";
import { SiteNav } from "../components/site-nav";
import { Faq } from "./faq";
import { MethodsCompare } from "./methods-compare";
import { ServiceList } from "./service-list";

export const metadata: Metadata = {
  title: "Services | Saken's Pressure Washing",
  description:
    "Roof cleaning, house soft washing, driveways, windows, gutters, fences and commercial pressure washing in Tyler and East Texas. Free in-person estimates.",
};

export default function ServicesPage() {
  return (
    <>
      <SiteNav />
      <main className="flex flex-1 flex-col">
        <section
          aria-labelledby="services-heading"
          className="site-container pt-10 pb-20 sm:pt-16 sm:pb-26"
        >
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
            <h1
              id="services-heading"
              className="text-5xl leading-[1.02] font-extrabold tracking-[-0.025em] text-brand-foreground sm:text-[60px]"
            >
              From the roof down to the sidewalk
            </h1>
          </div>

          <div className="mt-12 sm:mt-14">
            <ServicesExplorer linkTo="details" />
          </div>
        </section>

        <MethodsCompare />
        <ServiceList />
        <Faq />
      </main>
      <SiteFooter />
    </>
  );
}
