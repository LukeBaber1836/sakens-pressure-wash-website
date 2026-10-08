"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Translucent orange card nudged and tilted behind a photo as an accent. It swings into its tilt the
 * first time it scrolls into view. Place it first inside a `relative` wrapper the size of the photo,
 * give the photo `relative` so it stacks on top, and match the photo's radius via `className`.
 */
export function TiltedAccent({ className }: { className?: string }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      initial={reduced ? false : { opacity: 0, rotate: 0 }}
      whileInView={{ opacity: 1, rotate: 3 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ delay: 0.2, type: "spring", bounce: 0.35, visualDuration: 0.7 }}
      className={cn(
        "absolute inset-0 translate-x-1.5 translate-y-1.5 bg-brand/70 sm:translate-x-2.5 sm:translate-y-2.5",
        className
      )}
    />
  );
}
