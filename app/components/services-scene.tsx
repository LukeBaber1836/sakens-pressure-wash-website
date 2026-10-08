"use client";

import { useState, type FocusEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, MotionConfig, type Variants } from "motion/react";
import { TbArrowUpRight, TbPlus } from "react-icons/tb";
import { cn } from "@/lib/utils";
import type { ServiceHotspot } from "./services-breakdown-data";

export type Scene = {
  /** A 1264×848 line drawing on transparency. */
  image: { src: string; alt: string };
  services: ServiceHotspot[];
  /** Optional tinted fills under the drawing. Each part shows while its service is active; a service can have several. */
  surfaces?: {
    viewBox: string;
    parts: SurfacePart[];
  };
};

export type SurfacePart = { service: string; d: string; color: string };

const pop = { type: "spring", bounce: 0.2, visualDuration: 0.3 } as const;
// Cards leave twice as fast as they arrive.
const popOut = { ...pop, visualDuration: 0.15 } as const;

// Dots sharpen out of a blur one after another, in a scattered rather than left-to-right order.
const dotEntrance: Variants = {
  hidden: { opacity: 0, scale: 0.6, filter: "blur(8px)" },
  show: (rank: number) => ({
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { delay: 0.25 + rank * 0.07, duration: 0.4, ease: "easeOut" },
  }),
};

/** Entrance rank per index: sorting by the golden-ratio fraction of each index scatters any count. */
function scatteredRanks(count: number) {
  const order = Array.from({ length: count }, (_, i) => i).sort(
    (a, b) => ((a * 0.618) % 1) - ((b * 0.618) % 1)
  );
  return order.reduce<number[]>((ranks, index, rank) => {
    ranks[index] = rank;
    return ranks;
  }, []);
}

export function ServicesScene({ scene }: { scene: Scene }) {
  const { image, services, surfaces } = scene;
  // The active service: its surface tints and its card opens. Set by its dot or its button below.
  const [active, setActive] = useState<string | null>(null);

  const close = (id: string) => setActive((current) => (current === id ? null : current));
  const ranks = scatteredRanks(services.length);

  return (
    <MotionConfig transition={pop} reducedMotion="user">
      <div className="relative mx-auto aspect-[1264/848] w-full max-w-[960px]">
        {/* Surface fills sit under the transparent line drawing, so the linework stays crisp on top.
            They only follow the active service and never take the pointer themselves. */}
        {surfaces && (
          <svg
            viewBox={surfaces.viewBox}
            aria-hidden="true"
            className="edge-fade pointer-events-none absolute inset-0 size-full"
          >
            {surfaces.parts.map((part, i) => (
              <path
                key={i}
                d={part.d}
                fill={part.color}
                fillRule="evenodd"
                className={cn(
                  "transition-opacity duration-300 motion-reduce:transition-none",
                  active === part.service ? "opacity-100" : "opacity-0"
                )}
              />
            ))}
          </svg>
        )}

        <Image
          src={image.src}
          alt={image.alt}
          width={1264}
          height={848}
          sizes="(min-width: 1024px) 960px, 100vw"
          className="edge-fade pointer-events-none relative h-full w-full select-none"
          draggable={false}
        />

        {services.map((service, i) => (
          <Hotspot
            key={service.id}
            service={service}
            entranceRank={ranks[i]}
            open={active === service.id}
            onOpen={() => setActive(service.id)}
            onClose={() => close(service.id)}
          />
        ))}
      </div>

      <ul className="mt-6 flex flex-wrap justify-center gap-2.5 sm:mt-10">
        {services.map((service) => (
          <li key={service.id}>
            <button
              type="button"
              aria-pressed={active === service.id}
              aria-controls={`service-${service.id}`}
              onPointerEnter={(e) => e.pointerType === "mouse" && setActive(service.id)}
              onPointerLeave={(e) => e.pointerType === "mouse" && close(service.id)}
              onFocus={() => setActive(service.id)}
              onBlur={() => close(service.id)}
              onClick={() => setActive(service.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold ring-1 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand",
                active === service.id
                  ? "bg-brand-foreground text-white ring-brand-foreground"
                  : "bg-white text-brand-foreground ring-brand-foreground/15 hover:bg-tint"
              )}
            >
              {service.name}
            </button>
          </li>
        ))}
      </ul>
    </MotionConfig>
  );
}

function Hotspot({
  service,
  entranceRank,
  open,
  onOpen,
  onClose,
}: {
  service: ServiceHotspot;
  entranceRank: number;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const panelId = `service-${service.id}`;
  const below = service.y < 35;
  const align =
    service.x < 25 ? "left-0" : service.x > 70 ? "right-0" : "left-1/2 -translate-x-1/2";

  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) onClose();
  };

  return (
    <div
      style={{ left: `${service.x}%`, top: `${service.y}%` }}
      className={cn("absolute -translate-x-1/2 -translate-y-1/2", open ? "z-20" : "z-10")}
      onPointerEnter={(e) => e.pointerType === "mouse" && onOpen()}
      onPointerLeave={(e) => e.pointerType === "mouse" && onClose()}
      onFocus={onOpen}
      onBlur={handleBlur}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <motion.div
        variants={dotEntrance}
        custom={entranceRank}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={service.name}
          onClick={onOpen}
          className="relative grid size-9 place-items-center rounded-full outline-none"
        >
          <motion.span
            aria-hidden="true"
            animate={{ rotate: open ? 45 : 0, scale: open ? 1.12 : 1 }}
            className={cn(
              "relative grid size-7 place-items-center rounded-full shadow-[0_4px_14px_rgba(1,20,45,0.35)] ring-2 ring-white transition-colors",
              open
                ? "bg-brand text-brand-foreground"
                : "bg-[color-mix(in_oklch,var(--primary)_55%,white)] text-white"
            )}
          >
            <TbPlus className="size-4" strokeWidth={3} />
          </motion.span>
        </button>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            initial={{ opacity: 0, y: below ? -6 : 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: below ? -6 : 6,
              scale: 0.96,
              transition: popOut,
            }}
            className={cn(
              "absolute w-64 rounded-2xl bg-white p-4 text-left shadow-[0_18px_40px_-12px_rgba(1,20,45,0.45)] ring-1 ring-brand-foreground/10",
              below ? "top-full mt-2" : "bottom-full mb-2",
              align
            )}
          >
            <h3 className="text-lg leading-tight font-extrabold text-brand-foreground">
              {service.name}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/75">
              {service.description}
            </p>
            <Link
              href="/contact"
              className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-brand-foreground underline-offset-4 hover:underline"
            >
              Get a free estimate
              <TbArrowUpRight className="size-4 text-brand" aria-hidden="true" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
