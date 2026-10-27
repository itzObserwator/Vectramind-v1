import { chromium, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
const base = process.env.PREVIEW_URL || "http://127.0.0.1:3001";
const output = "/tmp/vectramind-support-mobile";
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
    await page.goto(`${base}/support/`, { waitUntil: "networkidle" });
    const root = page.locator(".support-page");
    await expect(root.locator("h1")).toHaveText("Here to help.With you.");
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
    await root
      .getByRole("link", { name: "Find an answer", exact: true })
      .click();
    await expect(page).toHaveURL(/#support-answers$/);
    const tabs = root.getByRole("tab");
    await expect(tabs).toHaveCount(4);
    const ys = await tabs.evaluateAll((nodes) =>
      nodes.map((el) => el.getBoundingClientRect().y),
    );
    expect(Math.max(...ys) - Math.min(...ys)).toBeLessThan(1);
    for (const [name, count] of [
      ["Synapse", 3],
      ["Firstpass", 3],
      ["General", 2],
      ["All", 8],
    ]) {
      await root.getByRole("tab", { name, exact: true }).click();
      await expect(root.locator(".faq-list details")).toHaveCount(count);
    }
    const search = root.getByRole("searchbox");
    await search.fill("Maker Checker");
    await expect(root.locator(".faq-list details")).toHaveCount(1);
    await root.locator(".faq-list summary").click();
    await expect(root.locator(".faq-list details p")).toBeVisible();
    await search.fill("no-matching-answer-xyz");
    await expect(root.locator(".empty-results")).toBeVisible();
    await search.fill("");
    const preparation = root.locator(".support-preparation");
    await expect(preparation).not.toHaveAttribute("open", "");
    await preparation.locator("summary").click();
    await expect(preparation.locator("li")).toHaveCount(3);
    await expect(preparation.locator("p").last()).toBeVisible();
    await preparation.locator("summary").click();
    for (const paragraph of await root.locator(".support-help-grid p").all())
      await expect(paragraph).toHaveCSS("font-size", "16px");
    const form = root.locator(".request-form");
    for (const control of await form
      .locator(
        'input:not([type="checkbox"]):not([type="radio"]), select, textarea',
      )
      .all()) {
      await expect(control).toHaveCSS("font-size", "16px");
      const b = await control.boundingBox();
      expect(b.x).toBeGreaterThanOrEqual(0);
      expect(b.x + b.width).toBeLessThanOrEqual(width);
    }
    await form.getByRole("button", { name: "Prepare email" }).click();
    await expect(root.locator(".email-draft")).toHaveCount(0);
    if (width === 390)
      for (const [name, selector] of [
        ["hero", ".support-hero"],
        ["help", ".support-start"],
        ["form", "#support-request"],
        ["answers", "#support-answers"],
      ]) {
        await root.locator(selector).scrollIntoViewIfNeeded();
        await page.screenshot({ path: `${output}/${name}.png` });
      }
    await form.getByLabel("Your name").fill("Mobile Support Test");
    await form.getByLabel("Work email").fill("test@example.test");
    await form.getByRole("combobox").selectOption("firstpass");
    await form
      .getByLabel("Your message")
      .fill(
        "Please help us review patient flow and appointment scheduling for our organization.",
      );
    await form.getByRole("checkbox").check();
    await form.getByRole("button", { name: "Prepare email" }).click();
    await expect(root.locator(".email-draft")).toContainText(
      "Topic: firstpass",
    );
    await expect(
      root.getByRole("link", { name: "Open email app" }),
    ).toHaveAttribute("href", /^mailto:support@vectramind.com\?/);
    await expect(root.locator(".email-draft")).toContainText(
      "has not been sent",
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await root.getByRole("button", { name: "Write another enquiry" }).click();
    await expect(root.locator(".request-form select")).toHaveValue("firstpass");
    console.log(
      `${width}px: paired CTAs, compact help, preparation details, all FAQ topics/search, validation and email draft without overflow passed`,
    );
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${base}/support/`, { waitUntil: "networkidle" });
  await expect(page.locator(".support-preparation")).toBeHidden();
  await expect(page.locator(".support-steps-desktop li")).toHaveCount(3);
  await expect(page.locator(".form-heading")).toBeVisible();
  await expect(page.getByRole("tab", { name: "All answers" })).toBeVisible();
  expect(errors).toEqual([]);
  console.log("Desktop content and browser errors passed.");
} finally {
  await browser.close();
}
