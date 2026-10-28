import { chromium, expect } from "@playwright/test";
// Fonts are deliberately stalled while capturing the loader.
process.env.PW_TEST_SCREENSHOT_NO_FONTS_READY = "1";
const base = process.env.PREVIEW_URL || "http://127.0.0.1:3001";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    let release;
    const gate = new Promise((resolve) => (release = resolve));
    await page.route("**/fonts/**", async (route) => {
      await gate;
      await route.continue();
    });
    await page.addInitScript(() => {
      window.__preloaderTimes = {};
      const observer = new MutationObserver(() => {
        const loader = document.querySelector(".site-preloader");
        if (loader && !window.__preloaderTimes.start)
          window.__preloaderTimes.start = performance.now();
        if (loader?.getAttribute("data-phase") === "leaving")
          window.__preloaderTimes.leaving ??= performance.now();
      });
      observer.observe(document, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["data-phase"],
      });
    });
    await page.goto(base, { waitUntil: "domcontentloaded" });
    const loader = page.getByRole("status", { name: "Loading Vectramind" });
    await expect(loader).toBeVisible();
    await expect(page.locator(".hero-energy")).toHaveAttribute(
      "data-active",
      "false",
    );
    await expect(loader.locator("img")).toHaveAttribute(
      "src",
      "/images/vectramind-logo.svg",
    );
    await expect(loader.locator(".preloader-pulse")).toHaveCount(8);
    await expect(loader.locator(".preloader-pulse").first()).toHaveCSS(
      "animation-name",
      "preloader-connect",
    );
    await expect
      .poll(() =>
        loader
          .locator("img")
          .evaluate((img) => img.complete && img.naturalWidth > 0),
      )
      .toBe(true);
    await expect(loader.locator(".preloader-pulse").first()).toHaveCSS(
      "animation-duration",
      "3.2s",
    );
    expect(
      await loader
        .locator("[data-origin]")
        .evaluateAll((nodes) =>
          nodes.map((el) => el.getAttribute("data-origin")),
        ),
    ).toEqual([
      "left",
      "right",
      "left",
      "right",
      "left",
      "right",
      "left",
      "right",
    ]);
    expect(
      await loader.locator(".preloader-rail").evaluateAll((paths) =>
        paths.every((path) => {
          const end = path.getPointAtLength(path.getTotalLength());
          return Math.abs(end.x - 400) < 0.1 && Math.abs(end.y - 160) < 0.1;
        }),
      ),
    ).toBe(true);
    await page.screenshot({ path: `/tmp/vectramind-preloader-${width}.png` });
    const remaining = await page.evaluate(() =>
      Math.max(0, 4000 - (performance.now() - window.__preloaderTimes.start)),
    );
    await page.waitForTimeout(remaining);
    await expect(loader).toBeVisible();
    release();
    await expect(loader).toHaveCount(0, { timeout: 7000 });
    await expect(page.locator(".hero-energy")).toHaveAttribute(
      "data-active",
      "true",
    );
    const timing = await page.evaluate(
      () => window.__preloaderTimes.leaving - window.__preloaderTimes.start,
    );
    expect(timing).toBeGreaterThanOrEqual(4900);
    expect(timing).toBeLessThan(6000);
    await expect(page.locator(".experience-home h1")).toBeVisible();
    if (width <= 900)
      await page.getByRole("button", { name: "Open menu" }).click();
    await page
      .getByRole("navigation", {
        name: width <= 900 ? "Mobile navigation" : "Main navigation",
      })
      .getByRole("link", { name: "Support", exact: true })
      .click();
    await expect(page.locator("#support-title")).toBeVisible();
    await expect(loader).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.close();
    console.log(
      `${width}px: logo, original compact curves with slower inward pulses, five-second hold, automatic reveal and no preloader replay on navigation passed`,
    );
  }
  const reduced = await browser.newPage({ reducedMotion: "reduce" });
  let release;
  const gate = new Promise((resolve) => (release = resolve));
  await reduced.route("**/fonts/**", async (route) => {
    await gate;
    await route.continue();
  });
  await reduced.goto(base, { waitUntil: "domcontentloaded" });
  const loader = reduced.locator(".site-preloader");
  await expect(loader).toBeVisible();
  await expect(loader.locator(".preloader-pulse").first()).toHaveCSS(
    "animation-name",
    "none",
  );
  await reduced.keyboard.press("Tab");
  await expect(loader).toHaveCount(0);
  release();
  await reduced.close();
  console.log(
    "Reduced motion disables pulses; keyboard navigation dismisses the preloader immediately.",
  );
  const stalled = await browser.newPage();
  let unblock;
  const stalledGate = new Promise((resolve) => (unblock = resolve));
  await stalled.route("**/fonts/**", async (route) => {
    await stalledGate;
    await route.continue();
  });
  await stalled.goto(base, { waitUntil: "domcontentloaded" });
  await expect(stalled.locator(".site-preloader")).toHaveCount(0, {
    timeout: 7000,
  });
  unblock();
  await stalled.close();
  console.log("Stalled assets cannot leave the preloader stuck.");
  const noJS = await browser.newPage({ javaScriptEnabled: false });
  await noJS.goto(base, { waitUntil: "domcontentloaded" });
  await expect(noJS.locator(".site-preloader")).toBeHidden({ timeout: 6500 });
  await expect(noJS.locator("h1")).toBeVisible();
  console.log("CSS failsafe exposes the page without JavaScript.");
} finally {
  await browser.close();
}
