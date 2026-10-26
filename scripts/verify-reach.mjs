import { chromium, expect } from "@playwright/test";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 2,
  });
  await page.addInitScript(() => {
    window.__reachFrames = 0;
    const clear = WebGL2RenderingContext.prototype.clear;
    WebGL2RenderingContext.prototype.clear = function (...args) {
      if (this.canvas.closest(".reach-globe-renderer")) window.__reachFrames++;
      return clear.apply(this, args);
    };
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error" && /shader|WebGLProgram/i.test(m.text()))
      errors.push(m.text());
  });
  const url = process.env.PREVIEW_URL || "http://127.0.0.1:3000";
  await page.goto(url, { waitUntil: "networkidle" });
  const section = page.locator("#global-reach");
  expect(await section.evaluate((e) => e.previousElementSibling.id)).toBe(
    "products",
  );
  await expect(section).toHaveCount(1);
  const tab = (name) => section.getByRole("tab", { name: new RegExp(name) });
  const canvas = section.locator("canvas");
  async function scrub(p) {
    await section.evaluate(
      (e, p) =>
        scrollTo(
          0,
          e.getBoundingClientRect().top +
            scrollY +
            (e.offsetHeight - innerHeight) * p,
        ),
      p,
    );
    await page.waitForTimeout(1200);
  }
  await scrub(0.12);
  const early = await section
    .locator(".reach-globe-scene")
    .evaluate((e) => getComputedStyle(e).transform);
  expect(
    parseInt(await section.locator(".reach-client-count").textContent()),
  ).toBeLessThan(800);
  await scrub(0.82);
  await expect(section.locator(".reach-client-count")).toHaveText("800+");
  expect(
    await section
      .locator(".reach-globe-scene")
      .evaluate((e) => getComputedStyle(e).transform),
  ).not.toBe(early);
  await expect(canvas).toHaveCount(1);
  await expect
    .poll(() => canvas.evaluate((e) => e.width * e.height))
    .toBeLessThanOrEqual(1_400_000);
  await expect(section.locator("[data-location]")).toHaveCount(5);
  await expect(tab("Dubai")).toHaveAttribute("aria-selected", "true");
  await expect(canvas).toHaveAttribute("data-motion", "settled");
  const idle = await page.evaluate(() => window.__reachFrames);
  await page.waitForTimeout(400);
  expect(await page.evaluate(() => window.__reachFrames)).toBe(idle);
  // Office navigation triggers bounded animation, then the GPU stops again.
  const start = await page.evaluate(() => window.__reachFrames);
  await tab("Vancouver").click();
  await page.waitForTimeout(1000);
  const delta = (await page.evaluate(() => window.__reachFrames)) - start;
  expect(delta).toBeGreaterThan(0);
  expect(delta).toBeLessThanOrEqual(36);
  await expect(canvas).toHaveAttribute("data-motion", "settled", {
    timeout: 7000,
  });
  async function assertOffice(name) {
    await expect(tab(name)).toHaveAttribute("aria-selected", "true");
    await expect(canvas).toHaveAttribute("data-office", name);
    await expect(canvas).toHaveAttribute("data-motion", "settled", {
      timeout: 7000,
    });
    await expect(section.locator(`[data-location="${name}"]`)).toHaveAttribute(
      "data-facing",
      "front",
    );
    const pin = await section
      .locator(`[data-location="${name}"] circle`)
      .first()
      .boundingBox();
    const map = await section.locator(".reach-globe-scene").boundingBox();
    expect(
      Math.abs(pin.x + pin.width / 2 - map.x - map.width / 2),
    ).toBeLessThan(4);
    expect(
      Math.abs(pin.y + pin.height / 2 - map.y - map.height / 2),
    ).toBeLessThan(4);
  }
  await assertOffice("Vancouver");
  await expect(section.getByRole("tabpanel")).toContainText("Canada");
  await section
    .getByRole("button", { name: "Next office", exact: true })
    .click();
  await assertOffice("Dubai");
  await section
    .getByRole("button", { name: "Previous office", exact: true })
    .click();
  await assertOffice("Vancouver");
  await tab("Vancouver").focus();
  await page.keyboard.press("Home");
  await assertOffice("Dubai");
  await expect(tab("Dubai")).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await assertOffice("Hyderabad");
  await page.keyboard.press("End");
  await assertOffice("Vancouver");
  for (const name of ["Riyadh", "Tanuku", "Dubai"]) {
    await tab(name).click();
    await assertOffice(name);
  }
  await expect(section.locator(".reach-metric")).toHaveCount(3);
  await expect(
    section.getByRole("link", { name: "Meet Vectramind" }),
  ).toHaveAttribute("href", /^\/about\/?$/);
  await page.screenshot({ path: "/tmp/vectramind-reach-desktop.png" });
  await section
    .getByRole("button", { name: "Next office", exact: true })
    .click();
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(600);
  await expect(section.locator(".reach-globe-renderer")).toHaveAttribute(
    "data-flow",
    "paused",
  );
  const paused = await page.evaluate(() => window.__reachFrames);
  await page.waitForTimeout(650);
  expect(await page.evaluate(() => window.__reachFrames)).toBe(paused);
  for (const width of [2560, 1440, 1024, 900, 768, 640, 430, 390, 320]) {
    await page.setViewportSize({ width, height: width > 1100 ? 1000 : 844 });
    if (width > 900) await scrub(0.82);
    else {
      await section.locator(".reach-map-panel").scrollIntoViewIfNeeded();
      await page.waitForTimeout(1200);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `Overflow at ${width}`,
    ).toBe(true);
    await expect
      .poll(() => canvas.evaluate((e) => e.width * e.height))
      .toBeLessThanOrEqual(1_400_000);
    for (const selector of [
      ".reach-overview",
      ".reach-map-panel",
      ".reach-highlight",
      ".reach-metrics",
      ".reach-offices",
    ]) {
      const rect = await section.locator(selector).boundingBox();
      expect(rect.x, selector).toBeGreaterThanOrEqual(0);
      expect(rect.x + rect.width, selector).toBeLessThanOrEqual(width);
    }
    const intro = await section.locator(".reach-overview").boundingBox(),
      stage = await section.locator(".reach-stage").boundingBox(),
      offices = await section.locator(".reach-offices").boundingBox(),
      map = await section.locator(".reach-map-panel").boundingBox();
    expect(intro.y + intro.height).toBeLessThan(stage.y);
    if (width > 767) expect(offices.x + offices.width).toBeLessThan(map.x);
    else expect(map.y + map.height).toBeLessThan(offices.y);
    await expect(section.getByRole("tablist")).toHaveAttribute(
      "aria-orientation",
      width <= 767 ? "horizontal" : "vertical",
    );
    if (width <= 767) {
      const tabs = await section.getByRole("tab").all();
      const first = await tabs[0].boundingBox();
      const third = await tabs[2].boundingBox();
      const fourth = await tabs[3].boundingBox();
      expect(third.y).toBeCloseTo(first.y, 1);
      expect(fourth.y).toBeGreaterThan(first.y + first.height);
      await expect(
        section.locator(".reach-office-selected-name"),
      ).toBeVisible();
      const metrics = await section.locator(".reach-metric").all();
      for (let index = 1; index < metrics.length; index++) {
        const previous = await metrics[index - 1].boundingBox();
        const current = await metrics[index].boundingBox();
        expect(current.y).toBeGreaterThanOrEqual(
          previous.y + previous.height - 1,
        );
      }
    }
    for (const button of await section.getByRole("tab").all())
      expect((await button.boundingBox()).height).toBeGreaterThanOrEqual(44);
    if (width === 390)
      await page.screenshot({ path: "/tmp/vectramind-reach-mobile.png" });
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await expect(section.locator(".reach-sticky")).toHaveCSS(
    "position",
    "relative",
  );
  await expect(section.locator(".reach-client-count")).toHaveText("800+");
  await tab("Vancouver").click();
  await assertOffice("Vancouver");
  await expect(section.locator(".reach-globe-renderer")).toHaveAttribute(
    "data-flow",
    "paused",
  );
  const fallback = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  await fallback.route("**/data/globe-points.json", (route) => route.abort());
  await fallback.goto(url, { waitUntil: "networkidle" });
  await fallback.locator("#global-reach").scrollIntoViewIfNeeded();
  await expect(
    fallback.locator("#global-reach .reach-globe-fallback"),
  ).toBeVisible();
  await expect(fallback.getByRole("tab", { name: /Dubai/ })).toBeVisible();
  await fallback.getByRole("tab", { name: /Vancouver/ }).click();
  await expect(
    fallback.locator("#global-reach").getByRole("tabpanel"),
  ).toContainText("Canada");
  await fallback.close();
  // Mobile browsers can disable hardware rendering while the network still
  // works. Do not log a Three.js constructor error or duplicate the fallback.
  const unavailable = await browser.newPage({
    viewport: { width: 390, height: 844 },
  });
  const unavailableErrors = [];
  unavailable.on("pageerror", (error) => unavailableErrors.push(error.message));
  unavailable.on("console", (message) => {
    if (message.type() === "error") unavailableErrors.push(message.text());
  });
  await unavailable.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      return /webgl/i.test(type) ? null : original.call(this, type, ...args);
    };
  });
  await unavailable.goto(url, { waitUntil: "networkidle" });
  await unavailable.locator("#global-reach").scrollIntoViewIfNeeded();
  await expect(unavailable.locator(".reach-globe-unavailable")).toBeVisible();
  await expect(unavailable.locator(".reach-globe-fallback")).toHaveCount(1);
  await unavailable.getByRole("tab", { name: /Vancouver/ }).click();
  await expect(
    unavailable.locator("#global-reach").getByRole("tabpanel"),
  ).toContainText("Canada");
  expect(unavailableErrors).toEqual([]);
  await unavailable.close();
  expect(errors).toEqual([]);
  console.log(
    "Passed: grouped layout, 5 centered office selections, tab keyboard controls, previous/next wrapping, country details, 44px targets, 320–2560px layouts, 30Hz/pixel budget, zero idle/offscreen draws, reduced motion and fallback.",
  );
} finally {
  await browser.close();
}
