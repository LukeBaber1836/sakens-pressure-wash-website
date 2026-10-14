"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, MotionConfig } from "motion/react";
import { TbArrowUpRight, TbCheck } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
 * Every service written up in full, each group in its own full-width band: residential on white,
 * then commercial on gray with the HOA package closing it out. Each row alternates its photo side and
 * carries an id, so the explorer's cards can jump straight to it.
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
            className={cn("scroll-mt-12", !commercial && "bg-tint")}
          >
            <div className="site-container py-20 sm:py-26">
              <div className="flex flex-col items-center gap-3 text-center">
                <p className="text-sm font-bold tracking-[0.12em] text-brand uppercase">
                  {group.label}
                </p>
                <h2
                  id={`${group.id}-heading`}
                  className="text-4xl leading-[1.08] font-extrabold tracking-[-0.02em] text-brand-foreground sm:text-[44px]"
                >
                  {group.title}
                </h2>
              </div>
              <ul className="mx-auto mt-12 flex max-w-5xl flex-col gap-16 sm:mt-16 lg:gap-20">
                {group.services.map((service, i) => (
                  <ServiceRow
                    key={service.id}
                    service={service}
                    flipped={i % 2 === 1}
                  />
                ))}
              </ul>
              {commercial && <HoaCallout />}
            </div>
          </section>
        );
      })}
    </MotionConfig>
  );
}

function ServiceRow({
  service,
  flipped,
}: {
  service: ServiceDetail;
  flipped: boolean;
}) {
  return (
    <motion.li
      id={service.id}
      {...reveal}
      // Clears the sticky nav when an explorer card or group link jumps here.
      className={cn(
        "grid scroll-mt-32 items-center gap-8 md:gap-12 lg:gap-16",
        // The photo always gets the narrower column, on whichever side it sits.
        flipped
          ? "md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]"
          : "md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]",
      )}
    >
      <ServicePhoto
        photo={service.photo}
        className={cn(flipped && "md:order-last")}
      />

      <div className="flex max-w-xl flex-col items-start">
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-bold tracking-[0.08em] uppercase",
            // Orange for soft washing; a soft navy wash for anything pressure washed.
            service.method === "soft"
              ? "bg-brand text-brand-foreground"
              : "bg-brand-foreground/8 text-brand-foreground",
          )}
        >
          {methodLabels[service.method]}
        </span>
        <h3 className="mt-4 text-3xl leading-[1.1] font-extrabold tracking-[-0.02em] text-brand-foreground">
          {service.name}
        </h3>
        <IncludesList items={service.includes} />
        <Link
          href={`/contact?service=${service.id}`}
          className="mt-7 inline-flex items-center gap-1.5 text-base font-bold text-brand-foreground underline-offset-4 hover:underline"
        >
          Get a quote for this
          <TbArrowUpRight className="size-5 text-brand" aria-hidden="true" />
        </Link>
      </div>
    </motion.li>
  );
}

function IncludesList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-5 flex flex-col gap-2.5">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-start gap-3 text-[15px] text-foreground/85"
        >
          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground">
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
  className,
}: {
  photo: ServiceDetail["photo"];
  className?: string;
}) {
  const label =
    "absolute rounded-full bg-black/55 px-2.5 py-1 text-[11px] font-bold tracking-[0.1em] text-white uppercase backdrop-blur-sm";

  return (
    <div
      className={cn(
        "relative mx-auto aspect-square w-full max-w-[440px] overflow-hidden rounded-[28px] shadow-[0_24px_50px_-24px_rgba(1,20,45,0.45)]",
        className,
      )}
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes="(min-width: 768px) 420px, 100vw"
        className="object-cover"
      />
      {photo.beforeAfter && (
        <>
          <span aria-hidden="true" className={cn(label, "top-3 left-3")}>
            Before
          </span>
          <span
            aria-hidden="true"
            className={cn(
              label,
              "bg-brand text-brand-foreground",
              photo.beforeAfter === "side"
                ? "top-3 left-[calc(50%+0.75rem)]"
                : "top-[calc(50%+0.75rem)] left-3",
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
      className="mt-20 grid scroll-mt-32 items-center gap-10 rounded-[32px] bg-brand-foreground p-6 text-white sm:mt-26 sm:p-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:p-14"
    >
      <div className="flex flex-col items-start">
        <h2
          id="hoa-heading"
          className="text-4xl leading-[1.08] font-extrabold tracking-[-0.02em] sm:text-[44px]"
        >
          {hoaPackage.title}
        </h2>
        <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-white/80">
          {hoaPackage.summary}
        </p>
        <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          {hoaPackage.includes.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-[15px] text-white/90"
            >
              <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground">
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
          className="mt-9"
        >
          Talk to us about your HOA
          <TbArrowUpRight data-icon="inline-end" />
        </Button>
      </div>
      <ServicePhoto photo={hoaPackage.photo} />
    </motion.section>
  );
}
