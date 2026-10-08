"use client";

import { motion, MotionConfig, type Variants } from "motion/react";
import type { IconType } from "react-icons";
import { TbId, TbStarFilled, TbUser } from "react-icons/tb";
import { Separator } from "@/components/ui/separator";

const trustItems: { label: string; icon: IconType }[] = [
  { label: "Free in-person estimates", icon: TbUser },
  { label: "Licensed and insured", icon: TbId },
];

const pill: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", bounce: 0, visualDuration: 0.5 },
  },
};

const stars: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};

const star: Variants = {
  hidden: { opacity: 0, scale: 0.4 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      opacity: { duration: 0.25, ease: "easeOut" },
      scale: { type: "spring", bounce: 0.35, visualDuration: 0.3 },
    },
  },
};

export function TrustPill() {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        variants={pill}
        initial="hidden"
        animate="show"
        className="glass relative flex w-full flex-wrap items-center gap-x-8 gap-y-3 rounded-[28px] px-4 py-4 text-brand-foreground [--glass-opacity:0.7] sm:px-8 sm:py-5 md:w-fit"
      >
        <motion.div variants={fadeUp} className="flex items-center gap-3">
          <motion.span
            variants={stars}
            className="flex gap-0.5 text-brand"
            role="img"
            aria-label="5 out of 5 stars"
          >
            {Array.from({ length: 5 }, (_, i) => (
              <motion.span key={i} variants={star} className="flex" aria-hidden="true">
                <TbStarFilled className="size-[18px]" />
              </motion.span>
            ))}
          </motion.span>
          <span className="text-base font-bold">
            5.0 on Google <span className="font-medium text-brand-foreground/60">(132 reviews)</span>
          </span>
        </motion.div>
        {trustItems.map(({ label, icon: Icon }) => (
          <motion.div key={label} variants={fadeUp} className="flex items-center gap-8">
            <Separator
              orientation="vertical"
              className="hidden h-6 self-center! bg-brand-foreground/15 sm:block"
            />
            <span className="flex items-center gap-2.5">
              <Icon className="size-5 shrink-0 text-brand" aria-hidden="true" />
              <span className="text-base font-bold">{label}</span>
            </span>
          </motion.div>
        ))}
      </motion.div>
    </MotionConfig>
  );
}
