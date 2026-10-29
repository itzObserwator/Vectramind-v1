import { chromium, expect } from "@playwright/test";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const base = process.env.PREVIEW_URL || "http://127.0.0.1:3000";
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(base, { waitUntil: "networkidle" });
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "Contact Vectramind", exact: true })
    .click();
  const chat = page.getByRole("dialog", { name: "Help Desk" });
  await expect(chat).toBeVisible();
  await expect(page.locator(".dialog-overlay")).toHaveCount(0);
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  await expect(chat.getByRole("log")).toContainText("May we have your name");
  await expect(
    chat.getByRole("button", { name: "Send message" }),
  ).toBeDisabled();
  const name = chat.getByRole("textbox", { name: "Your name", exact: true });
  await expect(name).toBeFocused();
  await name.fill("Sravan");
  await name.press("Enter");
  await expect(chat.getByRole("log")).toContainText("Thanks, Sravan.");
  for (const [topic, link, href] of [
    ["Explore Synapse", "Explore Synapse", "/synapse"],
    ["Explore Firstpass", "Explore Firstpass", "/firstpass"],
    [
      "Connect my systems",
      "Discuss an integration",
      "/support?topic=integration-services#support-request",
    ],
    ["Get support", "Contact support", "/support#support-request"],
  ]) {
    await chat.getByRole("button", { name: topic, exact: true }).click();
    const actual = new URL(
      await chat
        .getByRole("link", { name: link, exact: true })
        .last()
        .getAttribute("href"),
      base,
    );
    const target = new URL(href, base);
    expect(actual.pathname.replace(/\/$/, "")).toBe(
      target.pathname.replace(/\/$/, ""),
    );
    expect(actual.search + actual.hash).toBe(target.search + target.hash);
  }
  const input = chat.getByRole("textbox", {
    name: "Your message",
    exact: true,
  });
  await input.fill("Can I arrange a consultation? <script>alert(1)</script>");
  await input.press("Enter");
  await expect(chat.getByRole("log")).toContainText(
    "<script>alert(1)</script>",
  );
  await expect(chat.locator("script")).toHaveCount(0);
  const draft = new URL(
    await chat
      .getByRole("link", { name: "email our team." })
      .getAttribute("href"),
  );
  expect(draft.protocol).toBe("mailto:");
  expect(draft.pathname).toBe("support@vectramind.com");
  expect(draft.searchParams.get("body")).toContain("Name: Sravan");
  expect(draft.searchParams.get("body")).toContain(
    "Can I arrange a consultation?",
  );
  await page.keyboard.press("Escape");
  await expect(chat).toHaveCount(0);
  await page
    .getByRole("button", { name: "Contact Vectramind", exact: true })
    .click();
  await expect(chat.getByRole("log")).toContainText("Thanks, Sravan.");
  await page.locator("h1").click();
  await expect(chat).toBeVisible();
  await page.reload({ waitUntil: "networkidle" });
  await page
    .getByRole("button", { name: "Contact Vectramind", exact: true })
    .click();
  await expect(chat.locator(".chat-message")).toHaveCount(2);
  await expect(name).toHaveValue("");
  await expect(name).toBeFocused();
  await name.fill("A");
  await name.press("Enter");
  await expect(chat.getByRole("log")).toContainText(
    "between 2 and 60 characters",
  );
  await page.reload({ waitUntil: "networkidle" });
  await page
    .getByRole("button", { name: "Contact Vectramind", exact: true })
    .click();
  for (const [width, height] of [
    [320, 640],
    [390, 844],
    [768, 1024],
    [844, 390],
    [1440, 900],
  ]) {
    await page.setViewportSize({ width, height });
    const box = await chat.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
    expect(box.y + box.height).toBeLessThanOrEqual(height);
    expect(
      await chat.evaluate(
        (element) => element.scrollWidth <= element.clientWidth,
      ),
    ).toBe(true);
    for (const label of ["Close dialog", "Send message"]) {
      const button = await chat
        .getByRole("button", { name: label, exact: true })
        .boundingBox();
      expect(button.width).toBeGreaterThanOrEqual(44);
      expect(button.height).toBeGreaterThanOrEqual(44);
    }
    await chat.screenshot({ path: `/tmp/vectramind-chat-${width}.png` });
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(chat).toHaveCSS("animation-name", "none");
  await chat.getByRole("button", { name: "Close dialog" }).click();
  await expect(chat).toHaveCount(0);
  await page.goto(`${base}/firstpass`, { waitUntil: "networkidle" });
  await page
    .getByRole("button", { name: "Contact Vectramind", exact: true })
    .click();
  await expect(chat).toBeVisible();
  await name.fill("Alex");
  await name.press("Enter");
  await chat
    .getByRole("button", { name: "Explore Synapse", exact: true })
    .click();
  await chat
    .getByRole("link", { name: "Explore Synapse", exact: true })
    .click();
  await expect(page).toHaveURL(/\/synapse\/?$/);
  await expect(chat).toHaveCount(0);
  expect(errors).toEqual([]);
  console.log(
    "Passed: help desk greeting, guided product/support replies, safe user text, reviewable email draft, close/reopen, outside interaction, keyboard access, 44px controls, 320–1440px layouts, reduced motion and cross-page navigation.",
  );
} finally {
  await browser.close();
}
