"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { animate } from "motion/react";
import { cn } from "@/lib/utils";

// Space between the notched item and the card around it.
const GAP = 12;
// Card corners, including where the card turns around the notch.
const R = 28;
// Inner corner of the notch, concentric with the 28px pill plus the gap.
const RN = R + GAP;

/**
 * SVG outline of a w×h card with a nw×nh notch cut from its bottom-left corner. While the notch is
 * shallower than its two corners need, both shrink with it, so it can grow smoothly out of the
 * bottom edge from a depth of 0.
 */
function notchedPath(w: number, h: number, nw: number, nh: number) {
  const top = h - nh;
  const k = Math.min(1, nh / (R + RN));
  const r = R * k;
  const rn = RN * k;
  return [
    `M0 ${R}`,
    `A${R} ${R} 0 0 1 ${R} 0`,
    `L${w - R} 0`,
    `A${R} ${R} 0 0 1 ${w} ${R}`,
    `L${w} ${h - R}`,
    `A${R} ${R} 0 0 1 ${w - R} ${h}`,
    `L${nw + r} ${h}`,
    `A${r} ${r} 0 0 1 ${nw} ${h - r}`,
    `L${nw} ${top + rn}`,
    `A${rn} ${rn} 0 0 0 ${nw - rn} ${top}`,
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

/**
 * A card with its bottom-left corner cut away to make room for a separate floating item. With
 * `notchOpen` false the card stays whole and the item hidden; switching it on grows the notch up out
 * of the bottom edge with the item rising inside it.
 */
export function NotchedCard({
  children,
  notch,
  notchOpen = true,
  fadeIn = true,
  className,
}: {
  children: ReactNode;
  notch: ReactNode;
  notchOpen?: boolean;
  /** For a card that starts notched: fade in once the mask is ready, rather than appear at once. */
  fadeIn?: boolean;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const notchRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<SVGSVGElement>(null);
  const shadowFilterId = useId();
  // How far the notch is open, 0 to 1, and the redraw for it; both live outside React state so the
  // reveal animation can redraw every frame without re-rendering.
  const openRef = useRef(notchOpen ? 1 : 0);
  const redrawRef = useRef(() => {});
  // A card that starts with the notch closed is just a rounded rectangle, which CSS alone draws, so it
  // can show from the first paint; only a card that starts notched waits for its mask.
  const [startsNotched] = useState(notchOpen);

  useLayoutEffect(() => {
    const card = cardRef.current;
    const item = notchRef.current;
    const shadow = shadowRef.current;
    const root = rootRef.current;
    if (!card || !item || !shadow || !root) return;

    const update = () => {
      const open = openRef.current;
      const w = card.offsetWidth;
      const h = card.offsetHeight;
      const fullNh = item.offsetHeight + GAP;
      const nh = fullNh * open;
      // A full-width item would leave only a thin lip beside it, so end the card above the item instead.
      const path =
        item.offsetWidth >= w
          ? roundedRectPath(w, h - nh)
          : notchedPath(w, h, item.offsetWidth + GAP, nh);
      // The item rides up with the notch's top edge.
      item.style.transform = open < 1 ? `translateY(${fullNh - nh}px)` : "";
      item.style.opacity = open < 1 ? String(open) : "";
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><path d="${path}"/></svg>`;
      const mask = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
      card.style.maskImage = mask;
      card.style.setProperty("-webkit-mask-image", mask);
      shadow.setAttribute("viewBox", `0 0 ${w} ${h}`);
      shadow.querySelector("path")?.setAttribute("d", path);
      // Reveal only once the notch is cut, so the first paint never shows a plain rectangle.
      root.dataset.ready = "";
    };

    redrawRef.current = update;
    // Cut the notch before the first paint rather than waiting on the observer's initial callback.
    update();
    const observer = new ResizeObserver(update);
    observer.observe(card);
    observer.observe(item);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const target = notchOpen ? 1 : 0;
    if (openRef.current === target) return;
    const controls = animate(openRef.current, target, {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        openRef.current = v;
        redrawRef.current();
      },
    });
    return () => controls.stop();
  }, [notchOpen]);

  return (
    // Hidden until the mask is in place, then fades in. Children can key their own entrances off
    // `group-data-ready/notch:`.
    <div
      ref={rootRef}
      className={cn(
        "group/notch relative",
        startsNotched && "opacity-0 data-ready:opacity-100",
        startsNotched &&
          fadeIn &&
          "transition-opacity duration-500 ease-out motion-reduce:transition-none",
      )}
    >
      <div
        ref={cardRef}
        className={cn(
          "overflow-hidden [mask-size:100%_100%] [mask-repeat:no-repeat]",
          className,
        )}
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
          <filter
            id={shadowFilterId}
            x="-25%"
            y="-25%"
            width="150%"
            height="150%"
          >
            <feGaussianBlur stdDeviation="40" />
          </filter>
          <path
            fill="none"
            stroke="rgb(0 0 0 / 0.4)"
            strokeWidth="90"
            transform="translate(0 14)"
            filter={`url(#${shadowFilterId})`}
          />
          {/* The same shadow for a card that starts unnotched, drawn without measuring so it's there
              from the first paint. The measured path matches it exactly and takes over once ready. */}
          {!startsNotched && (
            <rect
              width="100%"
              height="100%"
              rx={R}
              fill="none"
              stroke="rgb(0 0 0 / 0.4)"
              strokeWidth="90"
              transform="translate(0 14)"
              filter={`url(#${shadowFilterId})`}
              className="group-data-ready/notch:hidden"
            />
          )}
        </svg>
      </div>
      <div
        ref={notchRef}
        // Kept out of sight until the card has measured it and tucked it into place.
        className="invisible absolute inset-x-0 bottom-0 group-data-ready/notch:visible md:right-auto md:max-w-[calc(100%-4.5rem)]"
      >
        {notch}
      </div>
    </div>
  );
}
