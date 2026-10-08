"use client";

import { useState } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { cn } from "@/lib/utils";
import { DoodleCallout } from "./doodle-callout";
import { commercialServices, houseServices } from "./services-breakdown-data";
import { COMMERCIAL_VIEWBOX, commercialSurfacePaths } from "./services-commercial-surfaces";
import { HOUSE_VIEWBOX, houseSurfacePaths } from "./services-house-surfaces";
import { ServicesScene, type Scene } from "./services-scene";

type PropertyType = "residential" | "commercial";

// Tint for each surface while its service is active. Kept light enough for the linework to read through.
const houseColors: Record<string, string> = {
  roof: "oklch(0.52 0.02 255)",
  siding: "oklch(0.86 0.05 235)",
  windows: "oklch(0.93 0.004 250)",
  gutters: "oklch(0.66 0.08 60)",
  fence: "oklch(0.85 0.06 75)",
  patio: "oklch(0.8 0.035 65)",
  driveway: "oklch(0.85 0.015 80)",
  sidewalk: "oklch(0.8 0.02 75)",
};

const stone = "oklch(0.84 0.025 80)";
const lightGray = "oklch(0.9 0.006 250)";

const scenes: Record<PropertyType, Scene> = {
  residential: {
    image: {
      src: "/images/services-house.png",
      alt: "Line drawing of a two-story home with its roof, siding, windows, gutters, fence, patio, driveway, and sidewalk",
    },
    services: houseServices,
    surfaces: {
      viewBox: HOUSE_VIEWBOX,
      parts: houseServices.map(({ id }) => ({
        service: id,
        d: houseSurfacePaths[id],
        color: houseColors[id],
      })),
    },
  },
  commercial: {
    image: {
      src: "/images/services-commercial.png",
      alt: "Line drawing of a retail strip and gas station with fuel pumps, a striped parking lot, construction cones, and a dumpster enclosure",
    },
    services: commercialServices,
    surfaces: {
      viewBox: COMMERCIAL_VIEWBOX,
      parts: [
        { service: "building", d: commercialSurfacePaths.building, color: lightGray },
        { service: "gas-station", d: commercialSurfacePaths["gas-pad"], color: stone },
        {
          service: "parking-lot",
          d: commercialSurfacePaths["parking-lot"],
          color: "oklch(0.5 0.008 260)",
        },
        {
          service: "post-construction",
          d: commercialSurfacePaths["construction-storefront"],
          color: lightGray,
        },
        {
          service: "post-construction",
          d: commercialSurfacePaths["construction-cones"],
          color: "oklch(0.76 0.15 55)",
        },
        {
          service: "post-construction",
          d: commercialSurfacePaths["construction-stops"],
          color: "oklch(0.88 0.15 95)",
        },
        { service: "dumpster-pad", d: commercialSurfacePaths.dumpster, color: "oklch(0.45 0.08 155)" },
        { service: "dumpster-pad", d: commercialSurfacePaths["dumpster-pad"], color: stone },
      ],
    },
  },
};

const propertyTypes: { id: PropertyType; label: string }[] = [
  { id: "residential", label: "Residential" },
  { id: "commercial", label: "Commercial" },
];

const slide = { type: "spring", bounce: 0.15, visualDuration: 0.35 } as const;

export function ServicesExplorer() {
  const [type, setType] = useState<PropertyType>("residential");

  return (
    <MotionConfig reducedMotion="user">
      {/* Stacked above the scene, which tucks its empty sky up underneath. */}
      <div className="relative z-10 flex justify-center">
        <div className="relative">
          <div
            role="group"
            aria-label="Property type"
            className="glass flex gap-1 rounded-full p-1.5 [--glass-opacity:0.7]"
          >
            {propertyTypes.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                aria-pressed={type === id}
                onClick={() => setType(id)}
                className={cn(
                  "relative rounded-full px-5 py-2 text-sm font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand",
                  type === id ? "text-white" : "text-brand-foreground hover:bg-brand-foreground/5"
                )}
              >
                {type === id && (
                  <motion.span
                    layoutId="property-type-thumb"
                    transition={slide}
                    className="absolute inset-0 rounded-full bg-brand-foreground"
                  />
                )}
                <span className="relative">{label}</span>
              </button>
            ))}
          </div>

          {/* Nudge toward commercial; there's only room beside the toggle on wide screens. */}
          <AnimatePresence>
            {type === "residential" && (
              <motion.div
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                className="hidden lg:block"
              >
                <DoodleCallout>
                  We do commercial
                  <br />
                  projects too!
                </DoodleCallout>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        // The drawings start with ~8% of their width as blank sky; pull that up behind the toggle.
        className="-mt-4 sm:-mt-8 lg:-mt-12"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={type}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <ServicesScene scene={scenes[type]} />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </MotionConfig>
  );
}
