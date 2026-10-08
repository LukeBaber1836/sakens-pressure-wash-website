"use client";

import { Fragment } from "react";
import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";

const verse = "So whether you eat or drink or whatever you do,";
const verseHighlight = "do it all for the glory of God";
const citation = "1 Corinthians 10:31";

// Each word sharpens out of a blur in quick succession.
const words: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const word: Variants = {
  hidden: { opacity: 0, filter: "blur(10px)" },
  show: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

function BlurWords({ text }: { text: string }) {
  // Spaces sit between the inline-block words so lines can still wrap.
  return text.split(" ").map((w, i) => (
    <Fragment key={i}>
      {i > 0 && " "}
      <motion.span variants={word} className="inline-block">
        {w}
      </motion.span>
    </Fragment>
  ));
}

export function MissionStatement() {
  // Opacity and blur aren't transforms, so MotionConfig won't skip them; show the text outright instead.
  const reduced = useReducedMotion();

  return (
    // Steel blue from Saken's Originals' site, to tie the two brands together.
    <section id="mission" aria-label="Our mission" className="mt-20 bg-[#4682b4] sm:mt-26">
      <div className="site-container grid items-center gap-12 py-20 sm:py-26 lg:grid-cols-2 lg:gap-16">
        <motion.blockquote
          variants={words}
          initial={reduced ? "show" : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          className="flex flex-col items-center text-center"
        >
          <motion.span
            variants={word}
            aria-hidden="true"
            className="font-heading text-7xl leading-none font-extrabold text-white/50"
          >
            &ldquo;
          </motion.span>
          <p className="mt-2 max-w-xl font-serif text-3xl leading-[1.15] font-bold tracking-[-0.01em] text-white uppercase sm:text-[40px]">
            <BlurWords text={verse} />{" "}
            <span className="text-brand">
              <BlurWords text={verseHighlight} />
            </span>
          </p>
          <footer className="mt-3 font-serif text-3xl leading-[1.15] font-normal italic text-white/80 uppercase sm:text-[40px]">
            <cite>
              <BlurWords text={citation} />
            </cite>
          </footer>
        </motion.blockquote>

        <Image
          src="/images/cross_image.png"
          alt="A wooden cross silhouetted against the sun above a hillside fence, with mountains in the distance"
          width={1280}
          height={853}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="h-auto w-full rounded-[24px] shadow-[0_18px_40px_-12px_rgba(1,20,45,0.6)]"
        />
      </div>
    </section>
  );
}
