"use client";

import { motion, MotionConfig } from "motion/react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./eyebrow";
import { ReviewsColumn } from "./reviews-column";
import { reviews } from "./reviews-data";

// Reviews are dealt round-robin so every column mixes long and short ones and opens on a strong one.
// Speed is set per card, so a column's pass grows with its list instead of rushing through it. The
// middle column runs downward, against the outer two.
const columnSettings = [
  { secondsPerCard: 10.5, direction: "up", className: undefined },
  { secondsPerCard: 13, direction: "down", className: "hidden md:block" },
  { secondsPerCard: 12, direction: "up", className: "hidden lg:block" },
] as const;

const columns = columnSettings.map(({ secondsPerCard, ...column }, i) => {
  const list = reviews.filter((_, r) => r % columnSettings.length === i);
  return { ...column, reviews: list, duration: list.length * secondsPerCard };
});

/** `lead` makes this the page's opening section: less space above it, and the heading becomes the h1. */
export function Reviews({ lead = false }: { lead?: boolean }) {
  const Heading = lead ? "h1" : "h2";

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="reviews"
        aria-labelledby="reviews-heading"
        className={cn("site-container", lead ? "pt-10 sm:pt-14" : "pt-20 sm:pt-26")}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center"
        >
          <Eyebrow>Reviews</Eyebrow>
          <Heading
            id="reviews-heading"
            className="text-4xl leading-[1.08] font-extrabold tracking-[-0.02em] text-brand-foreground sm:text-[44px] 2xl:text-[52px]"
          >
            Locals Trust Us
          </Heading>
        </motion.div>

        {/* Columns scroll at different speeds; the mask fades cards in and out at the top and bottom. */}
        <div className="mt-10 flex max-h-[740px] justify-center gap-6 2xl:max-h-[840px] 2xl:gap-8 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] sm:mt-12">
          {columns.map((column, i) => (
            <ReviewsColumn key={i} {...column} />
          ))}
        </div>
      </section>
    </MotionConfig>
  );
}
