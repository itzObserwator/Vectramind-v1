import { chromium, expect } from "@playwright/test";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const base = process.env.PREVIEW_URL || "http://127.0.0.1:3001";
try {
  const page = await browser.newPage({ isMobile: true, hasTouch: true });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const [width, height] of [
    [320, 568],
    [390, 844],
    [430, 932],
    [767, 1024],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto(base, { waitUntil: "networkidle" });
    await page.keyboard.press("Escape");
    const section = page.locator("#ecosystem");
    await section.scrollIntoViewIfNeeded();
    await expect(section.locator(".pin-spacer")).toHaveCount(1);
    const scroll = async (progress) => {
      await section.evaluate((element, p) => {
        const scene = element.querySelector(".ecosystem-sticky");
        const spacer = element.querySelector(".pin-spacer");
        const start =
          element.getBoundingClientRect().top +
          scrollY +
          Math.max(0, scene.offsetHeight - innerHeight - 80);
        const distance = parseFloat(getComputedStyle(spacer).paddingBottom);
        scrollTo(0, start + distance * p);
      }, progress);
    };
    const opacity = (selector) =>
      section
        .locator(selector)
        .evaluate((element) => Number(getComputedStyle(element).opacity));
    await scroll(0.09);
    await expect.poll(() => opacity(".ecosystem-hub")).toBeGreaterThan(0.5);
    await expect.poll(() => opacity('[data-ecosystem-node="4"]')).toBe(0);
    await scroll(0.36);
    await expect.poll(() => opacity('[data-ecosystem-node="1"]')).toBe(1);
    await expect.poll(() => opacity('[data-ecosystem-node="4"]')).toBe(0);
    const ring = section.locator(
      '.ecosystem-mobile-connections [data-orbit="0-0"]',
    );
    const inner = await ring.evaluate(
      (element) => getComputedStyle(element).strokeDashoffset,
    );
    await scroll(0.7);
    await expect.poll(() => opacity('[data-ecosystem-node="4"]')).toBe(1);
    const held = await opacity('[data-ecosystem-node="8"]');
    await page.waitForTimeout(500);
    expect(
      await opacity('[data-ecosystem-node="8"]'),
      "No automatic reveal without scrolling",
    ).toBe(held);
    await scroll(0.99);
    await expect(section).toHaveAttribute("data-phase", "complete");
    for (const node of await section.locator(".ecosystem-node").all()) {
      await expect(node).toHaveCSS("opacity", "1");
      await expect(node).toHaveCSS("visibility", "visible");
    }
    await expect(ring).toHaveCSS("stroke-dashoffset", "0px");
    await section.locator('[data-ecosystem-node="8"]').tap();
    await expect(section.locator(".ecosystem-detail")).toContainText(
      "From appointment",
    );
    await page.keyboard.press("Escape");
    await scroll(0.1);
    await expect.poll(() => opacity('[data-ecosystem-node="4"]')).toBe(0);
    await expect
      .poll(() =>
        ring.evaluate((element) => getComputedStyle(element).strokeDashoffset),
      )
      .not.toBe(inner);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    console.log(
      `${width}x${height}: staged scroll reveal, stationary hold, reverse build and tap details passed`,
    );
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  const section = page.locator("#ecosystem");
  await expect(section.locator(".pin-spacer")).toHaveCount(0);
  for (const node of await section.locator(".ecosystem-node").all())
    await expect(node).toHaveCSS("visibility", "visible");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(section.locator(".pin-spacer")).toHaveCount(0);
  await expect(section.locator(".ecosystem-sticky")).toHaveCSS(
    "position",
    "sticky",
  );
  await section.evaluate((element) =>
    scrollTo(
      0,
      element.getBoundingClientRect().top +
        scrollY +
        (element.offsetHeight - innerHeight) * 0.99,
    ),
  );
  await expect(section).toHaveAttribute("data-phase", "complete");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(section.locator(".pin-spacer")).toHaveCount(1);
  const diagram = await section.locator(".ecosystem-diagram").boundingBox();
  expect(diagram.x + diagram.width / 2).toBeCloseTo(195, 0);
  expect(errors).toEqual([]);
  console.log(
    "Reduced motion exposes the full diagram; desktop/mobile resizing restores each layout without leftover pins or shifts. No browser errors.",
  );
} finally {
  await browser.close();
}
