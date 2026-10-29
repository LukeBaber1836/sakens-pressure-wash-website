import type { Metadata } from "next";
import { Eyebrow } from "../components/eyebrow";
import { SiteFooter } from "../components/site-footer";
import { SiteNav } from "../components/site-nav";
import { QuoteForm } from "./quote-form";

export const metadata: Metadata = {
  title: "Free Estimate | Saken's Pressure Washing",
  description:
    "Tell us about your property and the services you need, and Saken will follow up with a free, honest price.",
};

export default function ContactPage() {
  return (
    <>
      <SiteNav />
      {/* At least a full screen below the 5rem nav, so the footer always starts below the fold. */}
      <main className="flex min-h-[calc(100svh-5rem)] flex-1 flex-col">
        <section
          aria-labelledby="quote-heading"
          // Top space grows with the screen height so tall screens don't pin the form to the top.
          // Not true centering: that would shift the header every time a step changes height.
          className="group/quote site-container py-14 [--site-max:52rem] sm:pt-[clamp(5rem,14svh,12rem)] sm:pb-20"
        >
          {/* The confirmation stands on its own, so the heading goes once the request is sent. */}
          <div className="flex flex-col gap-4 text-center group-has-[[data-submitted]]/quote:hidden">
            <Eyebrow className="self-center">
              Free estimate
            </Eyebrow>
            <h1
              id="quote-heading"
              className="text-4xl leading-[1.08] font-extrabold tracking-[-0.02em] text-brand-foreground sm:text-[44px]"
            >
              Request a Price
            </h1>
          </div>

          <QuoteForm className="mt-10 sm:mt-12" />

          <p className="mt-8 text-center text-[15px] text-foreground/70">
            Prefer to talk?{" "}
            <a
              href="tel:9035398960"
              className="font-semibold text-brand-foreground underline-offset-4 hover:underline"
            >
              Call (903) 539-8960
            </a>
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
