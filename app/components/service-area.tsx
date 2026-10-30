import { serviceTowns } from "./service-area-data";
import { ServiceAreaMap } from "./service-area-map";

export function ServiceArea() {
  return (
    <section id="area" className="bg-white">
      {/* Stacked below lg, the towns come first and the map sits under them. */}
      <div className="site-container flex flex-col-reverse gap-10 py-20 sm:py-26 lg:flex-row lg:items-center lg:justify-center lg:gap-16 2xl:gap-24">
        <div className="h-96 w-full shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-brand-foreground/10 sm:h-[440px] lg:w-[560px] xl:h-[460px] xl:w-[680px] 2xl:h-[540px] 2xl:w-[800px]">
          <ServiceAreaMap />
        </div>

        <div className="flex flex-col gap-5 2xl:gap-6">
          <h2 className="text-balance text-4xl leading-[1.08] font-extrabold tracking-[-0.02em] text-brand-foreground sm:text-[44px] 2xl:text-[52px]">
            Serving Tyler and East Texas
          </h2>
          <p className="text-[17px] leading-relaxed text-foreground/80 2xl:text-[19px]">
            Towns we regularly serve:
          </p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-[17px] font-semibold text-brand-foreground sm:grid-cols-3 2xl:gap-x-10 2xl:text-[19px]">
            {serviceTowns.map((town) => (
              <li key={town.name}>{town.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
