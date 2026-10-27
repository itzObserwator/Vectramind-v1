import { chromium, expect } from "@playwright/test";
import { readFileSync, existsSync } from "node:fs";
const base = process.env.PREVIEW_URL || "http://127.0.0.1:3000";
const modules = [
  "fp-scheduler",
  "fp-kyp",
  "fp-consent-forms",
  "fp-flow",
  "fp-connect",
  "fp-engage",
  "fp-livecast",
  "fp-feedback",
  "fp-escalate",
];
const photos = JSON.parse(readFileSync("src/content/milestones.json", "utf8"));
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({ reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() =>
    localStorage.setItem("vectramind-notice", "dismissed"),
  );
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const slug of modules) {
      const response = await page.goto(`${base}/firstpass/${slug}/`, {
        waitUntil: "networkidle",
      });
      expect(response.status()).toBe(200);
      expect(
        (
          await page
            .locator(".inner-hero-art .platform-thumbnail")
            .boundingBox()
        ).height,
      ).toBeGreaterThan(120);
      await expect(page.locator("h1")).toContainText(slug.replaceAll("-", " "));
      await expect(
        page.locator(".module-detail-navigation [aria-current=page]"),
      ).toHaveCount(1);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${slug} ${width}px`,
      ).toBe(true);
      await expect(
        page.locator(".firstpass-module-page .inner-feature-grid").first(),
      ).toBeVisible();
      expect(await page.title()).toContain("Firstpass");
      if (width === 1440 && slug === "fp-consent-forms")
        await page.screenshot({
          path: "/tmp/vectramind-content-module-desktop.png",
        });
      if (width === 390 && slug === "fp-livecast")
        await page.screenshot({
          path: "/tmp/vectramind-content-module-mobile.png",
        });
    }
    console.log(
      `${width}px: all nine module pages load with working navigation and no overflow.`,
    );
  }
  await page.goto(`${base}/firstpass/`, { waitUntil: "networkidle" });
  for (let index = 0; index < modules.length; index++) {
    await page.getByRole("tab").nth(index).click();
    await expect(
      page.getByRole("tabpanel").getByRole("link").first(),
    ).toHaveAttribute("href", new RegExp(`/firstpass/${modules[index]}/?$`));
  }
  await page.getByRole("tabpanel").getByRole("link").first().click();
  await expect(page).toHaveURL(/\/firstpass\/fp-escalate\/?$/);
  await page
    .locator(".module-detail-navigation")
    .getByRole("link", { name: "fp flow", exact: true })
    .click();
  await expect(page.locator("h1")).toContainText("fp flow");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const revealed = page.locator(".inner-feature-grid h3").first();
  await revealed.scrollIntoViewIfNeeded();
  await expect(revealed).toHaveAttribute("data-scroll-reveal", "complete", {
    timeout: 7000,
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`${base}/synapse/`, { waitUntil: "networkidle" });
  await expect(page.getByRole("tab")).toHaveCount(11);
  for (const channel of [
    "Messenger",
    "Apple Messages",
    "Instagram",
    "Viber",
    "WeChat",
  ]) {
    await page.getByRole("tab", { name: channel, exact: true }).click();
    await expect(page.getByRole("tabpanel")).toContainText(channel);
  }
  for (const section of [
    "#customer-personalization",
    "#alert-manager",
    "#synapse-interface",
    ".published-integrations",
  ])
    await expect(page.locator(section)).toBeVisible();
  await expect(page.locator(".product-landing-metrics")).toContainText("2.8B");
  await page.goto(`${base}/about/`, { waitUntil: "networkidle" });
  await expect(page.locator(".about-story .product-metrics")).toContainText(
    "18+",
  );
  await expect(page.locator(".about-office").first()).toHaveAttribute(
    "href",
    /google.co.in\/maps\/place\/Vectramind/,
  );
  expect(photos).toHaveLength(40);
  for (const photo of photos)
    expect(existsSync(`public${photo.src}`)).toBe(true);
  const archive = page.locator(".milestone-archive");
  await expect(archive.locator("figure")).toHaveCount(6);
  await archive
    .getByRole("button", { name: "Global Health 2025", exact: true })
    .click();
  await archive
    .getByRole("button", { name: "Show more moments", exact: true })
    .click();
  await expect(archive.locator("figure")).toHaveCount(10);
  await expect(archive).toContainText("Showing 10 of 10 moments");
  await archive
    .getByRole("button", { name: "Saha & team moments", exact: true })
    .click();
  await expect(archive.locator("figure")).toHaveCount(6);
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.goto(`${base}/support/`, { waitUntil: "networkidle" });
  await page.getByLabel("Your name").fill("Content Review");
  await page.getByLabel("Work email").fill("review@example.test");
  await page
    .getByLabel("Phone number", { exact: true })
    .fill("+91 12345 67890");
  await page.getByRole("radio", { name: "Sales enquiry", exact: true }).check();
  await page.getByRole("combobox").selectOption("firstpass");
  await page
    .getByLabel("Your message")
    .fill("Please arrange a demonstration of the connected patient modules.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Prepare email" }).click();
  await expect(page.locator(".email-draft")).toContainText(
    "Phone: +91 12345 67890",
  );
  await expect(page.locator(".email-draft")).toContainText(
    "Enquiry type: Sales enquiry",
  );
  await expect(page.locator(".email-draft")).toContainText("Topic: firstpass");
  await expect(
    page.getByRole("link", { name: "Open email app", exact: true }),
  ).toHaveAttribute("href", /^mailto:/);
  for (const route of ["/privacy-policy/", "/terms-of-use/"]) {
    await page.goto(base + route, { waitUntil: "networkidle" });
    await expect(page.locator(".legal-document")).toBeVisible();
    await expect(
      page.locator(".legal-document script,.legal-document form"),
    ).toHaveCount(0);
  }
  expect(errors).toEqual([]);
  console.log(
    "Passed: expanded product coverage, module links/reveals, 40-photo archive and filters, exact office maps, enquiry categories/phone/email draft, published legal pages and browser errors.",
  );
} finally {
  await browser.close();
}
