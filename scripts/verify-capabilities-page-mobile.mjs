import { chromium, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.env.PREVIEW_URL || "http://127.0.0.1:3001";
const output = "/tmp/vectramind-capabilities-page-mobile";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  await page.addInitScript(() =>
    localStorage.setItem("vectramind-notice", "dismissed"),
  );
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [320, 390, 430, 600, 767]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${base}/capabilities/`, { waitUntil: "networkidle" });
    const root = page.locator(".capabilities-page");
    await expect(root.locator("h1")).toHaveText("Intelligence.In motion.");
    const actions = await root
      .locator(".product-landing-actions .button")
      .evaluateAll((nodes) =>
        nodes.map((el) => {
          const r = el.getBoundingClientRect();
          return { y: r.y, height: r.height, x: r.x, right: r.right };
        }),
      );
    expect(Math.abs(actions[0].y - actions[1].y)).toBeLessThan(1);
    expect(
      actions.every((r) => r.x >= 0 && r.right <= width && r.height >= 44),
    ).toBe(true);
    const jumps = root.locator(".capabilities-jump a");
    await expect(jumps).toHaveCount(3);
    const positions = await jumps.evaluateAll((nodes) =>
      nodes.map((el) => el.getBoundingClientRect().y),
    );
    expect(Math.max(...positions) - Math.min(...positions)).toBeLessThan(1);
    const services = root.locator(".capabilities-service");
    await expect(services).toHaveCount(3);
    for (const [index, service] of (await services.all()).entries()) {
      const link = jumps.nth(index);
      expect(await link.getAttribute("href")).toBe(
        `#${await service.getAttribute("id")}`,
      );
      await link.click();
      // Native anchors account for both the page scroll padding and target margin.
      await expect
        .poll(async () => {
          const bounds = await service.boundingBox();
          const header = await page.locator(".header").boundingBox();
          return bounds.y >= header.height && bounds.y <= 220;
        })
        .toBe(true);
      const details = service.locator("details");
      await expect(details).not.toHaveAttribute("open", "");
      await expect(
        service.locator(".capabilities-expertise-desktop"),
      ).toBeHidden();
      const body = service.locator(".capabilities-service-content > p");
      await expect(body).toHaveCSS("font-size", "16px");
      await details.locator("summary").click();
      await expect(details.locator("p").first()).toBeVisible();
      await expect(details.locator("li")).toHaveCount(4);
      for (const paragraph of await details.locator("li p").all()) {
        expect((await paragraph.textContent()).length).toBeGreaterThan(40);
        await expect(paragraph).toHaveCSS("font-size", "16px");
      }
      await details.locator("summary").click();
      const cta = service.locator(".button");
      await expect(cta).toHaveAttribute(
        "href",
        new RegExp(`topic=${await service.getAttribute("id")}$`),
      );
      const summaryBounds = await details.boundingBox();
      const ctaBounds = await cta.boundingBox();
      expect(ctaBounds.y).toBeGreaterThanOrEqual(
        summaryBounds.y + summaryBounds.height,
      );
    }
    for (const card of await root.locator(".platform-card").all()) {
      await expect(card.locator("h3 .platform-copy-full")).toBeHidden();
      await expect(card.locator("h3 .platform-copy-compact")).toBeVisible();
      await expect(card.locator(".platform-card-description")).toHaveCSS(
        "font-size",
        "16px",
      );
      await expect(card.locator(".platform-card-cta")).toBeVisible();
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (width === 390)
      for (const [name, selector] of [
        ["hero", ".capabilities-hero"],
        ["expertise", "#capability-services"],
        ["integration", "#integration-services"],
        ["platforms", ".capabilities-platforms"],
      ]) {
        await root.locator(selector).scrollIntoViewIfNeeded();
        await page.screenshot({ path: `${output}/${name}.png` });
      }
    console.log(
      `${width}px: hero actions, three jump links, all 12 service details, shared body fonts, ordered CTAs and no overflow passed`,
    );
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${base}/capabilities/`, { waitUntil: "networkidle" });
  await expect(page.locator(".capabilities-expertise-desktop li")).toHaveCount(
    12,
  );
  for (const list of await page
    .locator(".capabilities-expertise-desktop")
    .all())
    await expect(list).toBeVisible();
  for (const details of await page
    .locator(".capabilities-expertise-mobile")
    .all())
    await expect(details).toBeHidden();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
  console.log("Desktop full service content and browser errors passed.");
} finally {
  await browser.close();
}
