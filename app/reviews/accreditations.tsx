"use client";

import Image from "next/image";
import { motion, MotionConfig, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { FcGoogle } from "react-icons/fc";
import { TbShieldCheckFilled, TbStarFilled } from "react-icons/tb";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", bounce: 0, visualDuration: 0.6 },
  },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const badges: { mark: ReactNode; title: string; text?: string }[] = [
  {
    mark: (
      <Image
        src="/images/logo-bbb-accredited.png"
        alt=""
        width={1498}
        height={550}
        sizes="160px"
        // The logo files have white backgrounds; multiply blends any off-white edges into the page.
        className="h-14 w-auto mix-blend-multiply"
      />
    ),
    title: "BBB Accredited Business",
  },
  {
    mark: (
      <Image
        src="/images/logo-tyler-chamber-125.png"
        alt=""
        width={1284}
        height={1370}
        sizes="80px"
        className="h-[72px] w-auto mix-blend-multiply"
      />
    ),
    title: "Tyler Area Chamber of Commerce",
  },
  {
    mark: (
      <span className="flex items-center gap-3">
        <FcGoogle className="size-11" aria-hidden="true" />
        <span className="flex gap-0.5 text-brand" aria-hidden="true">
          {Array.from({ length: 5 }, (_, i) => (
            <TbStarFilled key={i} className="size-5" />
          ))}
        </span>
      </span>
    ),
    title: "5.0 on Google",
    text: "Rated five stars across 132 reviews.",
  },
  {
    mark: (
      <span className="grid size-16 place-items-center rounded-full bg-tint text-brand-foreground ring-1 ring-brand-foreground/10">
        <TbShieldCheckFilled className="size-9" aria-hidden="true" />
      </span>
    ),
    title: "Fully insured",
    text: "Licensed and insured on every job, big or small.",
  },
];

/** The trust badges, set straight on the page in a row. */
export function Accreditations() {
  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="accreditations-heading">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="site-container py-20 sm:py-26"
        >
          <motion.div
            variants={fadeUp}
            className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center"
          >
            <p className="text-sm font-bold tracking-[0.12em] text-brand uppercase">
              Trusted &amp; accredited
            </p>
            <h2
              id="accreditations-heading"
              className="text-4xl leading-[1.08] font-extrabold tracking-[-0.02em] text-brand-foreground sm:text-[44px]"
            >
              Backed by More Than Our Word
            </h2>
          </motion.div>

          <ul className="mt-12 grid gap-x-8 gap-y-12 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
            {badges.map(({ mark, title, text }) => (
              <motion.li
                key={title}
                variants={fadeUp}
                className="flex flex-col items-center text-center"
              >
                <div className="grid h-20 place-items-center">{mark}</div>
                <h3 className="mt-5 text-lg leading-tight font-bold text-brand-foreground">
                  {title}
                </h3>
                {text && (
                  <p className="mt-2 text-[15px] leading-relaxed text-foreground/70">
                    {text}
                  </p>
                )}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </section>
    </MotionConfig>
  );
}
