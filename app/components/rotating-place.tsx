"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

// "East TX" leads once; the towns then loop in this order.
const places = [
  "East TX",
  "Tyler",
  "Whitehouse",
  "Flint",
  "Bullard",
  "Jacksonville",
  "Chandler",
  "Longview",
  "Kilgore",
];

// How long "East TX" holds before the first swap, and how long each town holds after that.
const LEAD_MS = 3000;
const HOLD_MS = 2500;

// Reserves the width of the longest place, so the heading never rewraps as the word changes.
const longest = places.reduce((a, b) => (b.length > a.length ? b : a));

/**
 * The end of the hero heading: "East TX", then the towns Saken serves on a loop. Each swap blurs the
 * old word up and out while the new one blurs in from below. It waits for `running` (so the lead holds
 * its full time once the heading is visible) and pauses while the hero is off screen,
 * and screen readers hear "East Texas" once rather than every change.
 */
export function RotatingPlace({ running = true }: { running?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref);
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!inView || !running) return;
    const timer = setTimeout(
      // After the last town, loop back to the first town, skipping "East TX".
      () => setIndex((i) => (i + 1 < places.length ? i + 1 : 1)),
      index === 0 ? LEAD_MS : HOLD_MS,
    );
    return () => clearTimeout(timer);
  }, [index, inView, running]);

  // Reduced motion keeps the crossfade but drops the movement and blur.
  const hidden = (direction: 1 | -1) =>
    reduced
      ? { opacity: 0 }
      : { opacity: 0, y: `${0.35 * direction}em`, filter: "blur(10px)" };

  return (
    <>
      <span className="sr-only">East Texas</span>
      <span ref={ref} aria-hidden="true" className="inline-grid">
        <span className="invisible [grid-area:1/1]">{longest}</span>
        <AnimatePresence initial={false}>
          <motion.span
            key={places[index]}
            initial={hidden(1)}
            animate={{ opacity: 1, y: "0em", filter: "blur(0px)" }}
            exit={hidden(-1)}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            // Its own layer, so each frame of the blur repaints just the word rather than the whole
            // hero card around it, video and shadow included.
            className="whitespace-nowrap will-change-[transform,opacity,filter] [grid-area:1/1]"
          >
            {places[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </>
  );
}
