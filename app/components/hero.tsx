"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FreshOnShow } from "./fresh-on-show";
import { HandDrawnUnderline } from "./hand-drawn-underline";
import { HERO_INTRO, shouldPlayHeroIntro } from "./hero-intro";
import { NotchedCard } from "./notched-card";
import { RotatingPlace } from "./rotating-place";
import { TrustPill } from "./trust-pill";

// Fades up once the intro frame has mostly settled; each line passes its own delay.
const entrance =
  "translate-y-3 opacity-0 transition duration-700 ease-out group-data-settled/hero:translate-y-0 group-data-settled/hero:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none";

/** The homepage hero. Its intro plays every time the homepage is shown, not just on first load. */
export function Hero() {
  return (
    <FreshOnShow>
      <HeroCard />
    </FreshOnShow>
  );
}

function HeroCard() {
  const [revealed, setRevealed] = useState(false);
  const [settled, setSettled] = useState(false);
  const [pillOpen, setPillOpen] = useState(false);
  const [underlined, setUnderlined] = useState(false);

  // Intro: the page holds white while it finishes laying out, the video card fades in, then the copy
  // fades up and the trust pill rises. A beat after it all settles, the phone line gets underlined.
  useEffect(() => {
    const reduced = !shouldPlayHeroIntro();
    const timers = [
      setTimeout(() => setRevealed(true), reduced ? 0 : HERO_INTRO.cardAt),
      setTimeout(() => setSettled(true), reduced ? 0 : HERO_INTRO.copyAt),
      setTimeout(() => setPillOpen(true), reduced ? 0 : HERO_INTRO.pillAt),
      setTimeout(
        () => setUnderlined(true),
        reduced ? 0 : HERO_INTRO.underlineAt,
      ),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section
      id="top"
      data-settled={settled || undefined}
      className="group/hero site-container shrink-0 grow pt-2 [--site-max:125rem]"
    >
      {/* Hidden until its cue, which also covers the page settling into place on load. */}
      <div
        data-revealed={revealed || undefined}
        className="opacity-0 transition-opacity duration-700 ease-out data-revealed:opacity-100 motion-reduce:transition-none"
      >
        <NotchedCard
          notchOpen={pillOpen}
          notch={<TrustPill show={pillOpen} />}
          // Fill the viewport below the 5rem nav, leaving 1rem under the card; floor it for short screens.
          className="relative flex h-[calc(100svh-6.5rem)] min-h-[600px] flex-col rounded-[28px] bg-[#0b2440] sm:min-h-[520px]"
        >
          {/* The video's first frame, preloaded, showing through until the video can play. */}
          <Image
            src="/images/hero-video-poster.webp"
            alt=""
            fill
            preload
            sizes="100vw"
            className="object-cover"
          />
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src="/videos/hero_video.webm"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,20,45,0.82)_0%,rgba(1,20,45,0.55)_42%,rgba(1,20,45,0.05)_75%)]" />

          <div className="relative flex flex-1 flex-col justify-center gap-7 px-6 pt-12 pb-44 text-white sm:w-[724px] sm:px-16 sm:pb-24 2xl:w-[948px]">
            <h1
              className={cn(
                entrance,
                "delay-150 text-[clamp(2.5rem,11vw,3rem)] leading-[1.02] font-extrabold tracking-[-0.025em] sm:w-[711px] sm:max-w-[calc(100vw-8rem)] sm:text-[55px] 2xl:w-[931px] 2xl:text-[72px]",
              )}
            >
              Pressure washing and soft washing{" "}
              {/* Kept together so the town never strands "in" on a line of its own. */}
              <span className="whitespace-nowrap">
                in <RotatingPlace running={settled} />
              </span>
            </h1>

            {/* Wrapped so the entrance timing doesn't slow the button's own hover transition. */}
            <div className={cn(entrance, "delay-300")}>
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

            <a
              href="tel:9035398960"
              className={cn(
                entrance,
                "relative w-fit pb-2 text-base font-semibold whitespace-nowrap text-white delay-450",
              )}
            >
              Prefer to talk? (903) 539-8960
              <HandDrawnUnderline drawn={underlined} />
            </a>
          </div>
        </NotchedCard>
      </div>
    </section>
  );
}
