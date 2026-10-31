import type { ReactNode } from "react";
import { Eyebrow } from "./eyebrow";
import { SiteFooter } from "./site-footer";
import { SiteNav } from "./site-nav";

export const LEGAL_EMAIL = "tx@sakenpressurewash.com";
export const LEGAL_UPDATED = "October 31, 2026";

/**
 * Shell for the Terms of Service and Privacy Policy: the same header as the contact page, then a
 * readable column. Pages pass plain h2/p/ul/a elements, which are styled from here.
 */
export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <SiteNav />
      <main className="flex flex-1 flex-col">
        <article
          aria-labelledby="legal-heading"
          className="site-container py-14 [--site-max:48rem] sm:py-20"
        >
          <header className="flex flex-col gap-4 text-center">
            <Eyebrow className="self-center">Legal</Eyebrow>
            <h1
              id="legal-heading"
              className="text-4xl leading-[1.08] font-extrabold tracking-[-0.02em] text-brand-foreground sm:text-[44px] 2xl:text-[52px]"
            >
              {title}
            </h1>
            <p className="text-sm text-foreground/60">Last updated {LEGAL_UPDATED}</p>
          </header>

          <div className="mt-12 text-[16px] leading-relaxed text-foreground/80 2xl:text-[17px] [&_a]:font-semibold [&_a]:text-brand-foreground [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-brand-foreground [&_li]:mt-1.5 [&_p]:mt-3 [&_strong]:font-semibold [&_strong]:text-brand-foreground [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
            {children}
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
