import { chromium, expect } from "@playwright/test";
const base = process.env.PREVIEW_URL || "http://127.0.0.1:3001";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  for (const [width, height] of [
    [1440, 1000],
    [2560, 1100],
    [1024, 768],
    [390, 844],
  ]) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.addInitScript(() =>
      localStorage.setItem("vectramind-notice", "dismissed"),
    );
    await page.goto(base, { waitUntil: "networkidle" });
    const section = page.locator("#products");
    const check = async () => {
      if (width > 900)
        await expect
          .poll(() =>
            section.evaluate((el) => {
              const start = el.getBoundingClientRect().top + scrollY;
              return Math.round(
                ((scrollY - start) / (el.offsetHeight - innerHeight)) * 100,
              );
            }),
          )
          .toBe(95);
      for (const title of await section.locator("h3").all())
        await expect(title).toHaveCSS("opacity", "1");
      for (const image of await section.locator(".platform-image-link").all())
        await expect
          .poll(() =>
            image.evaluate((el) => {
              const clip = getComputedStyle(el).clipPath;
              return (
                clip === "none" || parseFloat(clip.match(/[\d.]+/)[0]) === 0
              );
            }),
          )
          .toBe(true);
      for (const cta of await section.locator(".platform-card-cta").all())
        await expect
          .poll(() =>
            cta.evaluate((el) => {
              const s = getComputedStyle(el);
              return (
                s.opacity === "1" &&
                (s.clipPath === "none" ||
                  parseFloat(s.clipPath.match(/[\d.]+/)[0]) === 0)
              );
            }),
          )
          .toBe(true);
      const bounds = await section
        .locator(".platform-image-link")
        .first()
        .boundingBox();
      expect(bounds.y).toBeGreaterThanOrEqual(0);
      expect(bounds.y).toBeLessThan(height - 100);
      if (width > 900)
        for (const title of await section.locator("h3").all()) {
          const b = await title.boundingBox();
          expect(b.y).toBeGreaterThan(0);
          expect(b.y + b.height).toBeLessThan(height);
        }
      await expect(page).toHaveURL(/#products$/);
    };
    await page
      .getByRole("link", { name: "Explore our platforms", exact: true })
      .click();
    await check();
    await page.screenshot({
      path: `/tmp/vectramind-platform-anchor-${width}.png`,
    });
    // Return through the scroll engine like a user, rather than teleporting
    // the browser independently of Lenis's animated scroll position.
    await page.mouse.wheel(0, -50000);
    await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
    const link = page.getByRole("link", {
      name: "Explore our platforms",
      exact: true,
    });
    await link.focus();
    await link.press("Enter");
    await check();
    expect(errors).toEqual([]);
    await page.close();
    console.log(
      `${width}px: cold click and repeat keyboard navigation reveal platform images, text and CTAs at the destination`,
    );
  }
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  await page.goto(base, { waitUntil: "networkidle" });
  await page
    .getByRole("link", { name: "Explore our platforms", exact: true })
    .click();
  await expect(page.locator("#products .platforms-sticky")).toHaveCSS(
    "position",
    "relative",
  );
  await expect(
    page.locator("#products .platform-image-link").first(),
  ).toHaveCSS("clip-path", "none");
  await expect(
    page.locator("#products .platform-image-link").first(),
  ).toBeInViewport();
  console.log("Reduced motion keeps the normal readable section destination.");
} finally {
  await browser.close();
}
