"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, MotionConfig, useMotionValueEvent, useScroll } from "motion/react";
import { TbArrowUpRight } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SiteLogo } from "./site-logo";

const navLinks = [
  { label: "Services", href: "/#services" },
  { label: "Our work", href: "/#work" },
  { label: "Reviews", href: "/#reviews" },
  { label: "About", href: "/#about" },
];

// Scroll distance (px) before the logo and links merge into the floating pill.
const DETACH_AT = 48;

const spring = { type: "spring", bounce: 0.05, visualDuration: 0.4 } as const;

export function SiteNav() {
  const { scrollY } = useScroll();
  const [detached, setDetached] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setDetached(y > DETACH_AT));

  return (
    <MotionConfig transition={spring} reducedMotion="user">
      <motion.header layoutRoot className="pointer-events-none sticky top-0 z-40 h-20">
        <div
          className={cn(
            "site-container flex h-full items-center",
            detached ? "justify-center" : "justify-between"
          )}
        >
          <motion.div
            layout
            style={{ borderRadius: 32 }}
            className={cn(
              "pointer-events-auto relative flex items-center",
              detached ? "gap-6 py-2.5 pr-2.5 pl-6 sm:gap-10" : "w-full justify-between"
            )}
          >
            <motion.div
              layout
              aria-hidden="true"
              initial={false}
              animate={{ opacity: detached ? 1 : 0 }}
              style={{ borderRadius: 32 }}
              className="glass absolute inset-0 [--glass-opacity:0.82]"
            />

            <motion.div layout className="relative shrink-0">
              <Link href="/" aria-label="Saken's Pressure Washing home">
                {/* On phones the floating pill only has room for the shield beside the button. */}
                <SiteLogo
                  preload
                  className={detached ? "text-[15px] sm:text-[17px]" : "text-[17px] sm:text-[22px]"}
                  wordmarkClassName={cn(detached && "max-sm:hidden")}
                />
              </Link>
            </motion.div>

            <motion.nav layout aria-label="Main" className="relative flex items-center gap-1">
              <ul className="hidden items-center gap-1 md:flex">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Button variant="ghost" nativeButton={false} render={<Link href={link.href} />}>
                      {link.label}
                    </Button>
                  </li>
                ))}
              </ul>
              <Button
                variant="brand"
                nativeButton={false}
                render={<Link href="/contact" />}
                className={cn(detached && "rounded-full")}
              >
                Free estimate
                <TbArrowUpRight data-icon="inline-end" />
              </Button>
            </motion.nav>
          </motion.div>
        </div>
      </motion.header>
    </MotionConfig>
  );
}
