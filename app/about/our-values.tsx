"use client";

import Image from "next/image";
import { motion, MotionConfig, type Variants } from "motion/react";
import type { IconType } from "react-icons";
import { TbHeartHandshake, TbScale, TbSparkles } from "react-icons/tb";
import { TiltedAccent } from "../components/tilted-accent";

// The three standards from the owner's story, spelled out.
const values: { title: string; text: string; icon: IconType }[] = [
  {
    title: "Excellent work",
    text: "The right method for every surface, from a low-pressure soft wash on your roof to a surface cleaner on your driveway. We don't call it done until it looks right.",
    icon: TbSparkles,
  },
  {
    title: "Unwavering integrity",
    text: "Saken looks over the property in person and gives you a free, honest price, along with straight talk about what to expect.",
    icon: TbScale,
  },
  {
    title: "Outstanding hospitality",
    text: "We show up on time, treat your property like our own, and walk it with you when we're finished.",
    icon: TbHeartHandshake,
  },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0, visualDuration: 0.6 } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export function OurValues() {
  return (
    <MotionConfig reducedMotion="user">
      <section aria-labelledby="values-heading" className="site-container pt-20 sm:pt-26">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="grid items-center gap-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20"
        >
          <div className="flex flex-col">
            <motion.h2
              variants={fadeUp}
              id="values-heading"
              className="text-4xl leading-[1.08] font-extrabold tracking-[-0.02em] text-brand-foreground sm:text-[44px]"
            >
              The same standard on every job
            </motion.h2>

            <ul className="mt-10 flex flex-col gap-8">
              {values.map(({ title, text, icon: Icon }) => (
                <motion.li key={title} variants={fadeUp} className="flex gap-5">
                  <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-tint ring-1 ring-brand-foreground/10">
                    <Icon className="size-7 text-brand" aria-hidden="true" />
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-xl font-bold text-brand-foreground">{title}</h3>
                    <p className="max-w-xl text-[17px] leading-relaxed text-foreground/80">
                      {text}
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

          <motion.figure
            variants={fadeUp}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <TiltedAccent className="rounded-[28px]" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] shadow-[0_24px_50px_-20px_rgba(1,20,45,0.45)]">
              <Image
                src="/images/crew-brick-house-pair-01.jpeg"
                alt="Two crew members washing the brick exterior and windows of a house"
                fill
                sizes="(min-width: 1024px) 40vw, 28rem"
                className="object-cover object-[25%_50%]"
              />
            </div>
          </motion.figure>
        </motion.div>
      </section>
    </MotionConfig>
  );
}
