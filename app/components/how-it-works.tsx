"use client";

import Image from "next/image";
import {
  motion,
  MotionConfig,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type RefAttributes,
} from "react";
import { TbCheck } from "react-icons/tb";
import { CalendarCheckIcon } from "@/components/icons/calendar-check";
import { FilePenIcon } from "@/components/icons/file-pen";
import { SparklesIcon } from "@/components/icons/sparkles";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./eyebrow";
import { TiltedAccent } from "./tilted-accent";

type IconHandle = { startAnimation: () => void; stopAnimation: () => void };
type AnimatedIcon = ComponentType<
  RefAttributes<IconHandle> & {
    size?: number;
    strokeWidth?: number;
    className?: string;
  }
>;

// How an outgoing step or drawing drifts out of focus as the next one comes into it.
const swap = { duration: 0.7, ease: [0.4, 0, 0.2, 1] } as const;
const focus = (on: boolean) => ({
  opacity: on ? 1 : 0,
  filter: on ? "blur(0px)" : "blur(14px)",
  scale: on ? 1 : 1.04,
});

type Step = {
  title: string;
  text: string;
  Icon: AnimatedIcon;
  image: { src: string; alt: string; width: number; height: number };
};

const steps: Step[] = [
  {
    title: "Request a quote",
    text: "Call or send us a message. Saken comes out, looks over the property, and gives you a free, honest price.",
    Icon: FilePenIcon,
    image: {
      src: "/images/how-it-works-quote-04.png",
      alt: "Illustration of a worker in a cap standing in front of a large stone home, writing a quote on his clipboard",
      width: 1264,
      height: 627,
    },
  },
  {
    title: "Tell us when",
    text: "Pick a day that works for you. We'll confirm the time and let you know exactly what to expect.",
    Icon: CalendarCheckIcon,
    image: {
      src: "/images/how-it-works-truck-05.png",
      alt: "Illustration of a Ford F-150 towing a pressure washing trailer, parked in front of a large stone home",
      width: 1264,
      height: 653,
    },
  },
  {
    title: "We make it clean",
    text: "We show up on time, wash everything top to bottom, and walk the property with you when we're done.",
    Icon: SparklesIcon,
    image: {
      src: "/images/how-it-works-clean-05.png",
      alt: "Illustration of two workers washing a large stone home, one pressure washing the driveway and one soft washing the stone wall",
      width: 1264,
      height: 627,
    },
  },
];

/**
 * The three booking steps. The section pins while you scroll through it. On large screens the
 * active step lights up in the list on the left and its illustration takes over on the right.
 * Smaller screens show one step's text at a time above the illustration, each blurring out as the
 * next takes its place.
 */
export function HowItWorks() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(steps.length - 1, Math.floor(p * steps.length));
    setActive((prev) => (prev === next ? prev : next));
  });

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="how-it-works"
        aria-labelledby="how-it-works-heading"
        // A rounded tinted card inset from the screen edges like the hero, edge to edge on phones.
        className="site-container mt-20 [--site-max:125rem] max-sm:px-0 sm:mt-26"
      >
        {/* Tall track for the pinned layout to scroll through; a third of it per step. */}
        <div ref={trackRef} className="relative h-[300vh]">
          {/* The pinned panel is the card: held a gutter in from the top and bottom of the screen so
              its rounded corners stay in view, and edge to edge on phones. On desktop it is shorter and centered. */}
          <div className="sticky top-0 h-svh bg-tint sm:top-4 sm:h-[calc(100svh-2rem)] sm:rounded-[32px] lg:top-[10svh] lg:h-[80svh]">
            {/* Below lg the top padding clears the floating nav. */}
            <div className="site-container flex h-full flex-col justify-center pt-20 pb-6 lg:pt-6 lg:pb-0">
              <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
                <Eyebrow>How it works</Eyebrow>
                <h2
                  id="how-it-works-heading"
                  className="text-4xl leading-[1.08] font-extrabold tracking-[-0.02em] text-brand-foreground sm:text-[44px]"
                >
                  Booking Is Easy
                </h2>
              </div>

              <div className="mt-8 grid items-center gap-6 lg:mt-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
                {/* Small screens: every step's text shares one spot and only the active one shows. */}
                <ol className="grid lg:hidden">
                  {steps.map((step, i) => (
                    <StepItem
                      key={step.title}
                      step={step}
                      index={i}
                      state={
                        i < active
                          ? "done"
                          : i === active
                            ? "active"
                            : "upcoming"
                      }
                      stacked
                    />
                  ))}
                </ol>

                <ol className="hidden flex-col gap-10 lg:flex">
                  {steps.map((step, i) => (
                    <StepItem
                      key={step.title}
                      step={step}
                      index={i}
                      state={
                        i < active
                          ? "done"
                          : i === active
                            ? "active"
                            : "upcoming"
                      }
                    />
                  ))}
                </ol>

                {/* The illustration panel, swapped to the active step. Capped by the screen height so the
                  pinned section always fits; below lg it sits under the step's text. */}
                <div className="relative mx-auto w-full max-w-[calc((100svh-24rem)*1.5)] sm:max-w-[calc((100svh-26rem)*1.5)] lg:mx-0 lg:max-w-[calc((80svh-15rem)*1.5)] lg:justify-self-end">
                  {/* Leans the other way on the middle step, then back. */}
                  <TiltedAccent
                    className="rounded-[32px]"
                    tilt={active === 1 ? -3 : 3}
                  />
                  <div className="relative aspect-[3/2] overflow-hidden rounded-[32px] bg-white shadow-[0_30px_60px_-30px_rgba(1,20,45,0.35)] ring-1 ring-brand-foreground/10">
                    {steps.map(({ title, image }, i) => (
                      <motion.div
                        key={title}
                        initial={false}
                        animate={focus(active === i)}
                        transition={swap}
                        className="absolute inset-3 sm:inset-4"
                      >
                        <Image
                          src={image.src}
                          alt={active === i ? image.alt : ""}
                          fill
                          sizes="(min-width: 1024px) 50vw, 100vw"
                          className="object-contain"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}

function StepItem({
  step,
  index,
  state,
  stacked = false,
}: {
  step: Step;
  index: number;
  state: "done" | "active" | "upcoming";
  /** Small-screen layout: just the title and text, with the steps on top of each other. */
  stacked?: boolean;
}) {
  const { Icon } = step;
  const icon = useRef<IconHandle>(null);

  // Play the step's icon each time it becomes the active one.
  useEffect(() => {
    if (state !== "active") return;
    const timer = setTimeout(() => icon.current?.startAnimation(), 150);
    return () => clearTimeout(timer);
  }, [state]);

  const copy = (
    <div
      className={cn(
        "flex flex-col gap-2 transition-opacity duration-500",
        // The top padding lines the title up with the middle of the marker.
        !stacked && "pt-2",
        !stacked && state !== "active" && "opacity-40",
      )}
    >
      <h3 className="text-2xl leading-[1.15] font-extrabold tracking-[-0.02em] text-brand-foreground sm:text-[28px]">
        {step.title}
      </h3>
      <p className="text-base leading-relaxed text-foreground/80 sm:text-[17px]">
        {step.text}
      </p>
    </div>
  );

  if (stacked) {
    return (
      <motion.li
        data-state={state}
        aria-hidden={state !== "active" ? true : undefined}
        initial={false}
        animate={focus(state === "active")}
        transition={swap}
        className={cn(
          "col-start-1 row-start-1",
          state !== "active" && "pointer-events-none",
        )}
      >
        {copy}
      </motion.li>
    );
  }

  return (
    <li data-state={state} className="group flex gap-6">
      <span
        className={cn(
          "grid size-12 shrink-0 place-items-center rounded-full border-2 font-heading text-lg font-bold transition-colors duration-500",
          state === "active"
            ? "border-brand-foreground bg-brand-foreground text-white"
            : "border-brand-foreground/15 text-brand-foreground/40",
        )}
      >
        {state === "active" ? (
          <Icon ref={icon} size={22} strokeWidth={2} />
        ) : state === "done" ? (
          <TbCheck className="size-5" aria-hidden="true" />
        ) : (
          index + 1
        )}
      </span>
      {copy}
    </li>
  );
}
