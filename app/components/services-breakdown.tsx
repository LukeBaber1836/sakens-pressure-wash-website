import { ServicesHouse } from "./services-house";

export function ServicesBreakdown() {
  return (
    <section id="services" className="site-container pt-20 sm:pt-26">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
        <h2 className="text-4xl leading-[1.08] font-extrabold tracking-[-0.02em] text-brand-foreground sm:text-[44px]">
          Services Breakdown
        </h2>
        <p className="text-[17px] leading-relaxed text-foreground/80">
          From the roof down to the sidewalk, Saken cleans every part of your property. Hover or
          tap a dot to see what&apos;s included.
        </p>
      </div>

      <div className="mt-8 sm:mt-12">
        <ServicesHouse />
      </div>
    </section>
  );
}
