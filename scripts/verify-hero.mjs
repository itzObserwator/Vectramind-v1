import { chromium, expect } from "@playwright/test";
import sharp from "sharp";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const base = process.env.PREVIEW_URL || "http://127.0.0.1:3000";
async function pixels(page) {
  return sharp(await page.screenshot())
    .removeAlpha()
    .raw()
    .toBuffer();
}
function difference(a, b) {
  let changed = 0;
  for (let i = 0; i < a.length; i += 3)
    if (
      Math.abs(a[i] - b[i]) +
        Math.abs(a[i + 1] - b[i + 1]) +
        Math.abs(a[i + 2] - b[i + 2]) >
      4
    )
      changed++;
  return changed / (a.length / 3);
}
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto(base, { waitUntil: "networkidle" });
  // Measure the hero itself rather than the five-second preloader above it.
  await page.keyboard.press("Escape");
  const trails = page.locator(".hero-energy .hero-ribbon-main");
  await expect(trails).toHaveCount(1);
  await expect(page.locator(".hero-energy canvas")).toHaveCount(0);
  await expect(trails.locator(".hero-trail-pulse")).toHaveCount(16);
  await page.waitForTimeout(1800);
  const first = await pixels(page);
  await page.waitForTimeout(1100);
  const second = await pixels(page);
  expect(
    difference(first, second),
    "Faster logo-color pulses should move visibly",
  ).toBeGreaterThan(0.001);
  await page.evaluate(() => scrollTo(0, 1500));
  await expect(page.locator(".hero-energy")).toHaveAttribute(
    "data-active",
    "false",
  );
  expect(
    await page
      .locator(".hero-ribbon-main")
      .evaluate((element) =>
        element
          .getAnimations({ subtree: true })
          .every((animation) => animation.playState === "paused"),
      ),
    "Hero pulses must stop consuming animation work outside the viewport",
  ).toBe(true);
  await page.evaluate(() => scrollTo(0, 0));
  await expect(page.locator(".hero-energy")).toHaveAttribute(
    "data-active",
    "true",
  );
  await page.getByRole("button", { name: "Let’s build what’s next" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  for (const width of [2560, 1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width < 800 ? 844 : 1000 });
    await page.waitForTimeout(250);
    const hero = await page.locator(".experience-hero").boundingBox();
    const actions = await page
      .locator(".experience-hero-actions")
      .boundingBox();
    const title = await page.locator("h1").boundingBox();
    expect(title.y).toBeGreaterThan(hero.y + 100);
    const description = await page
      .locator(".experience-hero-description")
      .boundingBox();
    expect(actions.y).toBeGreaterThanOrEqual(
      description.y + description.height,
    );
    expect(title.y + title.height).toBeLessThan(actions.y);
    expect(actions.x).toBeGreaterThanOrEqual(0);
    expect(actions.x + actions.width).toBeLessThanOrEqual(width);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".hero-energy")).toHaveAttribute(
    "data-active",
    "false",
  );
  await page.waitForTimeout(800);
  const frozen = await pixels(page);
  await page.waitForTimeout(600);
  expect(
    difference(frozen, await pixels(page)),
    "Reduced motion must freeze trail pulses",
  ).toBe(0);
  await expect(
    page.getByRole("link", { name: "Explore our platforms" }),
  ).toHaveAttribute("href", "#products");
  expect(errors).toEqual([]);
  console.log(
    "Passed: fast logo-color pulses and fixed screenshot ribbons, fixed reference framing at 320–2560px, consultation action, platform anchor, static reduced motion, and no browser/shader errors.",
  );
} finally {
  await browser.close();
}
