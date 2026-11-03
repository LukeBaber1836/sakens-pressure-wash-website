"use client";

import posthog from "posthog-js";
import { TbBrandFacebook, TbBrandLinkedin } from "react-icons/tb";

const socials = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/saken-sawyer-497636394/",
    Icon: TbBrandLinkedin,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61558036448070",
    Icon: TbBrandFacebook,
  },
];

/** Saken's social profiles. Each opens in a new tab and reports the click to PostHog. */
export function SocialLinks() {
  return (
    <ul className="flex gap-2">
      {socials.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener"
            aria-label={`Saken's Pressure Washing on ${label} (opens in a new tab)`}
            onClick={() =>
              posthog.capture("social_profile_clicked", { platform: label.toLowerCase() })
            }
            className="grid size-10 place-items-center rounded-full text-brand-foreground/70 ring-1 ring-brand-foreground/15 transition-colors outline-none hover:bg-tint hover:text-brand-foreground focus-visible:ring-2 focus-visible:ring-brand"
          >
            <Icon className="size-5" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}
