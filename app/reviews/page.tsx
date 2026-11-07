import type { Metadata } from "next";
import { LogoWall } from "../components/logo-wall";
import { Reviews } from "../components/reviews";
import { ServiceArea } from "../components/service-area";
import { SiteFooter } from "../components/site-footer";
import { SiteNav } from "../components/site-nav";
import { Accreditations } from "./accreditations";
import { pageMetadata } from "../seo";

export const metadata: Metadata = pageMetadata({
  title: "Customer Reviews",
  description:
    "Rated 5.0 on Google across 85 reviews. A BBB Accredited Business, Tyler Area Chamber of Commerce member, and fully insured, serving Tyler and East Texas.",
  path: "/reviews",
});

export default function ReviewsPage() {
  return (
    <>
      <SiteNav />
      <main className="flex flex-1 flex-col">
        <Reviews lead />
        <LogoWall className="mt-16 sm:mt-20" />
        <Accreditations />
        <ServiceArea />
      </main>
      <SiteFooter />
    </>
  );
}
