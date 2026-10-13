"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, MotionConfig, type Variants } from "motion/react";
import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import { TbBuildingStore, TbHome, TbPhoto } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { NotchedCard } from "../components/notched-card";

const facts: { label: string; icon: IconType }[] = [
  { label: "Photos from real jobs", icon: TbPhoto },
  { label: "Homes", icon: TbHome },
  { label: "Businesses", icon: TbBuildingStore },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", bounce: 0, visualDuration: 0.5 },
  },
};

/** The Our Work page's opening card: the 360° roof video, the heading, and a pill in the notch. */
export function WorkHero({ photoCount }: { photoCount: number }) {
  const [pillOpen, setPillOpen] = useState(false);

  // Let the card land before the notch opens, as on the homepage.
  useEffect(() => {
    const timer = setTimeout(() => setPillOpen(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <section className="site-container pt-2 [--site-max:125rem]">
        <NotchedCard
          notchOpen={pillOpen}
          notch={
            <motion.div
              initial="hidden"
              animate={pillOpen ? "show" : "hidden"}
              transition={{ staggerChildren: 0.12, delayChildren: 0.3 }}
              className="glass relative flex w-full flex-wrap items-center gap-x-8 gap-y-3 rounded-[28px] px-4 py-4 text-brand-foreground [--glass-opacity:0.7] sm:px-8 sm:py-5 md:w-fit"
            >
              {facts.map(({ label, icon: Icon }, i) => (
                <motion.div
                  key={label}
                  variants={fadeUp}
                  className="flex items-center gap-8"
                >
                  {i > 0 && (
                    <Separator
                      orientation="vertical"
                      className="hidden h-6 self-center! bg-brand-foreground/15 sm:block"
                    />
                  )}
                  <span className="flex items-center gap-2.5">
                    <Icon
                      className="size-5 shrink-0 text-brand"
                      aria-hidden="true"
                    />
                    <span className="text-base font-bold">
                      {i === 0
                        ? `${photoCount}+ ${label.toLowerCase()}`
                        : label}
                    </span>
                  </span>
                </motion.div>
              ))}
            </motion.div>
          }
          className="relative flex h-[min(calc(100svh-6.5rem),44rem)] min-h-[560px] flex-col rounded-[28px] bg-[#0b2440]"
        >
          {/* The video's first frame, preloaded, showing through until the video can play. */}
          <Image
            src="/images/roof-360-poster.webp"
            alt=""
            fill
            preload
            sizes="100vw"
            className="object-cover"
          />
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="/videos/roof_360.webm"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,20,45,0.82)_0%,rgba(1,20,45,0.55)_42%,rgba(1,20,45,0.05)_75%)]" />

          <div className="relative flex flex-1 flex-col justify-center gap-6 px-6 pt-12 pb-44 text-white sm:w-[680px] sm:px-16 sm:pb-24">
            <p className="text-sm font-bold tracking-[0.12em] text-brand uppercase">
              Our work
            </p>
            <h1 className="text-5xl leading-[1.02] font-extrabold tracking-[-0.025em] sm:text-[55px]">
              See the difference for yourself
            </h1>
            <p className="max-w-lg text-[17px] leading-relaxed text-white/85">
              Houses, driveways, patios, windows and storefronts we&apos;ve
              cleaned around Tyler and East Texas.
            </p>
            <Button
              variant="brand"
              size="xl"
              nativeButton={false}
              render={<Link href="/contact" />}
              className="w-fit"
            >
              Book a free estimate
            </Button>
          </div>
        </NotchedCard>
      </section>
    </MotionConfig>
  );
}
