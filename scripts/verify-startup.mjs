import { chromium, expect } from "@playwright/test";

const base = process.env.PREVIEW_URL || "http://127.0.0.1:3001";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const scripts = [];
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.request().resourceType() === "script")
      response
        .text()
        .then((text) => scripts.push(text))
        .catch(() => {});
  });
  await page.goto(base, { waitUntil: "networkidle" });
  await expect(page.locator(".site-preloader")).toHaveCount(0, {
    timeout: 7000,
  });
  await page.waitForTimeout(700);
  expect(
    scripts.some((text) => text.includes("ScrollTrigger")),
    "Scroll engine is not downloaded on an idle homepage",
  ).toBe(false);
  expect(
    scripts.some((text) =>
      text.includes("Welcome to the Vectramind Help Desk."),
    ),
    "Chat code is not downloaded before opening it",
  ).toBe(false);

  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  await page.route("**/_next/static/chunks/*.js", async (route) => {
    const response = await route.fetch();
    if (
      (await response.text()).includes("Welcome to the Vectramind Help Desk.")
    )
      await gate;
    await route.fulfill({ response });
  });
  const trigger = page.getByRole("button", {
    name: "Contact Vectramind",
    exact: true,
  });
  await trigger.click();
  const loading = page.getByRole("dialog", { name: "Help Desk" });
  await expect(loading).toHaveAttribute("aria-busy", "true");
  await expect(loading.getByRole("status")).toHaveText(
    "Opening your conversation…",
  );
  await page.keyboard.press("Escape");
  await expect(loading).toHaveCount(0);
  await expect(trigger).toBeFocused();
  release();
  await trigger.click();
  const name = page.getByRole("textbox", { name: "Your name", exact: true });
  await expect(name).toBeFocused();
  await name.fill("Ada");
  await name.press("Enter");
  await expect(page.getByRole("log")).toContainText("Thanks, Ada.");
  await page.keyboard.press("Escape");
  await trigger.click();
  await expect(page.getByRole("log")).toContainText("Thanks, Ada.");
  await page.keyboard.press("Escape");
  await page.mouse.wheel(0, 500);
  await expect
    .poll(() => scripts.some((text) => text.includes("ScrollTrigger")))
    .toBe(true);
  expect(errors).toEqual([]);
  await page.close();

  const images = await browser.newPage({
    viewport: { width: 390, height: 844 },
  });
  let showLogo;
  const logoGate = new Promise((resolve) => {
    showLogo = resolve;
  });
  await images.route("**/images/vectramind-logo.svg", async (route) => {
    await logoGate;
    await route.continue();
  });
  await images.goto(base, { waitUntil: "domcontentloaded" });
  const logo = images.locator(".preloader-brand img");
  const before = await logo.boundingBox();
  showLogo();
  await expect
    .poll(() =>
      logo.evaluate((image) => image.complete && image.naturalWidth > 0),
    )
    .toBe(true);
  const after = await logo.boundingBox();
  expect(after.height).toBeCloseTo(before.height, 2);
  expect(after.y).toBeCloseTo(before.y, 2);
  await images.close();
  console.log(
    "Passed: idle startup skips chat/scroll code, slow chat loading stays accessible, close/reopen retains the conversation, scrolling initializes motion, and delayed logo delivery causes no size shift.",
  );
} finally {
  await browser.close();
}
