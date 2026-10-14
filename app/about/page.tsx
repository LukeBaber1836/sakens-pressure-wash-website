import type { Metadata } from "next";
import { MeetTheOwner } from "../components/meet-the-owner";
import { MissionStatement } from "../components/mission-statement";
import { ServiceArea } from "../components/service-area";
import { SiteFooter } from "../components/site-footer";
import { SiteNav } from "../components/site-nav";
import { OurValues } from "./our-values";

export const metadata: Metadata = {
  title: "About | Saken's Pressure Washing",
  description:
    "Meet Saken Sawyer, a Tyler native and UT Tyler graduate whose local crew brings excellent work, integrity and hospitality to every pressure washing job in East Texas.",
};

export default function AboutPage() {
  return (
    <>
      <SiteNav />
      <main className="flex flex-1 flex-col">
        <MeetTheOwner lead />
        <OurValues />
        <MissionStatement />
        <ServiceArea />
      </main>
      <SiteFooter />
    </>
  );
}
