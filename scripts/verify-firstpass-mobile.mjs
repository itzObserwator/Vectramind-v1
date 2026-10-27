import { chromium, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.env.PREVIEW_URL || "http://127.0.0.1:3001";
const output = "/tmp/vectramind-firstpass-mobile";
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
    await page.goto(`${base}/firstpass/`, { waitUntil: "networkidle" });
    const root = page.locator(".firstpass-overview");
    await expect(root.locator("h1")).toHaveText("Your care.Connected.");
    const actions = await root
      .locator(".product-landing-actions .button")
      .evaluateAll((items) =>
        items.map((el) => {
          const rect = el.getBoundingClientRect();
          return {
            x: rect.x,
            y: rect.y,
            right: rect.right,
            height: rect.height,
          };
        }),
      );
    expect(Math.abs(actions[0].y - actions[1].y)).toBeLessThan(1);
    expect(
      actions.every(
        (rect) => rect.x >= 0 && rect.right <= width && rect.height >= 44,
      ),
    ).toBe(true);
    await expect(
      root.locator(".product-landing-workspace-caption"),
    ).toBeHidden();
    const workspace = root.locator(".product-landing-workspace");
    expect(
      (await workspace.locator(".platform-thumbnail").boundingBox()).height,
    ).toBeGreaterThan(150);
    await expect(root.locator(".product-landing-metrics > div")).toHaveCount(3);
    const picker = root.getByRole("combobox", {
      name: "Choose a Firstpass module",
    });
    await expect(picker).toBeVisible();
    await expect(picker.locator("option")).toHaveCount(9);
    await expect(root.locator(".module-buttons")).toBeHidden();
    for (const index of [0, 1, 2, 3, 4, 5, 6, 7, 8]) {
      await picker.selectOption(String(index));
      const channel = await picker.locator("option:checked").textContent();
      await expect(root.locator(".module-panel h3")).toHaveText(channel);
      await expect(
        root.locator(".module-panel .text-link").first(),
      ).toHaveAttribute("href", `/firstpass/${channel.replaceAll(" ", "-")}/`);
      await expect(
        root.locator(".module-panel .text-link").first(),
      ).toBeVisible();
    }
    const groups = root.locator(".synapse-feature-mobile");
    await expect(groups).toHaveCount(2);
    await expect(groups.locator("details")).toHaveCount(8);
    for (const group of await groups.all()) {
      const detail = group.locator("details").first();
      await expect(detail).not.toHaveAttribute("open", "");
      await detail.locator("summary").click();
      await expect(detail.locator("p")).toBeVisible();
      await expect(detail.locator("p")).toHaveCSS("font-size", "16px");
      await detail.locator("summary").click();
    }
    for (const faq of await root.locator(".faq-list details").all()) {
      await faq.locator("summary").click();
      await expect(faq.locator("p")).toBeVisible();
      await faq.locator("summary").click();
    }
    for (const section of await root
      .locator(
        ".product-landing-overview, #firstpass-modules, .synapse-feature-mobile, .product-landing-faq, .product-landing-next",
      )
      .all()) {
      await section.scrollIntoViewIfNeeded();
      const bounds = await section.boundingBox();
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (width === 390) {
      for (const [name, selector] of [
        ["hero", ".product-landing-hero"],
        ["modules", "#firstpass-modules"],
        ["features", "#platform-features"],
        ["faq", ".product-landing-faq"],
      ]) {
        const section = root.locator(selector);
        await section.scrollIntoViewIfNeeded();
        await page.screenshot({ path: `${output}/${name}.png` });
      }
    }
    console.log(
      `${width}px: concise sections, 9 linked modules, 8 expandable features and all FAQs, shared type and no overflow passed`,
    );
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${base}/firstpass/`, { waitUntil: "networkidle" });
  await expect(page.locator(".synapse-feature-desktop")).toHaveCount(2);
  await expect(
    page.locator(".synapse-feature-desktop .inner-feature-grid article"),
  ).toHaveCount(8);
  await expect(page.locator(".synapse-channel-picker")).toBeHidden();
  await expect(page.getByRole("tab")).toHaveCount(9);
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${base}/firstpass/fp-scheduler/`, {
      waitUntil: "networkidle",
    });
    await expect(page.locator(".firstpass-module-page")).toBeVisible();
    await expect(page.locator(".synapse-channel-picker")).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  expect(errors).toEqual([]);
  console.log(
    "Desktop feature content, module tabs and browser errors passed.",
  );
} finally {
  await browser.close();
}
