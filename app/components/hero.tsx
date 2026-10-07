import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NotchedCard } from "./notched-card";
import { TrustPill } from "./trust-pill";

export function Hero() {
  return (
    <section id="top" className="site-container shrink-0 grow pt-6 sm:pt-8">
      <NotchedCard
        notch={<TrustPill />}
        className="relative flex min-h-[640px] flex-col rounded-[28px] bg-[#0b2440] sm:h-[720px]"
      >
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

        <div className="relative flex flex-1 flex-col justify-center gap-7 px-6 pt-12 pb-40 text-white sm:w-[724px] sm:px-16 sm:pb-24">
          <h1 className="text-5xl leading-[1.02] font-extrabold tracking-[-0.025em] sm:w-[711px] sm:max-w-[calc(100vw-8rem)] sm:text-[55px]">
            Pressure washing and soft washing in East TX
          </h1>

          <Button
            variant="brand"
            size="xl"
            nativeButton={false}
            render={<Link href="/contact" />}
            className="w-fit"
          >
            Book a free estimate
          </Button>

          <a
            href="tel:9035398960"
            className="text-base font-semibold text-white underline-offset-4 hover:underline"
          >
            Prefer to talk? Call (903) 539-8960
          </a>
        </div>
      </NotchedCard>
    </section>
  );
}
