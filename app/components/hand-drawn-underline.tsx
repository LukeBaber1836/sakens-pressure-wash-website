"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * A loose, pen-drawn line that sweeps in under its parent from left to right once `drawn` is set. The
 * parent needs `relative` and a little bottom padding for it to sit in; `className` can move or
 * thicken it for bigger text.
 */
export function HandDrawnUnderline({
  drawn,
  className,
  strokeWidth = 3,
  delay = 0,
}: {
  drawn: boolean;
  className?: string;
  strokeWidth?: number;
  /** Seconds to wait after `drawn` before the stroke starts. */
  delay?: number;
}) {
  // With reduced motion the line is simply there, already drawn.
  const reduced = useReducedMotion();

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 300 14"
      preserveAspectRatio="none"
      className={cn(
        "pointer-events-none absolute -bottom-1 left-0 h-3.5 w-full overflow-visible",
        className,
      )}
    >
      <motion.path
        // A slight wobble with a lift at the end, like one quick stroke of a marker.
        d="M2 9.5C38 6.8 72 10.6 112 8.4S186 5.6 226 7.6 279 9.6 297 5"
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className="stroke-brand"
        initial={reduced ? false : { pathLength: 0, opacity: 0 }}
        animate={drawn ? { pathLength: 1, opacity: 1 } : undefined}
        transition={{
          pathLength: { duration: 0.9, ease: [0.65, 0, 0.35, 1], delay },
          // Shown a hair after the stroke starts: at zero length its round caps draw a dot at each end.
          opacity: { duration: 0.1, delay: delay + 0.06 },
        }}
      />
    </svg>
  );
}
