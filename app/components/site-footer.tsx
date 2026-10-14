import Link from "next/link";
import { cacheLife } from "next/cache";
import {
  TbArrowUpRight,
  TbBrandFacebook,
  TbBrandInstagram,
  TbBrandLinkedin,
  TbBrandYoutube,
} from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { SiteLogo } from "./site-logo";

const linkGroups = [
  {
    title: "Pages",
    links: [
      { label: "All services", href: "/services" },
      { label: "Our work", href: "/work" },
      { label: "Reviews", href: "/reviews" },
      { label: "About", href: "/about" },
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

// Profile URLs still to come; swap each "#" for the real page.
const socials = [
  { label: "LinkedIn", href: "#", Icon: TbBrandLinkedin },
  { label: "Facebook", href: "#", Icon: TbBrandFacebook },
  { label: "Instagram", href: "#", Icon: TbBrandInstagram },
  { label: "YouTube", href: "#", Icon: TbBrandYoutube },
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
          <div className="flex flex-col gap-5">
            <Link href="/" aria-label="Saken's Pressure Washing home" className="w-fit">
              <SiteLogo className="text-[22px]" />
            </Link>
            <ul className="flex gap-2">
              {socials.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    aria-label={`Saken's Pressure Washing on ${label}`}
                    className="grid size-10 place-items-center rounded-full text-brand-foreground/70 ring-1 ring-brand-foreground/15 transition-colors outline-none hover:bg-tint hover:text-brand-foreground focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

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

        <p className="mt-12 text-center sm:mt-16 text-sm text-foreground/40">
          © <CopyrightYear /> Saken&apos;s Pressure Washing LLC. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
