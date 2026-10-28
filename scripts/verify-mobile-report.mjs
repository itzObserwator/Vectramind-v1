import { chromium, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.env.PREVIEW_URL || "http://127.0.0.1:3001";
const output = "/tmp/vectramind-mobile-report";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
try {
  for (const [width, height] of [
    [320, 568],
    [360, 640],
    [390, 844],
    [430, 932],
    [768, 1024],
    [844, 390],
  ]) {
    const page = await browser.newPage({
      viewport: { width, height },
      isMobile: true,
      hasTouch: true,
    });
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.addInitScript(() =>
      localStorage.setItem("vectramind-notice", "dismissed"),
    );
    await page.goto(base, { waitUntil: "networkidle" });
    await page.keyboard.press("Escape");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(page.locator(".hero-trail-pulse")).toHaveCount(16);
    await expect(page.locator(".hero-energy canvas")).toHaveCount(0);
    for (const asset of ["hero-ribbon-base.svg", "hero-ribbon-underlay.svg"]) {
      const response = await page.request.get(`${base}/images/${asset}`);
      expect(response.ok()).toBe(true);
      expect(await response.text()).toContain("<svg");
    }
    await page.screenshot({ path: `${output}/hero-${width}x${height}.png` });

    const toggle = page.getByRole("button", { name: "Open menu" });
    const size = await toggle.boundingBox();
    expect(size.width).toBeGreaterThanOrEqual(44);
    expect(size.height).toBeGreaterThanOrEqual(44);
    // Exercise the fixed header as well as the initial header.
    await page.evaluate(() => scrollTo(0, 300));
    await expect(page.locator(".header")).toHaveClass(/header-scrolled/);
    const position = await page.evaluate(() => scrollY);
    await toggle.click();
    const menu = page.getByRole("navigation", { name: "Mobile navigation" });
    await expect(menu).toHaveCSS("opacity", "1");
    await expect(page.locator(".floating-contact")).toHaveCSS(
      "visibility",
      "hidden",
    );
    await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
    await expect(menu.getByRole("link").first()).toBeFocused();
    expect(
      Math.abs((await page.evaluate(() => scrollY)) - position),
    ).toBeLessThan(2);
    const bounds = await menu.boundingBox();
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(height);
    await page.mouse.move(width / 2, height - 10);
    await page.mouse.wheel(0, 450);
    await page.waitForTimeout(200);
    expect(
      Math.abs((await page.evaluate(() => scrollY)) - position),
    ).toBeLessThan(2);
    const last = menu.getByRole("button", { name: "Consultation", exact: true });
    await last.focus();
    await page.keyboard.press("Tab");
    await expect(
      page.getByRole("button", { name: "Close menu" }),
    ).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(last).toBeFocused();
    await page.screenshot({ path: `${output}/menu-${width}x${height}.png` });
    await page.keyboard.press("Escape");
    await expect(menu).not.toBeVisible();
    await expect(page.locator(".floating-contact")).toHaveCSS(
      "visibility",
      "visible",
    );
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");

    await page.getByRole("button", { name: "Open menu" }).click();
    await page
      .getByRole("button", { name: "Consultation", exact: true })
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(menu).not.toBeVisible();
    expect(
      await page
        .getByRole("dialog")
        .evaluate((element) => element.contains(document.activeElement)),
    ).toBe(true);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).not.toBeVisible();
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");

    await page.getByRole("button", { name: "Open menu" }).click();
    await page.setViewportSize({ width: 1200, height: 900 });
    await expect(menu).not.toBeVisible();
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
    await page.setViewportSize({ width, height });
    await page.getByRole("button", { name: "Open menu" }).click();
    await menu.getByRole("link", { name: "Firstpass", exact: true }).click();
    await expect(page).toHaveURL(/\/firstpass\/?$/);
    await expect(menu).not.toBeVisible();
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
    await expect(page.locator("h1")).toHaveText("Your care.Connected.");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.close();
  }
  expect(errors).toEqual([]);
  console.log(
    "Passed: six phone/tablet/landscape layouts, cached hero art and moving pulse elements, 44px menu control, bounded menu scrolling, background scroll lock, focus cycling, Escape, consultation dialog, resize and page-navigation cleanup. No browser errors.",
  );
} finally {
  await browser.close();
}
