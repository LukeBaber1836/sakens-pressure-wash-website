import { serviceTowns } from "./service-area-data";
import { ServiceAreaMap } from "./service-area-map";

export function ServiceArea() {
  return (
    <section id="area" className="site-container py-20 sm:py-26">
      <div className="flex flex-col gap-10 rounded-[24px] bg-tint p-6 sm:p-10 lg:flex-row lg:items-center lg:gap-16 lg:p-14">
        <div className="h-80 w-full shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-brand-foreground/10 sm:h-[360px] lg:w-[520px]">
          <ServiceAreaMap />
        </div>

        <div className="flex flex-col gap-5">
          <h2 className="text-4xl leading-[1.08] font-extrabold tracking-[-0.02em] text-brand-foreground sm:text-[44px]">
            Serving Tyler and East Texas
          </h2>
          <p className="text-[17px] leading-relaxed text-foreground/80">
            Towns we regularly serve:
          </p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-[17px] font-semibold text-brand-foreground sm:grid-cols-3">
            {serviceTowns.map((town) => (
              <li key={town.name}>{town.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
