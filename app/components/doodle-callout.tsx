"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

// Curly-Q arrow in a 140×64 box: starts beside the label (right), loops once, and ends at the
// arrowhead tip (6, 44) pointing left.
const ARROW_TIP = { x: 6, y: 44 };
const ARROW_PATH = "M122 38C106 46 92 46 84 36C76 24 90 12 98 22C106 34 82 52 56 50C40 49 22 46 6 44";
const ARROW_HEAD = "M15 38.5L6 44L14.5 50.5";

const draw: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  show: (delay: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay, duration: 0.8, ease: "easeInOut" },
      opacity: { delay, duration: 0.01 },
    },
  }),
};

const label: Variants = {
  hidden: { opacity: 0, y: 6, rotate: -9 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    rotate: -6,
    transition: { delay, type: "spring", bounce: 0.3, visualDuration: 0.45 },
  }),
};

/**
 * A hand-drawn arrow and scribbled note. Absolutely positioned so the arrow's tip lands on the
 * containing block's middle-right edge; place it inside a `relative` wrapper around the target.
 */
export function DoodleCallout({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  /** Seconds to wait after it scrolls into view before drawing. */
  delay?: number;
}) {
  // Skip the draw-in for reduced motion; the doodle just appears.
  const reduced = useReducedMotion();
  const state = reduced ? { initial: "show", animate: "show" } : { initial: "hidden" };

  return (
    <motion.div
      aria-hidden="true"
      {...state}
      whileInView="show"
      viewport={{ once: true, amount: 1 }}
      className={cn("pointer-events-none absolute top-1/2 left-full ml-4", className)}
    >
      <svg
        viewBox="0 0 140 64"
        width={140}
        height={64}
        fill="none"
        stroke="var(--brand)"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute overflow-visible"
        style={{ left: -ARROW_TIP.x, top: -ARROW_TIP.y }}
      >
        <motion.path d={ARROW_PATH} variants={draw} custom={delay} />
        <motion.path d={ARROW_HEAD} variants={draw} custom={delay + 0.75} />
      </svg>

      <motion.p
        variants={label}
        custom={delay + 0.4}
        className="absolute top-[-31px] left-[128px] w-max font-hand text-[26px] leading-[0.95] text-brand"
      >
        {children}
      </motion.p>
    </motion.div>
  );
}
