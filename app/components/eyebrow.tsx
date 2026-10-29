"use client";

import { useInView } from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { HandDrawnUnderline } from "./hand-drawn-underline";

/**
 * The small handwritten label above a section heading, underlined by hand the first time it's fully
 * on screen. It's only as wide as its text, so the underline matches it; in a stretching flex column,
 * pass `self-center` or similar to place it.
 */
export function Eyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, amount: 1 });

  return (
    <p
      ref={ref}
      className={cn(
        "relative w-fit pb-2 font-hand text-[32px] leading-none text-brand",
        className,
      )}
    >
      {children}
      <HandDrawnUnderline drawn={inView} delay={0.2} />
    </p>
  );
}
