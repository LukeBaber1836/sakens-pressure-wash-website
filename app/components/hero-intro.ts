// Timeline (in ms from when the page's scripts start) for the homepage intro, shared by the hero and
// the nav. The page holds white for half a second while everything settles, the video card fades in,
// then the copy fades up, the nav fades in, and the trust pill rises into the card's notch. Once
// everything has settled, a hand-drawn line underlines the phone number.
export const HERO_INTRO = {
  cardAt: 500,
  copyAt: 1000,
  navAt: 1150,
  pillAt: 1800,
  // Half a second after the pill has finished rising.
  underlineAt: 2900,
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
