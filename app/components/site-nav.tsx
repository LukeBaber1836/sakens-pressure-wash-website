"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { TbArrowUpRight, TbMenu2, TbX } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FreshOnShow } from "./fresh-on-show";
import { HERO_INTRO, shouldPlayHeroIntro } from "./hero-intro";
import { SiteLogo } from "./site-logo";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Our work", href: "/work" },
  { label: "Reviews", href: "/reviews" },
  { label: "About", href: "/about" },
];

// Scroll distance (px) before the logo and links merge into the floating pill.
const DETACH_AT = 48;

// Lifts the floating pill and the phone menu off the page.
const floatShadow = "shadow-[0_8px_32px_rgb(1_20_45/0.22)]";

// A scroll this far (px) in one event is a jump, not someone scrolling.
const SCROLL_JUMP = 300;

const spring = { type: "spring", bounce: 0.05, visualDuration: 0.4 } as const;

const fade = { closed: { opacity: 0 }, open: { opacity: 1 } };

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
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

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

  // Close the phone menu on any click outside the nav, on Escape, or once the full links show at lg.
  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    const onPointerDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) close();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const desktop = window.matchMedia("(min-width: 64rem)");
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", close);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", close);
    };
  }, [menuOpen]);

  return (
    <MotionConfig
      transition={instant ? { duration: 0 } : spring}
      reducedMotion="user"
    >
      <motion.header
        ref={headerRef}
        layoutRoot
        className={cn(
          "pointer-events-none sticky top-0 z-40 h-20 transition-opacity duration-500 ease-out",
          !shown && "opacity-0",
        )}
      >
        <div
          className={cn(
            "site-container relative flex h-full items-center",
            detached ? "justify-center" : "justify-between",
          )}
        >
          <motion.div
            layout
            style={{ borderRadius: 32 }}
            className={cn(
              "pointer-events-auto relative flex items-center",
              detached
                ? "gap-6 py-2.5 pr-2.5 pl-6 max-lg:w-full max-lg:justify-between sm:gap-10"
                : "w-full justify-between",
            )}
          >
            <motion.div
              layout
              aria-hidden="true"
              initial={false}
              animate={{ opacity: detached || menuOpen ? 1 : 0 }}
              style={{ borderRadius: 32 }}
              // Solid white for contrast. At the top of the page, where it only shows behind the open
              // phone menu, it stays flat: the shadow is for the floating pill. Below lg the pill is
              // full width either way, so the bar reaches out to the screen edges until it detaches,
              // giving it room to shrink into the pill as it fades in, as it does on desktop.
              className={cn(
                "absolute inset-0 bg-white transition-shadow duration-300",
                detached
                  ? floatShadow
                  : "max-lg:-inset-x-4 sm:max-lg:-inset-x-6",
              )}
            />

            <motion.div layout className="relative shrink-0">
              <Link href="/" aria-label="Saken's Pressure Washing home">
                <SiteLogo
                  preload
                  className={
                    detached
                      ? "text-[15px] sm:text-[17px]"
                      : "text-[17px] sm:text-[22px]"
                  }
                />
              </Link>
            </motion.div>

            <motion.nav
              layout
              aria-label="Main"
              className="relative flex items-center gap-1"
            >
              <ul className="hidden items-center gap-1 lg:flex">
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
                className={cn("max-lg:hidden", detached && "rounded-full")}
              >
                Free estimate
                <TbArrowUpRight data-icon="inline-end" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                aria-controls="site-menu"
                onClick={() => setMenuOpen((open) => !open)}
                className="size-12 rounded-full lg:hidden [&_svg:not([class*='size-'])]:size-7"
              >
                {menuOpen ? <TbX /> : <TbMenu2 />}
              </Button>
            </motion.nav>
          </motion.div>

          {/* Phone menu. It sits outside the pill so the pill's layout animations don't stretch it. */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                id="site-menu"
                initial="closed"
                animate="open"
                exit="closed"
                className="pointer-events-auto absolute inset-x-4 top-full rounded-[28px] p-3 lg:hidden"
              >
                <motion.div
                  aria-hidden="true"
                  variants={fade}
                  transition={spring}
                  className={cn(
                    "absolute inset-0 rounded-[inherit] bg-white",
                    floatShadow,
                  )}
                />
                <motion.div
                  variants={fade}
                  transition={spring}
                  className="relative"
                >
                  <ul className="flex flex-col">
                    {navLinks.map((link) => (
                      <li key={link.href}>
                        <Button
                          variant="ghost"
                          size="lg"
                          nativeButton={false}
                          render={<Link href={link.href} />}
                          onClick={() => setMenuOpen(false)}
                          className="w-full justify-start px-4"
                        >
                          {link.label}
                        </Button>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant="brand"
                    size="lg"
                    nativeButton={false}
                    render={<Link href="/contact" />}
                    onClick={() => setMenuOpen(false)}
                    className="mt-2 w-full rounded-full"
                  >
                    Book a free estimate
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
    </MotionConfig>
  );
}
