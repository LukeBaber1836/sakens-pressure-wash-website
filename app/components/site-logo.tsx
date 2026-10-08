import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Shield mark plus live "Saken's / Pressure Washing" wordmark. Everything is sized in em, so set
 * the overall size with a font-size class (e.g. `text-[22px]`) and the mark and text scale together.
 */
export function SiteLogo({
  className,
  wordmarkClassName,
  preload,
}: {
  className?: string;
  /** Extra classes for the text block, e.g. to hide it where only the mark fits. */
  wordmarkClassName?: string;
  preload?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-[0.45em]", className)}>
      <Image
        src="/logos/logo_no_text.png"
        alt=""
        width={1280}
        height={1505}
        preload={preload}
        className="h-[2.5em] w-auto"
      />
      <span
        className={cn(
          "flex flex-col gap-[0.2em] font-heading leading-none uppercase",
          wordmarkClassName
        )}
      >
        <span className="text-[1.15em] font-extrabold tracking-[0.02em] text-brand">
          Saken&apos;s
        </span>
        <span className="text-[0.58em] font-bold tracking-[0.14em] text-brand-foreground">
          Pressure Washing
        </span>
      </span>
    </span>
  );
}
