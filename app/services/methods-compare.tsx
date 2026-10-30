import type { IconType } from "react-icons";
import { TbSpray, TbWind } from "react-icons/tb";
import { cn } from "@/lib/utils";
import { Eyebrow } from "../components/eyebrow";
import { methods } from "./services-content";

// Each method gets its own icon and accent: orange for the gentle soft wash, navy for pressure.
const look: Record<
  (typeof methods)[number]["id"],
  { Icon: IconType; accent: string }
> = {
  soft: { Icon: TbSpray, accent: "text-brand" },
  pressure: { Icon: TbWind, accent: "text-brand-foreground" },
};

/** Side-by-side: which of the two methods gets used where, and why. */
export function MethodsCompare() {
  return (
    // A rounded card inset from the screen edges like the mission statement, edge to edge on phones.
    <section
      aria-labelledby="methods-heading"
      className="site-container [--site-max:125rem] max-sm:px-0"
    >
      <div className="rounded-[32px] bg-secondary max-sm:rounded-none">
        <div className="site-container py-20 sm:py-26">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
            <Eyebrow>Let&rsquo;s define the terms</Eyebrow>
            <h2
              id="methods-heading"
              className="text-4xl leading-[1.08] font-extrabold tracking-[-0.02em] text-brand-foreground sm:text-[44px] 2xl:text-[52px]"
            >
              Soft wash vs. pressure wash
            </h2>
          </div>

          <div className="mx-auto mt-12 grid max-w-5xl gap-6 sm:mt-14 md:grid-cols-2 2xl:max-w-6xl 2xl:gap-8">
            {methods.map((method) => {
              const { Icon, accent } = look[method.id];
              return (
                <article
                  key={method.id}
                  className="flex flex-col rounded-[28px] bg-white p-7 shadow-[0_18px_40px_-24px_rgba(1,20,45,0.35)] ring-1 ring-brand-foreground/10 sm:p-9 2xl:p-11"
                >
                  {/* The icon sits beside the name and tagline as one header. */}
                  <div className="flex items-center gap-4">
                    <Icon
                      className={cn("size-10 shrink-0", accent)}
                      aria-hidden="true"
                    />
                    <div>
                      <h3 className="text-2xl font-extrabold text-brand-foreground 2xl:text-[28px]">
                        {method.name}
                      </h3>
                      <p className={cn("mt-0.5 text-sm font-bold 2xl:text-base", accent)}>
                        {method.tagline}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-[16px] leading-relaxed text-foreground/80 2xl:text-[18px]">
                    {method.text}
                  </p>
                  <p className="mt-6 text-xs font-bold tracking-[0.12em] text-brand-foreground/50 uppercase">
                    Used on
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {method.usedOn.map((surface) => (
                      <li
                        key={surface}
                        className="rounded-full bg-tint px-3 py-1.5 text-sm font-semibold text-brand-foreground"
                      >
                        {surface}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
