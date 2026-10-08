import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NotchedCard } from "./notched-card";
import { TrustPill } from "./trust-pill";

// Fades up once the card reveals; each line passes its own delay.
const entrance =
  "translate-y-3 opacity-0 transition duration-700 ease-out group-data-ready/notch:translate-y-0 group-data-ready/notch:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none";

export function Hero() {
  return (
    <section id="top" className="site-container shrink-0 grow pt-2 [--site-max:125rem]">
      <NotchedCard
        notch={<TrustPill />}
        // Fill the viewport below the 5rem nav, leaving 1rem under the card; floor it for short screens.
        className="relative flex h-[calc(100svh-6.5rem)] min-h-[600px] flex-col rounded-[28px] bg-[#0b2440] sm:min-h-[520px]"
      >
        {/* The video's first frame, preloaded, showing through until the video can play. */}
        <Image
          src="/images/hero-poster.webp"
          alt=""
          fill
          preload
          sizes="100vw"
          className="object-cover"
        />
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/videos/roof_360.webm"
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,20,45,0.82)_0%,rgba(1,20,45,0.55)_42%,rgba(1,20,45,0.05)_75%)]" />

        <div className="relative flex flex-1 flex-col justify-center gap-7 px-6 pt-12 pb-44 text-white sm:w-[724px] sm:px-16 sm:pb-24">
          <h1
            className={cn(
              entrance,
              "delay-150 text-5xl leading-[1.02] font-extrabold tracking-[-0.025em] sm:w-[711px] sm:max-w-[calc(100vw-8rem)] sm:text-[55px]"
            )}
          >
            Pressure washing and soft washing in East TX
          </h1>

          {/* Wrapped so the entrance timing doesn't slow the button's own hover transition. */}
          <div className={cn(entrance, "delay-300")}>
            <Button
              variant="brand"
              size="xl"
              nativeButton={false}
              render={<Link href="/contact" />}
              className="w-fit"
            >
              Book a free estimate
            </Button>
          </div>

          <a
            href="tel:9035398960"
            className={cn(
              entrance,
              "text-base font-semibold text-white underline-offset-4 delay-450 hover:underline"
            )}
          >
            Prefer to talk? Call (903) 539-8960
          </a>
        </div>
      </NotchedCard>
    </section>
  );
}
