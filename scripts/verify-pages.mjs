import { chromium, expect } from "@playwright/test";
import { mkdir, readFile } from "node:fs/promises";
const base = process.env.PREVIEW_URL || "http://127.0.0.1:3001";
const shots = "/tmp/vectramind-pages-qa";
await mkdir(shots, { recursive: true });
const posts = JSON.parse(
  await readFile(
    new URL("../src/content/imported/post-summaries.json", import.meta.url),
    "utf8",
  ),
);
const routes = [
  "synapse",
  "firstpass",
  "capabilities",
  "about",
  "careers",
  "support",
  "blog",
  "terms-of-use",
  "privacy-policy",
];
const errors = [];
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
for (const route of routes) {
  const response = await page.goto(`${base}/${route}/`, {
    waitUntil: "networkidle",
  });
  expect(response.status(), route).toBe(200);
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator(".header")).toHaveCount(1);
  await expect(page.locator("footer")).toHaveCount(1);
  await page.waitForTimeout(1000);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    route,
  ).toBeTruthy();
  await page.screenshot({ path: `${shots}/desktop-${route}.png` });
  await page.locator("img").evaluateAll(async (images) =>
    Promise.all(
      images.map((img) => {
        img.loading = "eager";
        return img.decode().catch(() => {});
      }),
    ),
  );
  expect(
    await page
      .locator("img")
      .evaluateAll((images) =>
        images.filter((img) => !img.naturalWidth).map((img) => img.src),
      ),
    route,
  ).toEqual([]);
}
for (const post of posts) {
  const response = await page.goto(`${base}/blog/${post.slug}/`, {
    waitUntil: "networkidle",
  });
  expect(response.status(), post.slug).toBe(200);
  await expect(page.locator("h1")).toHaveText(post.title);
  expect(await page.locator(".article-body").textContent()).not.toContain(
    "<script",
  );
  expect(await page.locator(".article-body").textContent()).toBeTruthy();
}
await page.screenshot({ path: `${shots}/desktop-article.png` });
await page.goto(`${base}/synapse/`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: "Next success story" }).click();
await expect(page.locator(".case-story h3")).toHaveText(
  "Built for the pace of every transaction.",
);
await expect(page.locator(".case-counter")).toHaveText("02 / 03");
await page.getByRole("button", { name: "Previous success story" }).click();
await expect(page.locator(".case-story h3")).toHaveText(
  "A more connected patient journey.",
);
await page.emulateMedia({ reducedMotion: "reduce" });
await expect(page.locator(".case-story-content")).toHaveCSS(
  "animation-name",
  "none",
);
await page.emulateMedia({ reducedMotion: "no-preference" });
await page.goto(`${base}/firstpass/`, { waitUntil: "networkidle" });
await page.getByRole("tab", { name: "fp engage", exact: true }).click();
await expect(page.getByRole("tabpanel")).toContainText(
  "Patient communications",
);
await page
  .getByRole("tab", { name: "fp engage", exact: true })
  .press("ArrowRight");
await expect(
  page.getByRole("tab", { name: "fp livecast", exact: true }),
).toBeFocused();
await expect(page.getByRole("tabpanel")).toContainText("Real-time governance");
await page.goto(`${base}/support/`, { waitUntil: "networkidle" });
await page.getByRole("searchbox").fill("Maker Checker");
await expect(page.locator(".faq-list details")).toHaveCount(1);
await page.locator(".faq-list summary").click();
await expect(page.locator(".faq-list details")).toHaveAttribute("open", "");
await page.getByRole("searchbox").fill("no-result-for-this");
await expect(page.locator(".empty-results")).toBeVisible();
await page.goto(`${base}/blog/`, { waitUntil: "networkidle" });
await page
  .getByRole("searchbox", { name: "Search insights" })
  .fill("patient journey");
await expect(page.locator(".insights-grid article")).toHaveCount(1);
await page.getByRole("searchbox").fill("no-matching-article");
await expect(
  page.getByRole("heading", { name: "No matching perspectives." }),
).toBeVisible();
await page.getByRole("button", { name: "Show all insights" }).click();
await expect(page.locator(".insights-grid article")).toHaveCount(10);
await page
  .getByRole("combobox", { name: "Filter insights by topic" })
  .selectOption("AI");
await expect(page.locator(".insights-grid article")).toHaveCount(1);
await page.goto(`${base}/contact/?topic=firstpass`, {
  waitUntil: "networkidle",
});
await expect(page.getByRole("combobox")).toHaveValue("firstpass");
await page.getByLabel("Your name").fill("Preview Tester");
await page.getByLabel("Work email").fill("preview@example.com");
await page.getByLabel("Organization").fill("Example organization");
await page
  .getByLabel("Your message")
  .fill("Please arrange a Firstpass demonstration for our team.");
await page.getByRole("checkbox").check();
await page.getByRole("button", { name: "Prepare email" }).click();
await expect(
  page.getByRole("heading", { name: "Your email is ready." }),
).toBeVisible();
await expect(
  page.getByRole("link", { name: "Open email app" }),
).toHaveAttribute("href", /^mailto:support@vectramind\.com\?/);
await expect(page.locator(".email-draft pre")).toContainText(
  "Topic: firstpass",
);
await page.screenshot({ path: `${shots}/desktop-email-draft.png` });
// Exercise client navigation through the shared shell and verify animation cleanup.
await page
  .getByRole("navigation", { name: "Main navigation" })
  .getByRole("link", { name: "About us" })
  .click();
await expect(page).toHaveURL(/\/about\/?$/);
await expect(page.locator("h1")).toContainText("With you");
await page.getByRole("link", { name: "Explore life at Vectramind" }).click();
await expect(page).toHaveURL(/\/careers\/?$/);
await expect(page.locator(".header")).toHaveCount(1);
await expect(page.locator("h1")).toContainText("Open minds");
const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  isMobile: true,
});
mobile.on("pageerror", (e) => errors.push(e.message));
for (const route of [...routes, `blog/${posts[0].slug}`]) {
  await mobile.goto(`${base}/${route}/`, { waitUntil: "networkidle" });
  await mobile.waitForTimeout(1000);
  expect(
    await mobile.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    route,
  ).toBeTruthy();
  await mobile.screenshot({
    path: `${shots}/mobile-${route.split("/")[0]}.png`,
  });
}
await mobile.goto(`${base}/synapse/`, { waitUntil: "networkidle" });
await mobile.getByRole("button", { name: "Open menu" }).click();
await mobile
  .getByRole("navigation", { name: "Mobile navigation" })
  .getByRole("link", { name: "Firstpass", exact: true })
  .click();
await expect(mobile).toHaveURL(/\/firstpass\/?$/);
await expect(
  mobile.getByRole("navigation", { name: "Mobile navigation" }),
).not.toBeVisible();
await expect(mobile.locator("h1")).toHaveText("Your care.Connected.");
expect(errors).toEqual([]);
await browser.close();
console.log(
  "Passed: 10 inner pages, 10 article routes, desktop/mobile screenshots, asset loading, product tabs + keyboard controls, FAQ search, blog filters, email draft, and client navigation. No browser errors.",
);
