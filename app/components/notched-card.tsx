"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
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
  const cardRef = useRef<HTMLDivElement>(null);
  const notchRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const card = cardRef.current;
    const item = notchRef.current;
    if (!card || !item) return;

    const update = () => {
      const w = card.offsetWidth;
      const h = card.offsetHeight;
      const path = notchedPath(w, h, item.offsetWidth + GAP, item.offsetHeight + GAP);
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><path d="${path}"/></svg>`;
      const mask = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
      card.style.maskImage = mask;
      card.style.setProperty("-webkit-mask-image", mask);
    };

    const observer = new ResizeObserver(update);
    observer.observe(card);
    observer.observe(item);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative">
      <div className="drop-shadow-[0_24px_40px_rgba(1,20,45,0.35)]">
        <div
          ref={cardRef}
          className={cn("overflow-hidden [mask-size:100%_100%] [mask-repeat:no-repeat]", className)}
        >
          {children}
        </div>
      </div>
      <div ref={notchRef} className="absolute bottom-0 left-0 max-w-[calc(100%-4.5rem)]">
        {notch}
      </div>
    </div>
  );
}
