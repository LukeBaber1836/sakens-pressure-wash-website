"use client";

import { useId, useLayoutEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// Space between the notched item and the card around it.
const GAP = 12;
// Card corners, including where the card turns around the notch.
const R = 28;
// Inner corner of the notch, concentric with the 28px pill plus the gap.
const RN = R + GAP;

/** SVG outline of a w×h card with a nw×nh notch cut from its bottom-left corner. */
function notchedPath(w: number, h: number, nw: number, nh: number) {
  const top = h - nh;
  return [
    `M0 ${R}`,
    `A${R} ${R} 0 0 1 ${R} 0`,
    `L${w - R} 0`,
    `A${R} ${R} 0 0 1 ${w} ${R}`,
    `L${w} ${h - R}`,
    `A${R} ${R} 0 0 1 ${w - R} ${h}`,
    `L${nw + R} ${h}`,
    `A${R} ${R} 0 0 1 ${nw} ${h - R}`,
    `L${nw} ${top + RN}`,
    `A${RN} ${RN} 0 0 0 ${nw - RN} ${top}`,
    `L${R} ${top}`,
    `A${R} ${R} 0 0 1 0 ${top - R}`,
    "Z",
  ].join(" ");
}

/** SVG outline of a plain w×h card with rounded corners. */
function roundedRectPath(w: number, h: number) {
  return [
    `M0 ${R}`,
    `A${R} ${R} 0 0 1 ${R} 0`,
    `L${w - R} 0`,
    `A${R} ${R} 0 0 1 ${w} ${R}`,
    `L${w} ${h - R}`,
    `A${R} ${R} 0 0 1 ${w - R} ${h}`,
    `L${R} ${h}`,
    `A${R} ${R} 0 0 1 0 ${h - R}`,
    "Z",
  ].join(" ");
}

/** A card with its bottom-left corner cut away to make room for a separate floating item. */
export function NotchedCard({
  children,
  notch,
  className,
}: {
  children: ReactNode;
  notch: ReactNode;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const notchRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<SVGSVGElement>(null);
  const shadowFilterId = useId();

  useLayoutEffect(() => {
    const card = cardRef.current;
    const item = notchRef.current;
    const shadow = shadowRef.current;
    const root = rootRef.current;
    if (!card || !item || !shadow || !root) return;

    const update = () => {
      const w = card.offsetWidth;
      const h = card.offsetHeight;
      const nh = item.offsetHeight + GAP;
      // A full-width item would leave only a thin lip beside it, so end the card above the item instead.
      const path =
        item.offsetWidth >= w
          ? roundedRectPath(w, h - nh)
          : notchedPath(w, h, item.offsetWidth + GAP, nh);
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><path d="${path}"/></svg>`;
      const mask = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
      card.style.maskImage = mask;
      card.style.setProperty("-webkit-mask-image", mask);
      shadow.setAttribute("viewBox", `0 0 ${w} ${h}`);
      shadow.querySelector("path")?.setAttribute("d", path);
      // Reveal only once the notch is cut, so the first paint never shows a plain rectangle.
      root.dataset.ready = "";
    };

    // Cut the notch before the first paint rather than waiting on the observer's initial callback.
    update();
    const observer = new ResizeObserver(update);
    observer.observe(card);
    observer.observe(item);
    return () => observer.disconnect();
  }, []);

  return (
    // Hidden until the mask is in place, then fades in. Children can key their own entrances off
    // `group-data-ready/notch:`.
    <div
      ref={rootRef}
      className="group/notch relative opacity-0 transition-opacity duration-500 ease-out data-ready:opacity-100 motion-reduce:transition-none"
    >
      <div
        ref={cardRef}
        className={cn("overflow-hidden [mask-size:100%_100%] [mask-repeat:no-repeat]", className)}
      >
        {children}
        {/* Inset shadow: a blurred stroke along the outline, its outer half clipped by the mask.
            Nudged down so it gathers along the top edges, like an inset box-shadow with a y offset. */}
        <svg
          ref={shadowRef}
          aria-hidden="true"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 size-full"
        >
          <filter id={shadowFilterId} x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="40" />
          </filter>
          <path
            fill="none"
            stroke="rgb(0 0 0 / 0.4)"
            strokeWidth="90"
            transform="translate(0 14)"
            filter={`url(#${shadowFilterId})`}
          />
        </svg>
      </div>
      <div
        ref={notchRef}
        className="absolute inset-x-0 bottom-0 md:right-auto md:max-w-[calc(100%-4.5rem)]"
      >
        {notch}
      </div>
    </div>
  );
}
