"use client";

import Image from "next/image";
import { motion, MotionConfig, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

// Businesses Saken has worked for. Files live in /public/logos/clients; width and height are each
// file's own pixel size (or SVG viewBox), which sets its aspect ratio.
const clients = [
  { name: "QT Car Wash", src: "qt-carwash.svg", width: 151, height: 38 },
  { name: "Ditch Witch", src: "ditch-witch.png", width: 3706, height: 526 },
  { name: "Citizens Bank", src: "citizens-bank.svg", width: 745, height: 93 },
  { name: "Andy's Frozen Custard", src: "andys-frozen-custard.png", width: 350, height: 181 },
  { name: "Stanley's Famous Pit Bar-B-Q", src: "stanleys-bbq.png", width: 210, height: 66 },
  { name: "Grace Community School", src: "grace-school.svg", width: 502, height: 181 },
  { name: "Grace Community Church", src: "grace-community-church.png", width: 2549, height: 276 },
  { name: "Shipley Do-Nuts", src: "shipley-donuts.png", width: 255, height: 243 },
];

/**
 * Every logo gets the same visual area rather than the same height, so a long wordmark like Citizens
 * Bank renders short and wide while Shipley's round badge renders taller, and they read as equals.
 * Area is in px²; `--logo-scale` grows them on large screens.
 */
const LOGO_AREA = 4600;

function logoSize(width: number, height: number) {
  const aspect = width / height;
  return {
    width: `calc(${Math.round(Math.sqrt(LOGO_AREA * aspect))}px * var(--logo-scale))`,
    height: `calc(${Math.round(Math.sqrt(LOGO_AREA / aspect))}px * var(--logo-scale))`,
  };
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", bounce: 0, visualDuration: 0.5 },
  },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

/** "Businesses we've worked with" band of client logos, laid out as a board with hairline dividers between cells. */
export function LogoWall({ className }: { className?: string }) {
  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="clients-heading" className={cn("site-container", className)}>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2
            id="clients-heading"
            variants={fadeUp}
            className="text-center text-sm font-bold tracking-[0.12em] text-foreground/55 uppercase 2xl:text-base"
          >
            Businesses we&apos;ve worked with
          </motion.h2>

          {/* The 1px gap over a tinted background draws the grid lines; cells sit on white. */}
          <ul className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-brand-foreground/10 ring-1 ring-brand-foreground/10 [--logo-scale:0.82] sm:mt-10 sm:[--logo-scale:1] lg:grid-cols-4 2xl:[--logo-scale:1.15]">
            {clients.map(({ name, src, width, height }) => (
              <motion.li
                key={name}
                variants={fadeUp}
                className="grid h-28 place-items-center bg-white px-4 sm:h-32 2xl:h-36"
              >
                <Image
                  src={`/logos/clients/${src}`}
                  alt={name}
                  title={name}
                  width={width}
                  height={height}
                  sizes="240px"
                  unoptimized={src.endsWith(".svg")}
                  style={logoSize(width, height)}
                  className="max-w-full object-contain"
                />
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </section>
    </MotionConfig>
  );
}
