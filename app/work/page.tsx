import type { Metadata } from "next";
import { SiteFooter } from "../components/site-footer";
import { SiteNav } from "../components/site-nav";
import { PhotoGallery } from "./photo-gallery";
import { photos } from "./photos";
import { WorkHero } from "./work-hero";

export const metadata: Metadata = {
  title: "Our Work | Saken's Pressure Washing",
  description:
    "Photos from real pressure washing and soft washing jobs around Tyler and East Texas: homes, driveways, patios, windows and commercial properties.",
};

export default function WorkPage() {
  return (
    <>
      <SiteNav />
      <main className="flex flex-1 flex-col">
        {/* Rounded down to a tidy number for the pill. */}
        <WorkHero photoCount={Math.floor(photos.length / 10) * 10} />
        <PhotoGallery />
      </main>
      <SiteFooter />
    </>
  );
}
