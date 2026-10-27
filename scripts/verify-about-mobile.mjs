import { chromium, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
const base = process.env.PREVIEW_URL || "http://127.0.0.1:3001";
const output = "/tmp/vectramind-about-mobile";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  await page.addInitScript(() =>
    localStorage.setItem("vectramind-notice", "dismissed"),
  );
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const width of [320, 390, 430, 600, 767]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${base}/about/`, { waitUntil: "networkidle" });
    const root = page.locator(".about-page");
    await expect(root.locator("h1")).toHaveText("With youin mind.");
    const actions = await root
      .locator(".product-landing-actions .button")
      .evaluateAll((nodes) =>
        nodes.map((el) => {
          const r = el.getBoundingClientRect();
          return { y: r.y, x: r.x, right: r.right, height: r.height };
        }),
      );
    expect(Math.abs(actions[0].y - actions[1].y)).toBeLessThan(1);
    expect(
      actions.every((r) => r.x >= 0 && r.right <= width && r.height >= 44),
    ).toBe(true);
    const metrics = root.locator(".product-landing-metrics > div");
    await expect(metrics).toHaveCount(4);
    const positions = await metrics.evaluateAll((nodes) =>
      nodes.map((el) => ({
        x: el.getBoundingClientRect().x,
        y: el.getBoundingClientRect().y,
      })),
    );
    expect(positions[0].y).toBe(positions[1].y);
    expect(positions[2].y).toBe(positions[3].y);
    expect(positions[2].y).toBeGreaterThan(positions[0].y);
    for (const detail of await root.locator(".about-mobile-detail").all()) {
      await detail.locator("summary").click();
      await expect(detail.locator("p")).toBeVisible();
      await expect(detail.locator("p")).toHaveCSS("font-size", "16px");
      expect((await detail.locator("p").textContent()).length).toBeGreaterThan(
        200,
      );
      await detail.locator("summary").click();
    }
    const offices = root.locator(".about-office");
    await expect(offices).toHaveCount(5);
    for (const office of await offices.all()) {
      await expect(office).toHaveAttribute("href", /^https:\/\//);
      expect((await office.boundingBox()).height).toBeGreaterThanOrEqual(44);
    }
    await expect(root.locator(".about-partner-list li")).toHaveCount(7);
    await expect(root.locator(".published-partners img")).toBeHidden();
    const picker = root.getByRole("combobox", {
      name: "Filter milestone photos",
    });
    await expect(picker).toBeVisible();
    await expect(root.locator(".milestone-filters")).toBeHidden();
    await expect(root.locator(".milestone-grid figure")).toHaveCount(6);
    await picker.selectOption({ index: 1 });
    const event = await picker.inputValue();
    for (const caption of await root
      .locator(".milestone-grid figcaption")
      .all())
      await expect(caption).toHaveText(event);
    await picker.selectOption("All moments");
    await root.getByRole("button", { name: "Show more moments" }).click();
    await expect(root.locator(".milestone-grid figure")).toHaveCount(12);
    if (width === 390) {
      while (
        await root.getByRole("button", { name: "Show more moments" }).count()
      )
        await root.getByRole("button", { name: "Show more moments" }).click();
      await expect(root.locator(".milestone-grid figure")).toHaveCount(40);
      await expect(root.locator(".milestone-more p")).toHaveText(
        "Showing 40 of 40 moments",
      );
      await picker.selectOption({ index: 1 });
      await picker.selectOption("All moments");
      for (const [name, selector] of [
        ["hero", ".about-hero"],
        ["story", ".about-story"],
        ["purpose", ".about-purpose"],
        ["founder", ".about-founder"],
        ["culture", ".about-culture"],
        ["locations", ".about-locations"],
        ["partners", ".published-partners"],
        ["people", ".people"],
        ["milestones", ".milestone-archive"],
      ]) {
        await root.locator(selector).scrollIntoViewIfNeeded();
        await page.screenshot({ path: `${output}/${name}.png` });
      }
    }
    const photoGrid = root.locator(".milestone-grid figure");
    const first = await photoGrid.nth(0).boundingBox();
    const second = await photoGrid.nth(1).boundingBox();
    expect(first.y).toBe(second.y);
    await expect(root.locator(".about-careers")).toBeHidden();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    console.log(
      `${width}px: paired CTAs, 2x2 company facts, expandable messages, five office links, partners, milestone filters and no overflow passed`,
    );
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${base}/about/`, { waitUntil: "networkidle" });
  await expect(page.locator(".milestone-picker")).toBeHidden();
  await expect(page.locator(".milestone-filters")).toBeVisible();
  await expect(page.locator(".published-partners img")).toBeVisible();
  await expect(page.locator(".about-careers")).toBeVisible();
  for (const details of await page.locator(".about-mobile-detail").all())
    await expect(details).toBeHidden();
  expect(errors).toEqual([]);
  console.log("Desktop content and no browser errors passed.");
} finally {
  await browser.close();
}
