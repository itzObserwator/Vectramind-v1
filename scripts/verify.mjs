import { chromium, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const base = process.env.PREVIEW_URL || "http://127.0.0.1:3000";
const output = "/tmp/vectramind-qa";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
const page = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  deviceScaleFactor: 1,
});
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
const response = await page.goto(base, { waitUntil: "networkidle" });
expect(response.status()).toBe(200);
await expect(page.locator("h1")).toHaveAttribute(
  "aria-label",
  "Vectramind — Transforming human experiences",
);
await expect(page.locator("h1")).toContainText("Human connections.");
await page.waitForTimeout(1500);
await page.screenshot({ path: `${output}/desktop-hero.png` });
await page.getByRole("button", { name: "Contact Vectramind", exact: true }).click();
await expect(page.getByRole("dialog")).toBeVisible();
await expect(
  page.getByRole("link", { name: "Contact the Vectramind team" }),
).toHaveAttribute("href", /^\/contact\/?$/);
await page.keyboard.press("Escape");
await expect(page.getByRole("dialog")).not.toBeVisible();
await page.getByRole("button", { name: "Got it", exact: true }).click();
await expect(page.locator(".cookie-notice")).not.toBeVisible();
// Scrub all three capability and process states, including upward scrolling.
for (const [track, title] of [
  [".capability-track", ".capability-copy h3"],
  [".process-track", ".process-heading h2"],
]) {
  const states = [];
  for (const progress of [0.05, 0.47, 0.91, 0.05]) {
    await page
      .locator(track)
      .evaluate(
        (el, progress) =>
          window.scrollTo(
            0,
            el.getBoundingClientRect().top +
              window.scrollY +
              (el.offsetHeight - window.innerHeight) * progress,
          ),
        progress,
      );
    await page.waitForTimeout(1100);
    states.push(await page.locator(title).textContent());
  }
  expect(new Set(states).size).toBe(3);
  expect(states[0]).toBe(states[3]);
}
await page
  .getByRole("tab", { name: "Firstpass Patient experience" })
  .scrollIntoViewIfNeeded();
await page.getByRole("tab", { name: "Firstpass Patient experience" }).click();
await expect(page.locator(".firstpass-preview")).toBeVisible();
await page.screenshot({ path: `${output}/desktop-platform.png` });
await page.getByRole("tab", { name: "Synapse Customer engagement" }).click();
await expect(page.locator(".synapse-preview")).toBeVisible();
await page.evaluate(() => {
  location.hash = "firstpass";
});
await expect(page.locator(".firstpass-preview")).toBeVisible();
await page.evaluate(() => {
  location.hash = "synapse";
});
await expect(page.locator(".synapse-preview")).toBeVisible();
for (const id of ["capabilities", "products", "clients", "about"]) {
  await page
    .locator(`#${id}`)
    .evaluate((el) =>
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY),
    );
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${output}/desktop-${id}.png` });
}
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(1500);
await page.screenshot({ path: `${output}/desktop-footer.png` });
expect(
  await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
).toBeTruthy();
expect(await page.locator('a[href="#"]').count()).toBe(0);
const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  isMobile: true,
  deviceScaleFactor: 1,
});
mobile.on("pageerror", (error) => errors.push(error.message));
await mobile.goto(base, { waitUntil: "networkidle" });
await mobile.waitForTimeout(1500);
await mobile.screenshot({ path: `${output}/mobile-hero.png` });
await mobile.getByRole("button", { name: "Open menu" }).click();
await expect(
  mobile.getByRole("navigation", { name: "Mobile navigation" }),
).toBeVisible();
await mobile
  .getByRole("navigation", { name: "Mobile navigation" })
  .getByRole("link", { name: "Our clients" })
  .click();
await expect(
  mobile.getByRole("navigation", { name: "Mobile navigation" }),
).not.toBeVisible();
await mobile.getByRole("tab", { name: "Integration" }).click();
await expect(mobile.locator(".capability-copy h3")).toHaveText(
  "Bridge the gaps. Move forward together.",
);
for (const id of ["capabilities", "products", "clients", "about"]) {
  await mobile
    .locator(`#${id}`)
    .evaluate((el) =>
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY),
    );
  await mobile.waitForTimeout(800);
  expect(
    await mobile.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBeTruthy();
  await mobile.screenshot({ path: `${output}/mobile-${id}.png` });
}
await mobile.locator("img").evaluateAll(async (images) => {
  await Promise.all(
    images.map((img) => {
      img.loading = "eager";
      return img.decode().catch(() => {});
    }),
  );
});
const failedImages = await mobile
  .locator("img")
  .evaluateAll((images) =>
    images
      .filter((img) => !img.complete || img.naturalWidth === 0)
      .map((img) => img.src),
  );
expect(failedImages).toEqual([]);
await mobile
  .getByRole("button", { name: "Contact Vectramind", exact: true })
  .click();
await expect(mobile.getByRole("dialog")).toBeVisible();
await mobile.screenshot({ path: `${output}/mobile-contact.png` });
await mobile.keyboard.press("Escape");
const reduced = await browser.newPage({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
await reduced.goto(base, { waitUntil: "networkidle" });
await reduced.getByRole("tab", { name: "Integration" }).click();
await expect(reduced.locator(".capability-copy h3")).toHaveText(
  "Bridge the gaps. Move forward together.",
);
await expect(reduced.locator(".stories .story").first()).toHaveCSS(
  "position",
  "relative",
);
await browser.close();
expect(errors).toEqual([]);
console.log(
  `Passed: desktop/mobile layout, scroll states in both directions, tabs, menu, dialog, images, persisted notice, reduced motion, and browser errors. Screenshots: ${output}`,
);
