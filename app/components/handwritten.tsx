"use client";

import { useInView } from "motion/react";
import { useMemo, useRef } from "react";
import { createPlugin, TegakiRenderer } from "tegaki/react";
import caveat from "tegaki/fonts/caveat";
import { cn } from "@/lib/utils";

// Caveat ships in one weight, so bolder ink comes from widening the pen instead: every point of every
// stroke drawn `weight` times as wide.
const boldPlugin = createPlugin({
  name: "bold",
  params: {
    weight: {
      type: "number",
      label: "Weight",
      default: 1,
      min: 1,
      max: 3,
      step: 0.1,
    },
  },
  setup: ({ weight }) => ({
    geometry: (path) => path.map((p) => ({ ...p, width: p.width * weight })),
  }),
});

/**
 * Text written out stroke by stroke in Caveat, like handwriting, the first time it scrolls into view.
 * With reduced motion on, it appears already written. It renders a block-level span, so it can sit in
 * a heading, paragraph or badge; style the text (size, color) on it or on the element around it.
 */
export function Handwritten({
  children,
  className,
  duration = 1.6,
  delay = 0.2,
  play,
  weight = 1,
}: {
  children: string;
  className?: string;
  /** Seconds to write the whole text. */
  duration?: number;
  /** Seconds to wait once it's in view. */
  delay?: number;
  /** Start on this instead of on its own view, e.g. to time several together. */
  play?: boolean;
  /** How much heavier than the font to draw the ink: 1 as designed, 1.6 for a bold look. */
  weight?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const plugins = useMemo(
    () => (weight === 1 ? [] : [boldPlugin({ weight })]),
    [weight],
  );

  return (
    <span ref={ref} className={cn("block font-hand", className)}>
      <TegakiRenderer
        // A span so it can sit inside other text elements, but a block one: Tegaki lays the text out to the
        // width it measures, and an inline span measures as zero wide.
        as="span"
        className="block"
        font={caveat}
        time={{
          mode: "uncontrolled",
          playing: play ?? inView,
          duration,
          delay,
        }}
        reducedMotion="user"
        plugins={plugins}
      >
        {children}
      </TegakiRenderer>
    </span>
  );
}
