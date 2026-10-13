"use client";

import Image from "next/image";
import { Dialog } from "@base-ui/react/dialog";
import { motion, MotionConfig } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { TbChevronLeft, TbChevronRight, TbX } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { categories, photos, type Photo, type PhotoCategory } from "./photos";

type Filter = PhotoCategory | "all";

// Photos shown per batch; "Show more" adds another.
const PAGE = 24;

// "All" deals the categories out in turn so the first screenful shows a bit of everything.
const interleaved: Photo[] = (() => {
  const queues = categories.map(({ id }) =>
    photos.filter((p) => p.category === id),
  );
  const out: Photo[] = [];
  while (queues.some((q) => q.length)) {
    for (const q of queues) {
      const next = q.shift();
      if (next) out.push(next);
    }
  }
  return out;
})();

const counts = Object.fromEntries(
  categories.map(({ id }) => [
    id,
    photos.filter((p) => p.category === id).length,
  ]),
) as Record<PhotoCategory, number>;

/** Number of masonry columns for a given grid width. */
function columnsFor(width: number) {
  if (width >= 1200) return 4;
  if (width >= 760) return 3;
  if (width >= 420) return 2;
  return 1;
}

/**
 * The full photo gallery: filter tabs, a masonry grid that loads in batches, and a lightbox for
 * viewing any photo full size and stepping through the rest.
 */
export function PhotoGallery() {
  const [filter, setFilter] = useState<Filter>("all");
  const [shown, setShown] = useState(PAGE);
  const [open, setOpen] = useState<number | null>(null);
  const [columns, setColumns] = useState(3);
  const gridRef = useRef<HTMLDivElement>(null);

  const list = useMemo(
    () =>
      filter === "all"
        ? interleaved
        : photos.filter((p) => p.category === filter),
    [filter],
  );
  const visible = list.slice(0, shown);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const observer = new ResizeObserver(([entry]) =>
      setColumns(columnsFor(entry.contentRect.width)),
    );
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  // Deal each photo into the currently shortest column, so the grid reads left to right and a new
  // batch only ever adds to the bottom.
  const stacks = useMemo(() => {
    const cols: { photo: Photo; index: number }[][] = Array.from(
      { length: columns },
      () => [],
    );
    const heights = new Array(columns).fill(0);
    visible.forEach((photo, index) => {
      const col = heights.indexOf(Math.min(...heights));
      cols[col].push({ photo, index });
      heights[col] += photo.height / photo.width;
    });
    return cols;
  }, [visible, columns]);

  const choose = (next: Filter) => {
    setFilter(next);
    setShown(PAGE);
  };

  const step = (by: number) =>
    setOpen((i) => (i === null ? i : (i + by + list.length) % list.length));

  const current = open === null ? null : list[open];

  return (
    <MotionConfig reducedMotion="user">
      <section
        aria-labelledby="gallery-heading"
        className="site-container py-16 sm:py-20"
      >
        <h2 id="gallery-heading" className="sr-only">
          Photo gallery
        </h2>

        <div
          role="group"
          aria-label="Filter photos"
          className="flex flex-wrap justify-center gap-2"
        >
          {[{ id: "all" as const, label: "All" }, ...categories].map(
            ({ id, label }) => (
              <button
                key={id}
                type="button"
                aria-pressed={filter === id}
                onClick={() => choose(id)}
                className={cn(
                  "flex h-10 items-center gap-2 rounded-full px-4 text-sm font-bold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand",
                  filter === id
                    ? "bg-brand-foreground text-white"
                    : "bg-secondary text-brand-foreground hover:bg-tint",
                )}
              >
                {label}
                <span
                  className={cn(
                    "text-xs font-semibold",
                    filter === id
                      ? "text-white/60"
                      : "text-brand-foreground/45",
                  )}
                >
                  {id === "all" ? photos.length : counts[id]}
                </span>
              </button>
            ),
          )}
        </div>

        <div ref={gridRef} className="mt-10 flex items-start gap-3 sm:gap-4">
          {stacks.map((stack, c) => (
            <div
              key={c}
              className="flex min-w-0 flex-1 flex-col gap-3 sm:gap-4"
            >
              {stack.map(({ photo, index }) => (
                <motion.button
                  // Keyed by filter too, so switching filters plays the entrance again.
                  key={`${filter}-${photo.src}`}
                  type="button"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -40px 0px" }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setOpen(index)}
                  aria-label={`View photo: ${photo.caption}`}
                  className="group relative block overflow-hidden rounded-2xl bg-secondary outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    sizes="(min-width: 1200px) 25vw, (min-width: 760px) 33vw, (min-width: 420px) 50vw, 100vw"
                    className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/65 to-transparent p-4 pt-12 text-left text-sm font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                    {photo.caption}
                  </span>
                </motion.button>
              ))}
            </div>
          ))}
        </div>

        {shown < list.length && (
          <div className="mt-12 flex justify-center">
            <Button
              variant="brand"
              size="xl"
              onClick={() => setShown((n) => n + PAGE)}
            >
              Show more photos
            </Button>
          </div>
        )}

        <Dialog.Root
          open={open !== null}
          onOpenChange={(next) => !next && setOpen(null)}
        >
          <Dialog.Portal>
            <Dialog.Backdrop className="fixed inset-0 z-50 bg-[rgb(2_11_23/0.95)] backdrop-blur-md transition-opacity duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0" />
            <Dialog.Popup
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") step(1);
                if (e.key === "ArrowLeft") step(-1);
              }}
              className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 p-4 outline-none transition-opacity duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0 sm:p-10"
            >
              {current && (
                <>
                  <div className="flex w-full max-w-6xl items-center justify-between gap-4 text-white">
                    <div className="min-w-0">
                      <Dialog.Title className="truncate font-heading text-lg font-bold sm:text-xl">
                        {current.caption}
                      </Dialog.Title>
                      <p className="text-sm text-white/60">
                        {open! + 1} of {list.length}
                      </p>
                    </div>
                    <Dialog.Close
                      aria-label="Close"
                      className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
                    >
                      <TbX className="size-6" aria-hidden="true" />
                    </Dialog.Close>
                  </div>

                  <div className="relative w-full max-w-6xl flex-1">
                    <Image
                      key={current.src}
                      src={current.src}
                      alt={current.alt}
                      fill
                      sizes="(min-width: 1200px) 1152px, 100vw"
                      className="animate-in object-contain duration-300 fade-in"
                    />
                  </div>

                  <div className="flex gap-3">
                    <LightboxButton
                      label="Previous photo"
                      onClick={() => step(-1)}
                    >
                      <TbChevronLeft className="size-6" aria-hidden="true" />
                    </LightboxButton>
                    <LightboxButton label="Next photo" onClick={() => step(1)}>
                      <TbChevronRight className="size-6" aria-hidden="true" />
                    </LightboxButton>
                  </div>
                </>
              )}
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      </section>
    </MotionConfig>
  );
}

function LightboxButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-12 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-brand focus-visible:outline-none"
    >
      {children}
    </button>
  );
}
