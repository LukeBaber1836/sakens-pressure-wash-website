"use client";

import { useEffect, useRef } from "react";
import {
  useAnimate,
  useReducedMotion,
  type AnimationPlaybackControls,
} from "motion/react";
import { TbStarFilled } from "react-icons/tb";
import { cn } from "@/lib/utils";
import type { Review } from "./reviews-data";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

function ReviewCard({ review, duplicate }: { review: Review; duplicate?: boolean }) {
  return (
    <figure
      aria-hidden={duplicate || undefined}
      className="w-full max-w-xs rounded-3xl bg-white p-7 shadow-[0_18px_40px_-24px_rgba(1,20,45,0.35)] ring-1 ring-brand-foreground/10">
      <div className="flex gap-0.5 text-brand" role="img" aria-label={`${review.rating} out of 5 stars`}>
        {Array.from({ length: 5 }, (_, i) => (
          <TbStarFilled
            key={i}
            className={cn("size-[18px]", i >= review.rating && "text-brand-foreground/15")}
            aria-hidden="true"
          />
        ))}
      </div>
      <blockquote className="mt-4 text-[15px] leading-relaxed text-foreground/80">
        {review.text}
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="grid size-10 shrink-0 place-items-center rounded-full bg-tint text-sm font-bold text-brand-foreground"
        >
          {initials(review.name)}
        </span>
        <span className="flex flex-col">
          <span className="leading-5 font-bold text-brand-foreground">{review.name}</span>
          <span className="text-sm leading-5 text-foreground/60">
            {review.service} · {review.location}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * A column of review cards that scrolls upward forever. The list is drawn twice and the track moves
 * up by exactly half its height, so the loop is seamless. Hovering pauses it so a review can be read.
 */
export function ReviewsColumn({
  reviews,
  duration,
  direction = "up",
  className,
}: {
  reviews: Review[];
  /** Seconds for one full pass through the list. */
  duration: number;
  direction?: "up" | "down";
  className?: string;
}) {
  const [track, animate] = useAnimate<HTMLDivElement>();
  const controls = useRef<AnimationPlaybackControls | null>(null);
  // Reduced motion leaves the column still; it's clipped, but the cards stay readable.
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    // Down runs the same loop backwards, starting on the second copy.
    const y = direction === "up" ? ["0%", "-50%"] : ["-50%", "0%"];
    controls.current = animate(track.current, { y }, { duration, ease: "linear", repeat: Infinity });
    return () => controls.current?.stop();
  }, [animate, track, duration, direction, reduced]);

  return (
    <div
      className={className}
      onPointerEnter={() => controls.current?.pause()}
      onPointerLeave={() => controls.current?.play()}
    >
      <div ref={track} className="flex flex-col gap-6 pb-6">
        {/* The second pass only exists to close the loop, so screen readers skip it. */}
        {[0, 1].map((copy) =>
          reviews.map((review) => (
            <ReviewCard key={`${copy}-${review.name}`} review={review} duplicate={copy === 1} />
          ))
        )}
      </div>
    </div>
  );
}
