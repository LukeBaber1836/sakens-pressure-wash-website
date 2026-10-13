// Timeline (in ms from first paint) for the homepage intro, shared by the hero and the nav. The card
// sits in its frame from the start; the copy fades up, the nav fades in, then the trust pill rises into
// the card's notch. Everything settles by about 1.5s.
export const HERO_INTRO = {
  copyAt: 150,
  navAt: 300,
  pillAt: 450,
};

/**
 * Whether to play the intro. It's skipped when motion is reduced, or when the page opens scrolled
 * away from the hero (a reload partway down), where there'd be nothing to see it play on.
 */
export function shouldPlayHeroIntro() {
  return (
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    window.scrollY === 0
  );
}
