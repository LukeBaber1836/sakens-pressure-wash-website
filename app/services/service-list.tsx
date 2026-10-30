"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, MotionConfig } from "motion/react";
import { TbArrowUpRight, TbCheck } from "react-icons/tb";
import { CarouselDots } from "@animate-ui/react/primitives/carousel";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Eyebrow } from "../components/eyebrow";
import {
  commercialDetails,
  hoaPackage,
  residentialDetails,
  type Method,
  type ServiceDetail,
} from "./services-content";

const methodLabels: Record<Method, string> = {
  soft: "Soft wash",
  pressure: "Pressure wash",
  both: "Soft & pressure wash",
};

const groups = [
  {
    id: "residential",
    label: "For your home",
    title: "Residential",
    services: residentialDetails,
  },
  {
    id: "commercial",
    label: "For your business",
    title: "Commercial",
    services: commercialDetails,
  },
];

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
} as const;

/**
 * Every service written up in full, each group in its own full-width band holding a carousel of
 * service cards: residential, then commercial with the HOA package closing it out.
 */
export function ServiceList() {
  return (
    <MotionConfig reducedMotion="user">
      {groups.map((group) => {
        const commercial = group.id === "commercial";
        return (
          <section
            key={group.id}
            id={group.id}
            aria-labelledby={`${group.id}-heading`}
            className="scroll-mt-12"
          >
            <div className="site-container py-20 sm:py-26">
              <div className="flex flex-col items-center gap-3 text-center">
                <Eyebrow>{group.label}</Eyebrow>
                <h2
                  id={`${group.id}-heading`}
                  className="text-4xl leading-[1.08] font-extrabold tracking-[-0.02em] text-brand-foreground sm:text-[44px] 2xl:text-[52px]"
                >
                  {group.title}
                </h2>
              </div>
              <motion.div {...reveal} className="mt-12 sm:mt-16">
                <ServiceCarousel services={group.services} />
              </motion.div>
              {commercial && <HoaCallout />}
            </div>
          </section>
        );
      })}
    </MotionConfig>
  );
}

// Loop needs enough slides to fill the view and still have one to wrap in; 7 covers 4 visible.
const MIN_LOOP_SLIDES = 7;

/** How many cards show at once: four on desktop, fewer as the screen narrows. */
function useVisibleCards() {
  return useSyncExternalStore(
    (onChange) => {
      const queries = [
        "(min-width: 64rem)",
        "(min-width: 48rem)",
        "(min-width: 40rem)",
      ].map((q) => window.matchMedia(q));
      queries.forEach((q) => q.addEventListener("change", onChange));
      return () =>
        queries.forEach((q) => q.removeEventListener("change", onChange));
    },
    () =>
      window.matchMedia("(min-width: 64rem)").matches
        ? 4
        : window.matchMedia("(min-width: 48rem)").matches
          ? 3
          : window.matchMedia("(min-width: 40rem)").matches
            ? 2
            : 1,
    () => 4,
  );
}

/**
 * One group's services as a looping carousel. Short groups are repeated so the loop has room to
 * wrap. The explorer's cards link to `#service-id`; those anchors sit at the carousel's top, and the
 * carousel turns to that service when the hash changes.
 */
function ServiceCarousel({ services }: { services: ServiceDetail[] }) {
  const visible = useVisibleCards();
  const [api, setApi] = useState<CarouselApi>();
  // Lets a trackpad's sideways swipe or a shift+wheel turn the carousel; vertical scrolling passes
  // through. Plugins hold per-carousel state, so each carousel makes its own.
  const [plugins] = useState(() => [WheelGesturesPlugin()]);
  const repeats = Math.ceil(MIN_LOOP_SLIDES / services.length);
  const slides = Array.from({ length: repeats }, () => services).flat();

  useEffect(() => {
    if (!api) return;
    const goToHash = () => {
      const index = services.findIndex(
        (s) => `#${s.id}` === window.location.hash,
      );
      if (index >= 0) api.scrollTo(index);
    };
    goToHash();
    window.addEventListener("hashchange", goToHash);
    return () => window.removeEventListener("hashchange", goToHash);
  }, [api, services]);

  return (
    <div className="relative">
      {services.map((service) => (
        // Clears the sticky nav when an explorer card jumps here.
        <span
          key={service.id}
          id={service.id}
          aria-hidden="true"
          className="absolute top-0 scroll-mt-32"
        />
      ))}
      <Carousel
        setApi={setApi}
        opts={{ loop: true, align: "center", scale: 0.9, visible }}
        plugins={plugins}
      >
        {/* Bottom padding gives the card shadows room to fade out before the viewport clips them.
            Once several cards show, the mask fades them out at either side rather than cutting
            them off. */}
        <CarouselContent viewportClassName="cursor-grab pb-14 active:cursor-grabbing sm:[mask-image:linear-gradient(to_right,transparent,black_2rem,black_calc(100%-2rem),transparent)] md:[mask-image:linear-gradient(to_right,transparent,black_6rem,black_calc(100%-6rem),transparent)]">
          {slides.map((service, i) => (
            <CarouselItem
              key={`${service.id}-${i}`}
              // An approximate width for the server render, before the carousel measures itself.
              className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <ServiceCard service={service} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-3 size-11 rounded-full bg-white shadow-md sm:left-6" />
        <CarouselNext className="right-3 size-11 rounded-full bg-white shadow-md sm:right-6" />
        <CarouselDots className="mx-auto w-fit text-brand-foreground" />
      </Carousel>
    </div>
  );
}

function ServiceCard({ service }: { service: ServiceDetail }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_24px_50px_-24px_rgba(1,20,45,0.35)] ring-1 ring-brand-foreground/8">
      <ServicePhoto
        photo={service.photo}
        sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
      />
      <div className="flex flex-1 flex-col items-start p-6">
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-bold tracking-[0.08em] uppercase",
            // Orange for soft washing; a soft navy wash for anything pressure washed.
            service.method === "soft"
              ? "bevel-brand text-brand-foreground"
              : "bevel-light text-brand-foreground",
          )}
        >
          {methodLabels[service.method]}
        </span>
        <h3 className="mt-4 text-2xl leading-[1.1] font-extrabold tracking-[-0.02em] text-brand-foreground">
          {service.name}
        </h3>
        <IncludesList items={service.includes} />
        <Link
          href={`/contact?service=${service.id}`}
          className="mt-auto inline-flex items-center gap-1.5 pt-6 text-base font-bold text-brand-foreground underline-offset-4 hover:underline"
        >
          Get a quote for this
          <TbArrowUpRight className="size-5 text-brand" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function IncludesList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-4 flex flex-col gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 text-[15px] text-foreground/85"
        >
          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bevel-brand text-brand-foreground">
            <TbCheck className="size-3.5" strokeWidth={3} aria-hidden="true" />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

/** A square photo; before/after collages get small labels on each half. */
function ServicePhoto({
  photo,
  sizes,
  className,
}: {
  photo: ServiceDetail["photo"];
  sizes: string;
  className?: string;
}) {
  const label =
    "absolute rounded-full px-2.5 py-1 text-[11px] font-bold tracking-[0.1em] uppercase backdrop-blur-sm";
  const firstHalf = "top-3 left-3";
  const secondHalf =
    photo.beforeAfter === "side"
      ? "top-3 left-[calc(50%+0.75rem)]"
      : "top-[calc(50%+0.75rem)] left-3";

  return (
    <div
      className={cn("relative aspect-square w-full overflow-hidden", className)}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        className="object-cover"
      />
      {photo.beforeAfter && (
        <>
          <span
            aria-hidden="true"
            className={cn(
              label,
              "bevel-dark text-white",
              photo.afterFirst ? secondHalf : firstHalf,
            )}
          >
            Before
          </span>
          <span
            aria-hidden="true"
            className={cn(
              label,
              "bevel-brand text-brand-foreground",
              photo.afterFirst ? firstHalf : secondHalf,
            )}
          >
            After
          </span>
        </>
      )}
    </div>
  );
}

/** HOA packages aren't a single surface, so they get a wide card of their own after the list. */
function HoaCallout() {
  return (
    <motion.section
      id="hoa"
      aria-labelledby="hoa-heading"
      {...reveal}
      className="mt-20 grid scroll-mt-32 grid-cols-[minmax(0,1fr)] items-center gap-10 rounded-[32px] bg-brand-foreground p-6 text-white sm:mt-26 sm:p-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:p-14"
    >
      <div className="flex flex-col items-start">
        <h2
          id="hoa-heading"
          className="text-4xl leading-[1.08] font-extrabold tracking-[-0.02em] sm:text-[44px] 2xl:text-[52px]"
        >
          {hoaPackage.title}
        </h2>
        <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-white/80 2xl:max-w-2xl 2xl:text-[19px]">
          {hoaPackage.summary}
        </p>
        <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {hoaPackage.includes.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-[15px] text-white/90 2xl:text-[17px]"
            >
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bevel-brand text-brand-foreground">
                <TbCheck
                  className="size-3.5"
                  strokeWidth={3}
                  aria-hidden="true"
                />
              </span>
              {item}
            </li>
          ))}
        </ul>
        <Button
          variant="brand"
          size="xl"
          nativeButton={false}
          render={<Link href={`/contact?service=${hoaPackage.id}`} />}
          // Allowed to wrap on the narrowest phones rather than push the card past the screen.
          className="mt-9 max-w-full max-sm:h-auto max-sm:min-h-14 max-sm:py-3 max-sm:whitespace-normal"
        >
          Talk to us about your HOA
          <TbArrowUpRight data-icon="inline-end" />
        </Button>
      </div>
      <ServicePhoto
        photo={hoaPackage.photo}
        sizes="(min-width: 768px) 420px, 100vw"
        className="mx-auto max-w-[440px] rounded-[28px] shadow-[0_24px_50px_-24px_rgba(1,20,45,0.45)]"
      />
    </motion.section>
  );
}
