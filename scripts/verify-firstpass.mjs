import { chromium, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.env.PREVIEW_URL || "http://127.0.0.1:3001";
const output = "/tmp/vectramind-firstpass";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
let release;
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.addInitScript(() =>
    localStorage.setItem("vectramind-notice", "dismissed"),
  );
  await page.goto(`${base}/firstpass/`, { waitUntil: "networkidle" });
  await expect(page.locator("h1")).toHaveText("Your care.Connected.");
  await expect(page.locator(".firstpass-brand")).toHaveAttribute(
    "src",
    "/images/firstpass.svg",
  );
  await expect(page.locator(".hero-trail-pulse")).toHaveCount(16);
  await expect(page.locator(".post-hero-static-logos li")).toHaveCount(4);
  await expect(
    page.locator(".firstpass-workspace .platform-thumbnail-firstpass"),
  ).toHaveCount(1);
  await expect(page.locator(".firstpass-pillars article")).toHaveCount(4);
  await expect(page.getByRole("tab")).toHaveCount(9);
  await expect(
    page.getByRole("link", { name: "Request a Firstpass demo" }),
  ).toHaveAttribute("href", /^\/support\/?\?topic=firstpass#contact-form$/);
  await page
    .getByRole("link", { name: "Explore the platform", exact: true })
    .click();
  await expect(page).toHaveURL(/#firstpass-modules$/);
  await page.getByRole("tab", { name: "fp engage", exact: true }).click();
  await expect(page.getByRole("tabpanel")).toContainText(
    "Patient communications",
  );
  await page
    .getByRole("tab", { name: "fp engage", exact: true })
    .press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "fp livecast", exact: true }),
  ).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText(
    "Real-time governance",
  );
  await page
    .getByRole("tab", { name: "fp livecast", exact: true })
    .press("End");
  await expect(page.getByRole("tabpanel")).toContainText("fp escalate");
  const faq = page.locator(".faq-list details").first();
  await faq.locator("summary").click();
  await expect(faq).toHaveAttribute("open", "");
  await expect(faq.locator("p")).toHaveCSS("opacity", "1");
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 768, 1440, 2560]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(() => scrollTo(0, 0));
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect
      .poll(async () =>
        page.locator("h1").evaluate((element) => {
          const style = getComputedStyle(element);
          return (
            element.getBoundingClientRect().height <=
            parseFloat(style.lineHeight) * 2 + 2
          );
        }),
      )
      .toBe(true);
    await page.screenshot({
      path: `${output}/firstpass-${width}.png`,
      fullPage: true,
    });
  }
  await page.close();

  // A prefetched hero must appear even while the full page response is delayed.
  const mobile = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  mobile.on("pageerror", (error) => errors.push(error.message));
  mobile.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  let blocked = 0;
  await mobile.route("**/firstpass/**", async (route) => {
    const pathname = new URL(route.request().url()).pathname;
    if (
      !pathname.startsWith("/firstpass/") ||
      route.request().method() === "HEAD" ||
      pathname.endsWith("/__next._tree.txt") ||
      pathname.endsWith("/__next.firstpass.txt")
    )
      return route.continue();
    blocked++;
    await gate;
    await route.continue();
  });
  await mobile.goto(base, { waitUntil: "domcontentloaded" });
  const layout = mobile.waitForResponse(
    (response) =>
      new URL(response.url()).pathname === "/firstpass/__next.firstpass.txt",
  );
  await mobile.getByRole("button", { name: "Open menu" }).click();
  await layout;
  await mobile
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Firstpass", exact: true })
    .click();
  await expect(mobile.locator("#firstpass-title")).toBeVisible({
    timeout: 1000,
  });
  await expect(mobile).toHaveURL(/\/firstpass\/?$/);
  await expect(
    mobile.locator(".product-landing-loading-content"),
  ).toBeVisible();
  expect(blocked).toBeGreaterThan(0);
  release();
  const overview = mobile.locator("#firstpass-overview-title");
  await expect(overview).toHaveCount(1);
  await expect(mobile.locator(".product-landing-loading-content")).toHaveCount(
    0,
  );
  await overview.scrollIntoViewIfNeeded();
  await expect(overview).toHaveAttribute("data-scroll-reveal", "complete");
  await expect(overview).toHaveCSS("opacity", "1");
  await mobile.goBack();
  await expect(mobile.locator(".experience-home h1")).toBeVisible();
  await mobile.goForward();
  await expect(mobile.locator("#firstpass-title")).toBeVisible();
  await expect(mobile.locator("h1")).toHaveCount(1);
  expect(errors).toEqual([]);
  console.log(
    "Passed: shared landing components, original branding, four care pillars, nine modules with keyboard controls, FAQs, 320–2560px layouts, reduced motion, prefetched mobile navigation under a held response, scroll reveals and back/forward navigation. No browser errors.",
  );
} finally {
  release?.();
  await browser.close();
}
