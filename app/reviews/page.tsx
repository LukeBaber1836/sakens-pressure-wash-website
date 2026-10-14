import type { Metadata } from "next";
import { Reviews } from "../components/reviews";
import { ServiceArea } from "../components/service-area";
import { SiteFooter } from "../components/site-footer";
import { SiteNav } from "../components/site-nav";
import { Accreditations } from "./accreditations";

export const metadata: Metadata = {
  title: "Reviews | Saken's Pressure Washing",
  description:
    "Rated 5.0 on Google across 132 reviews. A BBB Accredited Business, Tyler Area Chamber of Commerce member, and fully insured, serving Tyler and East Texas.",
};

export default function ReviewsPage() {
  return (
    <>
      <SiteNav />
      <main className="flex flex-1 flex-col">
        <Reviews lead />
        <Accreditations />
        <ServiceArea />
      </main>
      <SiteFooter />
    </>
  );
}
