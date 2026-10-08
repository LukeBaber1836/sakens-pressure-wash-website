"use client";

import { motion, MotionConfig } from "motion/react";
import { ReviewsColumn } from "./reviews-column";
import { reviews } from "./reviews-data";

// The middle column runs downward, against the outer two.
const columns = [
  { reviews: reviews.slice(0, 3), duration: 32, direction: "up", className: undefined },
  { reviews: reviews.slice(3, 6), duration: 40, direction: "down", className: "hidden md:block" },
  { reviews: reviews.slice(6, 9), duration: 36, direction: "up", className: "hidden lg:block" },
] as const;

export function Reviews() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="reviews" aria-labelledby="reviews-heading" className="site-container pt-20 sm:pt-26">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center"
        >
          <p className="text-sm font-bold tracking-[0.12em] text-brand uppercase">Reviews</p>
          <h2
            id="reviews-heading"
            className="text-4xl leading-[1.08] font-extrabold tracking-[-0.02em] text-brand-foreground sm:text-[44px]"
          >
            Locals Trust Us
          </h2>
          <p className="text-[17px] leading-relaxed text-foreground/80">
            Homeowners and businesses across East Texas on what it&apos;s like to work with Saken.
          </p>
        </motion.div>

        {/* Columns scroll at different speeds; the mask fades cards in and out at the top and bottom. */}
        <div className="mt-10 flex max-h-[740px] justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] sm:mt-12">
          {columns.map((column, i) => (
            <ReviewsColumn key={i} {...column} />
          ))}
        </div>
      </section>
    </MotionConfig>
  );
}
