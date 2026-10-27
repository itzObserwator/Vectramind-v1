import { chromium, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.env.PREVIEW_URL || "http://127.0.0.1:3001";
const output = "/tmp/vectramind-synapse";
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
  await page.goto(`${base}/synapse/`, { waitUntil: "networkidle" });
  await expect(page.locator("h1")).toHaveText("Every message.More human.");
  await expect(page.locator(".synapse-brand")).toHaveAttribute(
    "src",
    "/images/synapse.svg",
  );
  await expect(page.locator(".hero-trail-pulse")).toHaveCount(16);
  await expect(page.locator(".post-hero-static-logos li")).toHaveCount(4);
  await expect(
    page.getByRole("link", { name: "Request a Synapse demo" }),
  ).toHaveAttribute("href", /^\/contact\/?\?topic=synapse$/);
  await expect(
    page.locator(".product-landing-workspace .platform-thumbnail-synapse"),
  ).toHaveCount(1);
  await page.getByRole("tab", { name: "WhatsApp", exact: true }).click();
  await expect(page.getByRole("tabpanel")).toContainText(
    "familiar customer messaging channel",
  );
  await page
    .getByRole("tab", { name: "WhatsApp", exact: true })
    .press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Email", exact: true }),
  ).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText(
    "email notifications and campaigns",
  );
  await page.getByRole("button", { name: "Next success story" }).click();
  await expect(page.locator(".case-story h3")).toContainText(
    "every transaction",
  );
  await page.getByRole("button", { name: "Previous success story" }).click();
  await expect(page.locator(".case-story h3")).toContainText("patient journey");
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
      .poll(() =>
        page.locator("h1").evaluate((element) => {
          const line = parseFloat(getComputedStyle(element).lineHeight);
          return element.getBoundingClientRect().height <= line * 2 + 2;
        }),
      )
      .toBe(true);
    await page.screenshot({
      path: `${output}/synapse-${width}.png`,
      fullPage: true,
    });
  }
  await page.close();

  // Hold every full route response. The separately prefetched layout must
  // update the URL and show the actual hero before the rest can arrive.
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
  const blocked = [];
  await mobile.route("**/synapse/**", async (route) => {
    const pathname = new URL(route.request().url()).pathname;
    if (
      !pathname.startsWith("/synapse/") ||
      route.request().method() === "HEAD" ||
      pathname.endsWith("/__next._tree.txt") ||
      pathname.endsWith("/__next.synapse.txt")
    )
      return route.continue();
    blocked.push(pathname);
    await gate;
    await route.continue();
  });
  await mobile.goto(base, { waitUntil: "domcontentloaded" });
  const layout = mobile.waitForResponse(
    (response) =>
      new URL(response.url()).pathname === "/synapse/__next.synapse.txt",
  );
  await mobile.getByRole("button", { name: "Open menu" }).click();
  await layout;
  const link = mobile
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Synapse", exact: true });
  await link.evaluate((element) =>
    element.addEventListener("click", () => performance.mark("synapse-tap"), {
      once: true,
      capture: true,
    }),
  );
  await link.click();
  await expect(mobile.locator("#synapse-title")).toBeVisible({ timeout: 1000 });
  const milliseconds = await mobile.evaluate(
    () =>
      performance.now() -
      performance.getEntriesByName("synapse-tap")[0].startTime,
  );
  expect(milliseconds).toBeLessThan(750);
  await expect(mobile).toHaveURL(/\/synapse\/?$/);
  await expect(
    mobile.locator(".product-landing-loading-content"),
  ).toBeVisible();
  await expect(mobile.locator("#synapse-overview-title")).toHaveCount(0);
  expect(blocked.length).toBeGreaterThan(0);
  release();
  await expect(mobile.locator("#synapse-overview-title")).toHaveCount(1);
  await expect(mobile.locator(".product-landing-loading-content")).toHaveCount(
    0,
  );
  const overview = mobile.locator("#synapse-overview-title");
  await overview.scrollIntoViewIfNeeded();
  await expect(overview).toHaveAttribute("data-scroll-reveal", "complete");
  await expect(overview).toHaveCSS("opacity", "1");
  await mobile.goBack();
  await expect(mobile.locator(".experience-home h1")).toBeVisible();
  await mobile.goForward();
  await expect(mobile.locator("#synapse-title")).toBeVisible();
  await expect(mobile.locator("h1")).toHaveCount(1);
  expect(errors).toEqual([]);
  console.log(
    `Passed: shared landing components, original branding, channel keyboard controls, stories, FAQs, 320–2560px bounds, two-line mobile heading, reduced motion and loading-to-page reveals. Synapse hero and URL updated ${Math.round(milliseconds)}ms after tap while page data was held. Back/forward navigation passed; no browser errors.`,
  );
} finally {
  release?.();
  await browser.close();
}
