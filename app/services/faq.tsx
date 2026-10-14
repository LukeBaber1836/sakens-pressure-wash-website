"use client";

import { Accordion } from "@base-ui/react/accordion";
import { TbPlus } from "react-icons/tb";
import { faqs } from "./services-content";

/** Common questions, each opening in place. */
export function Faq() {
  return (
    <section aria-labelledby="faq-heading" className="bg-tint">
      <div className="site-container py-20 [--site-max:52rem] sm:py-26">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2
            id="faq-heading"
            className="text-4xl leading-[1.08] font-extrabold tracking-[-0.02em] text-brand-foreground sm:text-[44px]"
          >
            FAQ
          </h2>
        </div>

        <Accordion.Root className="mt-12 flex flex-col gap-3 sm:mt-14">
          {faqs.map(({ q, a }) => (
            <Accordion.Item
              key={q}
              className="rounded-2xl bg-white ring-1 ring-brand-foreground/10 transition-shadow data-open:shadow-[0_18px_40px_-24px_rgba(1,20,45,0.35)]"
            >
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center justify-between gap-6 rounded-2xl px-6 py-5 text-left text-lg font-bold text-brand-foreground outline-none focus-visible:ring-2 focus-visible:ring-brand">
                  {q}
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-tint transition-colors group-data-panel-open:bg-brand">
                    <TbPlus
                      className="size-4 transition-transform duration-300 group-data-panel-open:rotate-45"
                      strokeWidth={3}
                      aria-hidden="true"
                    />
                  </span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-300 ease-out data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none">
                <p className="px-6 pb-6 text-[16px] leading-relaxed text-foreground/80">
                  {a}
                </p>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
