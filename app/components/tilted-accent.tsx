"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Translucent orange card nudged and tilted behind a photo as an accent. It swings into its tilt the
 * first time it scrolls into view, and swings smoothly to any new `tilt` (in degrees) after that.
 * Place it first inside a `relative` wrapper the size of the photo, give the photo `relative` so it
 * stacks on top, and match the photo's radius via `className`.
 */
export function TiltedAccent({
  className,
  tilt = 3,
}: {
  className?: string;
  tilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.5 });
  // The first swing waits a beat for the photo to land; later tilt changes follow straight away.
  const [entered, setEntered] = useState(false);

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      initial={reduced ? false : { opacity: 0, rotate: 0 }}
      animate={inView || reduced ? { opacity: 1, rotate: tilt } : undefined}
      onAnimationComplete={() => setEntered(true)}
      transition={
        entered
          ? { type: "spring", bounce: 0.25, visualDuration: 0.6 }
          : { delay: 0.2, type: "spring", bounce: 0.35, visualDuration: 0.7 }
      }
      className={cn(
        "absolute inset-0 translate-x-1.5 translate-y-1.5 bg-brand/70 sm:translate-x-2.5 sm:translate-y-2.5",
        className,
      )}
    />
  );
}
