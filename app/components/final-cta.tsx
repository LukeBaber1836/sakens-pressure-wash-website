"use client";

import Link from "next/link";
import { motion, MotionConfig, useInView } from "motion/react";
import { useRef } from "react";
import { TbArrowUpRight, TbPhone } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { HandDrawnUnderline } from "./hand-drawn-underline";

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * The closing pitch at the foot of the page: a bold navy card asking for the estimate. As it comes
 * into view a lighter stripe sweeps across it, like one clean pass of a surface cleaner, and the
 * key words get underlined by hand.
 */
export function FinalCta() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <MotionConfig reducedMotion="user">
      <section
        ref={ref}
        aria-labelledby="final-cta-heading"
        // A rounded card inset from the screen edges like the sections above it, edge to edge on phones,
        // with space below so it doesn't sit on the footer.
        className="site-container mb-20 [--site-max:125rem] max-sm:px-0 sm:mb-26"
      >
        <div className="relative isolate overflow-hidden rounded-[32px] bg-brand-foreground text-white max-sm:rounded-none">
          {/* The clean pass: a soft, slanted band of light that sweeps left to right once. */}
          <motion.div
            aria-hidden="true"
            initial={{ x: "-120%" }}
            animate={inView ? { x: "0%" } : undefined}
            transition={{ duration: 1.4, ease }}
            className="absolute inset-y-0 left-[18%] -z-10 w-[64%] -skew-x-12 bg-linear-to-r from-white/0 via-white/[0.07] to-white/0"
          />

          <div className="site-container flex flex-col items-center py-24 text-center sm:py-32">
            <motion.h2
              id="final-cta-heading"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.8, delay: 0.1, ease }}
              className="max-w-4xl text-5xl leading-[1.02] font-extrabold tracking-[-0.03em] sm:text-7xl lg:text-[88px]"
            >
              Let&apos;s make it look{" "}
              <span className="relative inline-block pb-3 text-brand">
                new again.
                <HandDrawnUnderline
                  drawn={inView}
                  strokeWidth={5}
                  delay={0.7}
                  className="-bottom-2 h-5"
                />
              </span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, delay: 0.3, ease }}
              className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:gap-6"
            >
              <Button
                variant="brand"
                size="xl"
                nativeButton={false}
                render={<Link href="/contact" />}
              >
                Book a free estimate
                <TbArrowUpRight data-icon="inline-end" />
              </Button>
              <a
                href="tel:9035398960"
                className="flex h-14 items-center gap-2.5 rounded-xl px-6 text-base font-bold text-white ring-1 ring-white/25 transition-colors outline-none hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-brand"
              >
                <TbPhone className="size-5 text-brand" aria-hidden="true" />
                (903) 539-8960
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
