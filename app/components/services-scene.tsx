"use client";

import { useState, type FocusEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { TbArrowUpRight, TbPlus } from "react-icons/tb";
import { cn } from "@/lib/utils";
import { houseServices, type HouseService } from "./services-breakdown-data";

const pop = { type: "spring", bounce: 0.2, visualDuration: 0.3 } as const;

export function ServicesHouse() {
  const [active, setActive] = useState<string | null>(null);

  const close = (id: string) => setActive((current) => (current === id ? null : current));

  return (
    <MotionConfig transition={pop} reducedMotion="user">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative mx-auto aspect-[1264/848] w-full max-w-[1100px]"
      >
        <Image
          src="/images/services-house.png"
          alt="Line drawing of a two-story home with its roof, siding, windows, gutters, fence, patio, driveway, and sidewalk"
          width={1264}
          height={848}
          sizes="(min-width: 1180px) 1100px, 100vw"
          className="edge-fade h-full w-full select-none"
          draggable={false}
        />

        {houseServices.map((service) => (
          <Hotspot
            key={service.id}
            service={service}
            open={active === service.id}
            onOpen={() => setActive(service.id)}
            onClose={() => close(service.id)}
          />
        ))}
      </motion.div>

      <ul className="mt-6 flex flex-wrap justify-center gap-2.5 sm:mt-10">
        {houseServices.map((service) => (
          <li key={service.id}>
            <button
              type="button"
              aria-pressed={active === service.id}
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
  open,
  onOpen,
  onClose,
}: {
  service: HouseService;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const panelId = `service-${service.id}`;
  const below = service.y < 35;
  const align = service.x < 25 ? "left-0" : service.x > 70 ? "right-0" : "left-1/2 -translate-x-1/2";

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
          className="relative grid size-7 place-items-center rounded-full bg-brand text-brand-foreground shadow-[0_4px_14px_rgba(1,20,45,0.35)] ring-2 ring-white"
        >
          <TbPlus className="size-4" strokeWidth={3} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            initial={{ opacity: 0, y: below ? -6 : 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: below ? -6 : 6, scale: 0.96 }}
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
