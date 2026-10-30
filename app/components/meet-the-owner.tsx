"use client";

import Image from "next/image";
import { motion, MotionConfig, type Variants } from "motion/react";
import { FcGoogle } from "react-icons/fc";
import { TbShieldCheckFilled, TbStarFilled } from "react-icons/tb";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./eyebrow";
import { Handwritten } from "./handwritten";
import { TiltedAccent } from "./tilted-accent";

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

/**
 * On the homepage this sits on a rounded gray card inset from the screen edges like the hero, running
 * edge to edge on phones. `lead` makes it the page's opening section instead: plain white, no gap
 * above it, and the heading becomes the h1. It also drops its bottom padding, since the next white
 * section brings its own.
 */
export function MeetTheOwner({ lead = false }: { lead?: boolean }) {
  const Heading = lead ? motion.h1 : motion.h2;

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="about"
        aria-labelledby="about-heading"
        className={cn(
          !lead &&
            "site-container mt-20 [--site-max:125rem] max-sm:px-0 sm:mt-26",
        )}
      >
        <div
          className={cn(
            !lead && "rounded-[32px] bg-secondary max-sm:rounded-none",
          )}
        >
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className={cn(
              "site-container grid items-center gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20",
              lead ? "pt-10 sm:pt-14" : "py-20 sm:py-26",
            )}
          >
            <motion.figure
              variants={fadeUp}
              // Kept smaller on the homepage card so the section doesn't run too tall.
              className={cn(
                "relative mx-auto w-full max-w-md",
                lead ? "lg:max-w-none" : "2xl:max-w-lg",
              )}
            >
              <TiltedAccent className="rounded-[28px]" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] shadow-[0_24px_50px_-20px_rgba(1,20,45,0.45)]">
                <Image
                  src="/images/owner-headshot-01.jpg"
                  alt="Saken Sawyer, owner of Saken's Pressure Washing, smiling in a company polo"
                  fill
                  sizes="(min-width: 1024px) 40vw, 28rem"
                  className="object-cover object-[50%_30%]"
                />
              </div>
            </motion.figure>

            <div className="flex flex-col">
              <motion.div variants={fadeUp}>
                <Eyebrow>Meet the owner</Eyebrow>
              </motion.div>
              <Heading
                variants={fadeUp}
                id="about-heading"
                // As the About page's headline it steps up to match the other pages' heroes.
                className={cn(
                  "mt-3 text-balance text-4xl leading-[1.08] font-extrabold tracking-[-0.02em] text-brand-foreground sm:text-[44px] 2xl:text-[52px]",
                  lead && "lg:text-[52px] 2xl:text-[64px]",
                )}
              >
                A Tyler native who does the job right
              </Heading>
              <motion.div
                variants={fadeUp}
                className="mt-5 flex max-w-xl flex-col gap-4 text-[17px] leading-relaxed 2xl:max-w-2xl 2xl:text-[19px] text-foreground/80"
              >
                <p>
                  Saken grew up in Tyler, graduated from UT Tyler, and started
                  Saken&apos;s Pressure Washing to bring the best pressure
                  washing in East Texas to the community he calls home.
                </p>
                <p>
                  He and his team hold every job to the same standard:{" "}
                  <strong className="font-semibold text-brand-foreground">
                    excellent work, unwavering integrity, and outstanding
                    hospitality
                  </strong>
                  . Whether you&apos;re restoring the look of your home or
                  keeping a commercial property sharp, you can trust them to
                  bring the best clean around.
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="mt-6">
                <p className="text-[40px] leading-none text-brand-foreground">
                  <Handwritten>Saken Sawyer</Handwritten>
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground/60">
                  Owner &amp; operator
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="@container mt-8">
                <h3 className="text-center text-sm font-bold tracking-[0.12em] text-brand-foreground/60 uppercase @2xl:text-left">
                  Trusted &amp; accredited
                </h3>
                {/* An open row rather than cards: the two badges, then the Google rating and insurance as
                  short labeled facts, with hairlines between them when the column is wide enough for one row.
                  Until then the heading and the two-by-two grid are centered. */}
                <ul className="mt-4 grid grid-cols-2 items-center justify-items-center gap-x-6 gap-y-6 @2xl:flex @2xl:gap-0">
                  <li className="@2xl:pr-6">
                    <Image
                      src="/images/logo-bbb-accredited.png"
                      alt="BBB Accredited Business"
                      width={1498}
                      height={550}
                      sizes="160px"
                      // The logo files have white backgrounds; multiply drops them onto the section color.
                      className="h-10 w-auto mix-blend-multiply"
                    />
                  </li>
                  <li className="@2xl:border-l @2xl:border-brand-foreground/15 @2xl:px-6">
                    <Image
                      src="/images/logo-tyler-chamber-125.png"
                      alt="Tyler Area Chamber of Commerce member"
                      width={1284}
                      height={1370}
                      sizes="80px"
                      className="h-14 w-auto mix-blend-multiply"
                    />
                  </li>
                  <li className="flex items-center gap-3 @2xl:border-l @2xl:border-brand-foreground/15 @2xl:px-6">
                    <FcGoogle className="size-8 shrink-0" aria-hidden="true" />
                    <div>
                      <div
                        className="flex gap-0.5 text-brand"
                        role="img"
                        aria-label="5 out of 5 stars"
                      >
                        {Array.from({ length: 5 }, (_, i) => (
                          <TbStarFilled
                            key={i}
                            className="size-4"
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                      <p className="mt-1 text-xs text-foreground/60">
                        <span className="sr-only">on Google, </span>132 reviews
                      </p>
                    </div>
                  </li>
                  <li className="flex items-center gap-3 @2xl:border-l @2xl:border-brand-foreground/15 @2xl:pl-6">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-tint text-brand-foreground ring-1 ring-brand-foreground/10">
                      <TbShieldCheckFilled
                        className="size-6"
                        aria-hidden="true"
                      />
                    </span>
                    <div>
                      <p className="text-sm leading-tight font-bold text-brand-foreground">
                        Fully insured
                      </p>
                      <p className="mt-0.5 text-xs text-foreground/60">
                        Licensed &amp; insured
                      </p>
                    </div>
                  </li>
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </MotionConfig>
  );
}
