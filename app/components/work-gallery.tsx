"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  MotionConfig,
  useInView,
  useReducedMotion,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { TbArrowUpRight } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./eyebrow";

const photos = [
  {
    src: "/images/crew-white-house-rinse-01.jpeg",
    alt: "Crew member rinsing the siding of a large white two-story house",
    title: "House soft wash",
  },
  {
    src: "/images/stamped-driveway-star-01.jpeg",
    alt: "Freshly cleaned stamped concrete driveway in front of a stone house",
    title: "Stamped concrete driveway",
  },
  {
    src: "/images/crew-stone-house-01.jpeg",
    alt: "Crew member washing the stone exterior of a house with an extension wand",
    title: "Stone exterior",
  },
  {
    src: "/images/covered-patio-clean-01.jpeg",
    alt: "Covered patio mid-wash, with the cleaned concrete next to the dirty section",
    title: "Covered patio",
  },
  {
    src: "/images/pool-deck-steps-01.jpeg",
    alt: "Bright, clean pool deck and steps around a backyard pool",
    title: "Pool deck",
  },
  {
    src: "/images/glass-storefront-01.jpeg",
    alt: "Spotless floor-to-ceiling glass on a commercial storefront",
    title: "Storefront glass",
  },
  {
    src: "/images/concrete-spw-logo-clean-01.jpeg",
    alt: "The letters SPW pressure washed into a dirty concrete slab",
    title: "Concrete cleaning",
  },
];

// How long each photo stays open before the gallery moves on by itself.
const CYCLE_MS = 5000;

/**
 * A row of narrow photo strips from recent jobs. Hovering, focusing or tapping a strip widens it to
 * show the whole photo; the last one picked stays open. Left alone and on screen, it opens the next
 * photo every few seconds.
 */
export function WorkGallery() {
  const [active, setActive] = useState(1);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const stripsRef = useRef<HTMLDivElement>(null);
  const inView = useInView(stripsRef, { amount: 0.4 });
  const reduced = useReducedMotion();

  // Restarts whenever the open photo changes, so a photo someone just picked gets the full time.
  useEffect(() => {
    if (!inView || hovered || focused || reduced) return;
    const timer = setTimeout(
      () => setActive((i) => (i + 1) % photos.length),
      CYCLE_MS,
    );
    return () => clearTimeout(timer);
  }, [active, inView, hovered, focused, reduced]);

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="work"
        aria-labelledby="work-heading"
        className="bg-white"
      >
        <div className="site-container py-20 sm:py-26">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center"
          >
            <Eyebrow>
              Our work
            </Eyebrow>
            <h2
              id="work-heading"
              className="text-4xl leading-[1.08] font-extrabold tracking-[-0.02em] text-brand-foreground sm:text-[44px]"
            >
              Recent Jobs
            </h2>
          </motion.div>

          {/* Strips run across on large screens and stack on small ones; the open one takes most of
              the space either way. */}
          <div
            ref={stripsRef}
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            onFocus={() => setFocused(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false);
            }}
            className="mt-10 flex h-[34rem] flex-col gap-2 sm:mt-14 lg:h-[clamp(26rem,62vh,38rem)] lg:flex-row lg:gap-3"
          >
            {photos.map((photo, i) => {
              const open = active === i;
              return (
                <button
                  key={photo.src}
                  type="button"
                  aria-label={photo.title}
                  aria-pressed={open}
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={cn(
                    "group relative min-h-0 min-w-0 basis-0 overflow-hidden rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-secondary",
                    "transition-[flex-grow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
                    open ? "grow-[6]" : "grow",
                  )}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className={cn(
                      "object-cover transition-transform duration-700 ease-out",
                      !open && "scale-110",
                    )}
                  />
                  {/* Caption, only on the open strip. */}
                  <span
                    className={cn(
                      "absolute inset-x-0 bottom-0 flex items-end bg-linear-to-t from-black/60 to-transparent p-5 pt-16 text-left transition-opacity duration-500",
                      open ? "opacity-100 delay-200" : "opacity-0",
                    )}
                  >
                    <span className="font-heading text-lg font-bold text-white sm:text-xl">
                      {photo.title}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center sm:mt-12">
            <Button
              variant="brand"
              size="xl"
              nativeButton={false}
              render={<Link href="/work" />}
            >
              View full gallery
              <TbArrowUpRight data-icon="inline-end" />
            </Button>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
