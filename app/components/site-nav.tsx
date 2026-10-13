"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import Link from "next/link";
import {
  motion,
  MotionConfig,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { TbArrowUpRight } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FreshOnShow } from "./fresh-on-show";
import { HERO_INTRO, shouldPlayHeroIntro } from "./hero-intro";
import { SiteLogo } from "./site-logo";

const navLinks = [
  { label: "Services", href: "/#services" },
  { label: "Our work", href: "/work" },
  { label: "Reviews", href: "/#reviews" },
  { label: "About", href: "/about" },
];

// Scroll distance (px) before the logo and links merge into the floating pill.
const DETACH_AT = 48;

// A scroll this far (px) in one event is a jump, not someone scrolling.
const SCROLL_JUMP = 300;

const spring = { type: "spring", bounce: 0.05, visualDuration: 0.4 } as const;

/**
 * `intro` holds the nav back until its cue in the homepage hero's opening animation. The nav starts
 * fresh whenever its page is shown again, so it never animates out of the shape it was left in.
 */
export function SiteNav({ intro = false }: { intro?: boolean }) {
  return (
    <FreshOnShow>
      <NavBar intro={intro} />
    </FreshOnShow>
  );
}

function NavBar({ intro }: { intro: boolean }) {
  const { scrollY } = useScroll();
  const [detached, setDetached] = useState(false);
  // Snap rather than animate when the page lands somewhere new: on mount, and on scroll jumps like the
  // browser restoring a position. Only ordinary scrolling morphs the bar into the pill.
  const [instant, setInstant] = useState(true);
  const [shown, setShown] = useState(!intro);

  // Match the page's scroll position before the first paint. It can't be read during render, as the
  // server always renders the bar at the top of the page.
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDetached(window.scrollY > DETACH_AT);
  }, []);

  useMotionValueEvent(scrollY, "change", (y) => {
    setInstant(Math.abs(y - scrollY.getPrevious()!) > SCROLL_JUMP);
    setDetached(y > DETACH_AT);
  });

  useEffect(() => {
    if (!intro) return;
    const timer = setTimeout(
      () => setShown(true),
      shouldPlayHeroIntro() ? HERO_INTRO.navAt : 0,
    );
    return () => clearTimeout(timer);
  }, [intro]);

  return (
    <MotionConfig
      transition={instant ? { duration: 0 } : spring}
      reducedMotion="user"
    >
      <motion.header
        layoutRoot
        className={cn(
          "pointer-events-none sticky top-0 z-40 h-20 transition-opacity duration-500 ease-out",
          !shown && "opacity-0",
        )}
      >
        <div
          className={cn(
            "site-container flex h-full items-center",
            detached ? "justify-center" : "justify-between",
          )}
        >
          <motion.div
            layout
            style={{ borderRadius: 32 }}
            className={cn(
              "pointer-events-auto relative flex items-center",
              detached
                ? "gap-6 py-2.5 pr-2.5 pl-6 sm:gap-10"
                : "w-full justify-between",
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
                  className={
                    detached
                      ? "text-[15px] sm:text-[17px]"
                      : "text-[17px] sm:text-[22px]"
                  }
                  wordmarkClassName={cn(detached && "max-sm:hidden")}
                />
              </Link>
            </motion.div>

            <motion.nav
              layout
              aria-label="Main"
              className="relative flex items-center gap-1"
            >
              <ul className="hidden items-center gap-1 md:flex">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Button
                      variant="ghost"
                      nativeButton={false}
                      render={<Link href={link.href} />}
                    >
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
