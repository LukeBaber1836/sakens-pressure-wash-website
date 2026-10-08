"use client";

import Image from "next/image";
import { motion, MotionConfig, type Variants } from "motion/react";
import { TbShieldCheckFilled } from "react-icons/tb";
import { TiltedAccent } from "./tilted-accent";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0, visualDuration: 0.6 } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const credentials = [
  {
    label: "BBB Accredited Business",
    badge: { src: "/images/logo-bbb-accredited.png", width: 1498, height: 550 },
  },
  {
    label: "Tyler Area Chamber of Commerce member",
    badge: { src: "/images/logo-tyler-chamber-125.png", width: 1284, height: 1370 },
  },
  { label: "Fully insured", badge: null },
];

export function MeetTheOwner() {
  return (
    <MotionConfig reducedMotion="user">
      <section id="about" aria-labelledby="about-heading" className="mt-20 bg-secondary sm:mt-26">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="site-container grid items-center gap-16 py-20 sm:py-26 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20"
        >
          <motion.figure
            variants={fadeUp}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
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
            <motion.p
              variants={fadeUp}
              className="text-sm font-bold tracking-[0.12em] text-brand uppercase"
            >
              Meet the owner
            </motion.p>
            <motion.h2
              variants={fadeUp}
              id="about-heading"
              className="mt-3 text-4xl leading-[1.08] font-extrabold tracking-[-0.02em] text-brand-foreground sm:text-[44px]"
            >
              A Tyler native who does the job right
            </motion.h2>
            <motion.div
              variants={fadeUp}
              className="mt-5 flex max-w-xl flex-col gap-4 text-[17px] leading-relaxed text-foreground/80"
            >
              <p>
                Saken grew up in Tyler, graduated from UT Tyler, and started Saken&apos;s Pressure
                Washing to bring the best pressure washing in East Texas to the community he calls
                home.
              </p>
              <p>
                He and his team hold every job to the same standard:{" "}
                <strong className="font-semibold text-brand-foreground">
                  excellent work, unwavering integrity, and outstanding hospitality
                </strong>
                . Whether you&apos;re restoring the look of your home or keeping a commercial
                property sharp, you can trust them to bring the best clean around.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-6">
              <p className="font-hand text-[40px] leading-none text-brand-foreground">
                Saken Sawyer
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground/60">Owner &amp; operator</p>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10">
              <h3 className="text-sm font-bold tracking-[0.12em] text-brand-foreground/60 uppercase">
                Trusted &amp; accredited
              </h3>
              <ul className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
                {/* Logo-only cards; each label is the badge's accessible name instead of a caption. */}
                {credentials.map(({ label, badge }) => (
                  <li
                    key={label}
                    className="flex h-24 items-center justify-center rounded-2xl bg-white p-3 shadow-sm ring-1 ring-brand-foreground/10 sm:h-28 sm:p-4"
                  >
                    {badge ? (
                      <Image
                        src={badge.src}
                        alt={label}
                        width={badge.width}
                        height={badge.height}
                        sizes="160px"
                        className="h-full w-auto max-w-full object-contain"
                      />
                    ) : (
                      <InsuredSeal label={label} />
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </MotionConfig>
  );
}

/** A round seal for "Fully insured" to sit alongside the BBB and Chamber logos. */
function InsuredSeal({ label }: { label: string }) {
  return (
    <div role="img" aria-label={label} className="relative aspect-square h-full">
      <svg viewBox="0 0 100 100" aria-hidden="true" className="absolute inset-0 size-full">
        <circle cx="50" cy="50" r="49" className="fill-brand-foreground" />
        <circle cx="50" cy="50" r="45" fill="none" className="stroke-brand" strokeWidth="1.5" />
        <path
          id="insured-seal-rim"
          d="M50 50m-35 0a35 35 0 1 1 70 0a35 35 0 1 1-70 0"
          fill="none"
        />
        {/* Rim text sized to wrap the full circle (2π × 35 ≈ 220). */}
        <text
          className="fill-white font-heading"
          fontSize="10.5"
          fontWeight="800"
          letterSpacing="1"
        >
          <textPath href="#insured-seal-rim" textLength="218" lengthAdjust="spacing">
            FULLY INSURED • FULLY INSURED •
          </textPath>
        </text>
      </svg>
      <div className="absolute inset-[27%] flex items-center justify-center rounded-full bg-brand">
        <TbShieldCheckFilled className="size-[62%] text-brand-foreground" />
      </div>
    </div>
  );
}
