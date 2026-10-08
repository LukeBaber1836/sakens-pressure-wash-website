import Link from "next/link";
import { cacheLife } from "next/cache";
import { TbArrowUpRight } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { SiteLogo } from "./site-logo";

const linkGroups = [
  {
    title: "Pages",
    links: [
      { label: "All services", href: "/#services" },
      { label: "Our work", href: "/#work" },
      { label: "Reviews", href: "/#reviews" },
      { label: "About", href: "/#about" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

// Captured into the static shell and refreshed daily, so the year rolls over without a redeploy.
async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export function SiteFooter() {
  return (
    <footer className="border-t border-brand-foreground/10 bg-white">
      <div className="site-container pt-16 pb-8 sm:pt-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <Link href="/" aria-label="Saken's Pressure Washing home" className="h-fit w-fit">
            <SiteLogo className="text-[22px]" />
          </Link>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-3 sm:gap-x-16"
          >
            {linkGroups.map((group) => (
              <div key={group.title} className="flex flex-col gap-4">
                <h2 className="font-bold text-brand-foreground">{group.title}</h2>
                <ul className="flex flex-col gap-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-[15px] text-foreground/70 transition-colors hover:text-brand-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="col-span-2 flex flex-col gap-4 sm:col-span-1">
              <h2 className="font-bold text-brand-foreground">Get started</h2>
              <a
                href="tel:9035398960"
                className="w-fit font-semibold text-brand-foreground underline-offset-4 hover:underline"
              >
                (903) 539-8960
              </a>
              <Button
                variant="brand"
                nativeButton={false}
                render={<Link href="/contact" />}
                className="w-fit"
              >
                Free estimate
                <TbArrowUpRight data-icon="inline-end" />
              </Button>
            </div>
          </nav>
        </div>

        {/* Oversized wordmark, sized off the container's width so it always spans one line, then
            stretched taller from its baseline. Its tops fade out to nothing, so they can reach up toward
            the columns without ever touching them. Extra line height keeps the descenders inside the
            box that the gradient is clipped to. */}
        <div aria-hidden="true" className="@container pointer-events-none mt-6 select-none sm:mt-10">
          <p className="-mb-[0.1em] origin-bottom scale-y-[1.35] bg-linear-to-b from-transparent from-15% via-brand-foreground/[0.05] via-50% to-brand-foreground/[0.14] to-90% bg-clip-text text-center font-heading text-[8.4cqw] leading-[1.25] font-extrabold tracking-[-0.04em] whitespace-nowrap text-transparent">
            Saken&rsquo;s Pressure Washing
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-foreground/40">
          © <CopyrightYear /> Saken&apos;s Pressure Washing LLC. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
