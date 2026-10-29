import { chromium, expect } from "@playwright/test";

const base = process.env.PREVIEW_URL || "http://127.0.0.1:3001";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  for (const [width, height, route, reducedMotion] of [
    [1440, 900, "/", "no-preference"],
    [390, 844, "/", "no-preference"],
    [844, 390, "/support/", "no-preference"],
    [1440, 900, "/synapse/", "no-preference"],
    [390, 844, "/", "reduce"],
  ]) {
    const page = await browser.newPage({
      viewport: { width, height },
      reducedMotion,
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(new URL(route, base).href, { waitUntil: "networkidle" });
    await page.keyboard.press("Escape");
    await expect(page.locator(".site-preloader")).toBeHidden();
    const header = page.locator(".header");
    const expanded = (await header.boundingBox()).height;
    for (const offset of [30, 70, 99]) {
      await page.evaluate((offset) => scrollTo(0, offset), offset);
      await expect(header).toHaveCSS("position", "fixed");
      await expect.poll(async () => (await header.boundingBox()).y).toBe(0);
      await expect(header).not.toHaveClass(/header-scrolled/);
    }
    const sample = (offset, openMenu = false) =>
      page.evaluate(
        ({ offset, openMenu }) =>
          new Promise((resolve) => {
            const frames = [];
            const start = performance.now();
            scrollTo(0, offset);
            if (openMenu)
              setTimeout(
                () => document.querySelector(".menu-button").click(),
                35,
              );
            const read = () => {
              const header = document
                .querySelector(".header")
                .getBoundingClientRect();
              const menu = document
                .querySelector(".mobile-nav")
                ?.getBoundingClientRect();
              frames.push({
                y: header.y,
                height: header.height,
                menuBottom: menu?.bottom,
              });
              if (performance.now() - start < 450) requestAnimationFrame(read);
              else resolve(frames);
            };
            requestAnimationFrame(read);
          }),
        { offset, openMenu },
      );
    const compactFrames = await sample(140);
    await expect(header).toHaveClass(/header-scrolled/);
    const compact = (await header.boundingBox()).height;
    expect(compact).toBeLessThan(expanded);
    expect(compactFrames.every((frame) => Math.abs(frame.y) < 1)).toBe(true);
    if (reducedMotion === "no-preference")
      expect(
        compactFrames.some(
          (frame) =>
            frame.height > compact + 0.1 && frame.height < expanded - 0.1,
        ),
        "Height eases between states instead of jumping",
      ).toBe(true);
    for (const offset of [98, 102, 97, 101, 90]) {
      await page.evaluate((offset) => scrollTo(0, offset), offset);
      await page.waitForTimeout(50);
      await expect(header).toHaveClass(/header-scrolled/);
    }
    const expandedFrames = await sample(0);
    await expect(header).not.toHaveClass(/header-scrolled/);
    expect(expandedFrames.every((frame) => Math.abs(frame.y) < 1)).toBe(true);
    expect((await header.boundingBox()).height).toBeCloseTo(expanded, 0);
    if (width <= 900) {
      const menuFrames = await sample(140, true);
      await expect(
        page.getByRole("navigation", { name: "Mobile navigation" }),
      ).toBeVisible();
      expect(
        menuFrames
          .filter((frame) => frame.menuBottom !== undefined)
          .every((frame) => frame.menuBottom <= height + 1),
        "Menu fits beneath the header during its height transition",
      ).toBe(true);
      await page.keyboard.press("Escape");
      await expect(
        page.getByRole("button", { name: "Open menu" }),
      ).toBeFocused();
      await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
    }
    expect(errors).toEqual([]);
    console.log(
      `${width}x${height} ${route} (${reducedMotion}): fixed placement, smooth resize, stable scroll threshold, reversal and menu bounds passed`,
    );
    await page.close();
  }
} finally {
  await browser.close();
}
