// Decorative work should not compete with the full-screen brand introduction.
// The timeout also covers CSS-only dismissal if hydration is interrupted.
export function afterSiteIntro(start: () => void) {
  const intro = document.querySelector<HTMLElement>(".site-preloader");
  if (!intro || intro.dataset.phase === "leaving") {
    start();
    return () => {};
  }
  let started = false;
  const run = () => {
    if (started) return;
    started = true;
    start();
  };
  window.addEventListener("vectramind:intro-complete", run, { once: true });
  const fallback = window.setTimeout(run, 5300);
  return () => {
    window.removeEventListener("vectramind:intro-complete", run);
    window.clearTimeout(fallback);
  };
}
