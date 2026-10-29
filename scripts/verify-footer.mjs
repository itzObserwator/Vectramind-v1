import { chromium, expect } from "@playwright/test";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  await page.addInitScript(() =>
    localStorage.setItem("vectramind-notice", "dismissed"),
  );
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const url = process.env.PREVIEW_URL || "http://127.0.0.1:3000";
  await page.goto(url, { waitUntil: "networkidle" });
  const footer = page.locator(".reference-footer");
  await expect(footer).toHaveCount(1);
  await expect(footer.locator("canvas")).toHaveCount(0);
  await expect(footer).toHaveAttribute("data-animate", "false");
  await expect(footer.locator(".footer-flow-pulse").first()).toHaveCSS(
    "animation-play-state",
    "paused",
  );
  await footer.evaluate((e) => scrollTo(0, e.offsetTop));
  await page.waitForTimeout(1800);
  await expect(footer).toHaveAttribute("data-animate", "true");
  await expect(footer.locator(".footer-contact-heading")).toHaveCSS(
    "opacity",
    "1",
  );
  for (const title of ["Email", "Phone", "Office"])
    await expect(
      footer.getByRole("heading", { name: title, exact: true }),
    ).toBeVisible();
  await expect(footer.locator(".footer-contact")).toHaveCount(3);
  const pulse = footer.locator(".footer-flow-pulse").first();
  await expect(pulse).toHaveCSS("animation-play-state", "running");
  const offset = await pulse.evaluate(
    (e) => getComputedStyle(e).strokeDashoffset,
  );
  await page.waitForTimeout(600);
  expect(
    await pulse.evaluate((e) => getComputedStyle(e).strokeDashoffset),
  ).not.toBe(offset);
  await expect(
    footer.getByRole("link", { name: "support@vectramind.com" }),
  ).toHaveAttribute("href", "mailto:support@vectramind.com");
  await expect(
    footer.getByRole("link", { name: "Request a call" }),
  ).toHaveAttribute("href", /^\/support\/?#contact-form$/);
  await expect(
    footer.getByRole("link", { name: "Explore our offices" }),
  ).toHaveAttribute("href", /^\/about\/?#about-locations-title$/);
  await expect(
    footer
      .getByRole("navigation", { name: "Footer navigation" })
      .getByRole("link"),
  ).toHaveCount(6);
  await page.screenshot({
    path: "/tmp/vectramind-reference-footer-desktop.png",
  });
  const email = footer.getByRole("textbox", { name: "Your email address" });
  await footer.getByRole("button", { name: "Join", exact: true }).click();
  expect(await email.evaluate((e) => e.validity.valueMissing)).toBe(true);
  await email.fill("invalid-email");
  await footer.getByRole("button", { name: "Join", exact: true }).click();
  expect(await email.evaluate((e) => e.validity.typeMismatch)).toBe(true);
  await email.fill("reviewer+footer@example.com");
  await footer.getByRole("button", { name: "Join", exact: true }).click();
  await expect(footer.getByRole("status")).toContainText("ready to review");
  const draft = new URL(
    await footer
      .getByRole("link", { name: "Review & send" })
      .getAttribute("href"),
  );
  expect(draft.protocol).toBe("mailto:");
  expect(draft.searchParams.get("body")).toContain(
    "reviewer+footer@example.com",
  );
  await footer.getByRole("button", { name: "Change email" }).click();
  await expect(email).toBeVisible();
  await footer.getByRole("link", { name: "Back to top ↑" }).click();
  await expect
    .poll(() => page.evaluate(() => scrollY), { timeout: 7000 })
    .toBeLessThan(5);
  await expect(footer).toHaveAttribute("data-animate", "false");
  await expect(pulse).toHaveCSS("animation-play-state", "paused");
  for (const width of [2560, 1920, 1024, 768, 650, 390, 320]) {
    await page.setViewportSize({ width, height: width > 1100 ? 1000 : 844 });
    await footer.evaluate((e) => scrollTo(0, e.offsetTop - 80));
    await page.waitForTimeout(1700);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `overflow ${width}`,
    ).toBe(true);
    for (const selector of [
      ".footer-contact-heading",
      ".footer-contact",
      ".footer-reference-brand",
      ".footer-join",
      ".footer-reference-legal",
    ]) {
      for (const element of await footer.locator(selector).all()) {
        const r = await element.boundingBox();
        expect(r.x, `${selector} ${width}`).toBeGreaterThanOrEqual(0);
        expect(r.x + r.width, `${selector} ${width}`).toBeLessThanOrEqual(
          width,
        );
      }
    }
    if (width === 390) {
      await page.screenshot({
        path: "/tmp/vectramind-reference-footer-mobile-top.png",
      });
      await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(300);
      await page.screenshot({
        path: "/tmp/vectramind-reference-footer-mobile-bottom.png",
      });
    }
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(200);
  await expect(pulse).toHaveCSS("animation-name", "none");
  await expect(footer.locator(".footer-flow-mist")).toHaveCSS(
    "animation-name",
    "none",
  );
  await expect(footer.locator(".footer-contact-heading")).toHaveCSS(
    "opacity",
    "1",
  );
  await page.goto(`${url}/about`, { waitUntil: "networkidle" });
  await expect(page.locator("footer")).toHaveCount(1);
  await expect(
    page.locator("footer").getByRole("heading", { name: "Get in touch." }),
  ).toBeVisible();
  expect(errors).toEqual([]);
  console.log(
    "Passed: contact/footer components, animated trail movement, visibility pause, valid reviewable Join request, links, back-to-top, 320–2560px bounds, reduced motion and shared-page footer.",
  );
} finally {
  await browser.close();
}
