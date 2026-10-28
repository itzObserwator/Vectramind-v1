import { chromium, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.env.PREVIEW_URL || "http://127.0.0.1:3001";
const output = "/tmp/vectramind-about";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
let release;
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.addInitScript(() =>
    localStorage.setItem("vectramind-notice", "dismissed"),
  );
  await page.goto(`${base}/about/`, { waitUntil: "networkidle" });
  await expect(page.locator("h1")).toHaveText("With youin mind.");
  await expect(page.locator("footer")).toHaveCount(1);
  await page.getByRole("link", { name: "Discover our story" }).click();
  await expect(page).toHaveURL(/#our-story$/);
  await expect(page.locator("#about-story-title")).toBeInViewport();
  const image = page.locator(".about-team-image img");
  await page.mouse.move(0, 0);
  await expect(image).toHaveCSS("filter", "none");
  await image.hover();
  await expect(image).toHaveCSS("filter", "none");
  await expect(image).toHaveAttribute("width", "3840");
  await expect(image).toHaveAttribute("height", "1459");
  await expect(image).toHaveCSS("object-fit", "contain");
  await expect(page.locator(".about-office-grid a")).toHaveCount(5);
  await expect(page.locator(".about-office").last()).toContainText("Vancouver");
  await expect(
    page.getByRole("link", { name: "Explore life at Vectramind", exact: true }),
  ).toHaveAttribute("href", /^\/careers\/?$/);

  for (const width of [320, 390, 768, 1440, 2560]) {
    await page.setViewportSize({ width, height: 1000 });
    const gallery = page.getByRole("region", {
      name: "Vectramind team photos",
    });
    await gallery.scrollIntoViewIfNeeded();
    await gallery.focus();
    await gallery.press("End");
    await expect(
      page.getByRole("button", { name: "Next team photo" }),
    ).toBeDisabled();
    await page.getByRole("button", { name: "Previous team photo" }).click();
    await expect(
      page.getByRole("button", { name: "Next team photo" }),
    ).toBeEnabled();
    await gallery.focus();
    await gallery.press("Home");
    await expect(
      page.getByRole("button", { name: "Previous team photo" }),
    ).toBeDisabled();
    await gallery.press("ArrowRight");
    await expect(
      page.getByRole("button", { name: "Previous team photo" }),
    ).toBeEnabled();
    await gallery.evaluate((element) =>
      element.scrollTo({ left: element.scrollWidth, behavior: "instant" }),
    );
    await expect(
      page.getByRole("button", { name: "Next team photo" }),
    ).toBeDisabled();
    await gallery.press("Home");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.evaluate(() => scrollTo(0, 0));
    await page.screenshot({
      path: `${output}/about-${width}.png`,
      fullPage: true,
    });
  }
  await page.close();

  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  mobile.on("pageerror", (error) => errors.push(error.message));
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  let blocked = 0;
  await mobile.route("**/about/**", async (route) => {
    const path = new URL(route.request().url()).pathname;
    if (
      !path.startsWith("/about/") ||
      route.request().method() === "HEAD" ||
      path.endsWith("/__next._tree.txt") ||
      path.endsWith("/__next.about.txt")
    )
      return route.continue();
    blocked++;
    await gate;
    await route.continue();
  });
  await mobile.goto(base, { waitUntil: "domcontentloaded" });
  const layout = mobile.waitForResponse(
    (response) =>
      new URL(response.url()).pathname === "/about/__next.about.txt",
  );
  await mobile.getByRole("button", { name: "Open menu" }).click();
  await layout;
  await mobile
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "About us", exact: true })
    .click();
  await expect(mobile.locator("#about-title")).toBeVisible({ timeout: 1000 });
  await expect(mobile).toHaveURL(/\/about\/?$/);
  await expect(
    mobile.locator(".product-landing-loading-content"),
  ).toBeVisible();
  expect(blocked).toBeGreaterThan(0);
  release();
  await expect(mobile.locator(".product-landing-loading-content")).toHaveCount(
    0,
  );
  const story = mobile.locator("#about-story-title");
  await story.scrollIntoViewIfNeeded();
  await expect(story).toHaveAttribute("data-scroll-reveal", "complete");
  await expect(story).toHaveCSS("opacity", "1");
  await mobile.goBack();
  await expect(mobile.locator(".experience-home h1")).toBeVisible();
  await mobile.goForward();
  await expect(mobile.locator("#about-title")).toBeVisible();
  expect(errors).toEqual([]);
  console.log(
    "Passed: story links, full-colour 4K team photography, five offices, gallery buttons/keyboard/swipe synchronization, 320–2560px layouts, reduced motion, prefetched mobile hero, loading-to-page scroll reveals and back/forward navigation. No browser errors.",
  );
} finally {
  release?.();
  await browser.close();
}
