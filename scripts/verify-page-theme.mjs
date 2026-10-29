import { chromium, expect } from "@playwright/test";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const base = process.env.PREVIEW_URL || "http://127.0.0.1:3001";
const routes = [
  "synapse",
  "firstpass",
  "capabilities",
  "about",
  "careers",
  "support",
  "blog",
  "privacy-policy",
  "terms-of-use",
];
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() =>
    localStorage.setItem("vectramind-notice", "dismissed"),
  );
  for (const route of routes) {
    console.log("Checking page theme:", route);
    await page.goto(`${base}/${route}/`, { waitUntil: "networkidle" });
    await expect(page.locator(".inner-page")).toHaveCSS(
      "background-color",
      "rgb(250, 250, 250)",
    );
    await page
      .locator('[data-scroll-reveal="pending"]')
      .first()
      .evaluate((e) => e.setAttribute("data-theme-test-target", "true"));
    const target = page.locator('[data-theme-test-target="true"]');
    await expect(target).toHaveCSS("opacity", "0");
    await target.evaluate((e) =>
      scrollTo(0, e.getBoundingClientRect().top + scrollY - 200),
    );
    await expect(target).toHaveAttribute("data-scroll-reveal", "complete");
    await expect(target).toHaveCSS("opacity", "1");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator('[data-scroll-reveal="pending"]')).toHaveCount(0);
    await expect(page.locator(".inner-hero-art")).toHaveCSS("opacity", "1");
    await page.emulateMedia({ reducedMotion: "no-preference" });
  }
  for (const width of [320, 768, 1024, 2560]) {
    await page.setViewportSize({ width, height: width < 800 ? 844 : 1000 });
    for (const route of width === 320
      ? routes
      : ["synapse", "about", "support", "capabilities"]) {
      await page.goto(`${base}/${route}/`, { waitUntil: "networkidle" });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${route} ${width}`,
      ).toBe(true);
      const hero = await page.locator(".inner-hero-grid").boundingBox();
      expect(hero.x).toBeCloseTo(
        width <= 700 ? 22 : Math.min(110, Math.max(24, width * 0.055)),
        0,
      );
      const h1 = await page.locator("h1").boundingBox();
      expect(h1.x + h1.width).toBeLessThanOrEqual(width - 20);
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(
    `${base}/blog/the-patient-journey-that-isn-t-a-journey-at-all/`,
    { waitUntil: "networkidle" },
  );
  await page
    .locator('.article-body [data-scroll-reveal="pending"]')
    .first()
    .evaluate((e) => e.setAttribute("data-theme-test-paragraph", "true"));
  const paragraph = page.locator('[data-theme-test-paragraph="true"]');
  await paragraph.evaluate((e) =>
    scrollTo(0, e.getBoundingClientRect().top + scrollY - 200),
  );
  await expect(paragraph).toHaveAttribute("data-scroll-reveal", "complete");
  await page.goto(`${base}/blog/`, { waitUntil: "networkidle" });
  await page
    .getByRole("combobox", { name: "Filter insights by topic" })
    .selectOption("AI");
  const filtered = page.locator(".insights-grid article");
  await filtered.scrollIntoViewIfNeeded();
  await expect(filtered).toHaveCSS("opacity", "1");
  await page.goto(`${base}/a-page-that-does-not-exist/`, {
    waitUntil: "networkidle",
  });
  await expect(
    page.getByRole("link", { name: "Back to Vectramind" }),
  ).toHaveAttribute("href", "/");
  expect(errors).toEqual([]);
  console.log(
    "Passed: all inner-page palette/gutters, scroll-triggered reveals, live reduced-motion cleanup, filtered-card reveals, article reveals, 320–2560px bounds and 404 navigation.",
  );
} finally {
  await browser.close();
}
