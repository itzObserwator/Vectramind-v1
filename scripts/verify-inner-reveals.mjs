import { chromium, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
const base = process.env.PREVIEW_URL || "http://127.0.0.1:3001";
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
  "privacy-policy",
  "terms-of-use",
  ...posts.map((p) => `blog/${p.slug}`),
];
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() => {
    window.__hiddenHero = false;
    const observer = new MutationObserver(() => {
      const heading = document.querySelector(".inner-hero h1");
      if (heading && getComputedStyle(heading).opacity === "0")
        window.__hiddenHero = true;
    });
    observer.observe(document, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style"],
    });
  });
  for (const route of routes) {
    await page.goto(`${base}/${route}/`, { waitUntil: "networkidle" });
    if (route === "synapse") {
      expect(
        await page.evaluate(() => typeof window.gsap),
        "Synapse does not eagerly load the timeline engine",
      ).toBe("undefined");
    }
    const uncovered = await page
      .locator(".inner-page :is(h1,h2,h3,h4,h5,h6,p,figcaption)")
      .evaluateAll((es) =>
        es
          .filter(
            (e) =>
              e.textContent.trim() &&
              !e.closest('[aria-hidden="true"],.sr-only,[data-scroll-reveal]'),
          )
          .map((e) => e.textContent.trim().slice(0, 80)),
      );
    expect(uncovered, route).toEqual([]);
    expect(
      await page.evaluate(() => window.__hiddenHero),
      `${route}: hero stays visible during hydration`,
    ).toBe(false);
    const pending = page.locator('[data-scroll-reveal="pending"]').first();
    await pending.evaluate((e) => e.setAttribute("data-reveal-check", "true"));
    const target = page.locator("[data-reveal-check]");
    await expect(target).toHaveCSS("opacity", "0");
    await target.evaluate((e) =>
      scrollTo(0, e.getBoundingClientRect().top + scrollY - 180),
    );
    await expect(target).toHaveAttribute("data-scroll-reveal", "complete");
    await expect(target).toHaveCSS("opacity", "1");
  }
  await page.goto(`${base}/support/`, { waitUntil: "networkidle" });
  const faq = page.locator(".faq-list details").first();
  await faq.locator("summary").click();
  await expect(faq.locator("p")).toHaveCSS("opacity", "1");
  await page.goto(`${base}/blog/`, { waitUntil: "networkidle" });
  await page
    .getByRole("searchbox", { name: "Search insights" })
    .fill("no-matching-perspective-xyz");
  const empty = page.getByRole("heading", {
    name: "No matching perspectives.",
  });
  await empty.scrollIntoViewIfNeeded();
  await expect(empty).toHaveAttribute("data-scroll-reveal", "complete");
  await page.goto(`${base}/support/#contact-form`, { waitUntil: "networkidle" });
  const field = page.getByLabel("Your name");
  await field.evaluate((e) => e.focus());
  await expect(field.locator("..")).toHaveCSS("opacity", "1");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("[data-scroll-reveal]")).toHaveCount(0);
  await expect(page.locator(".support-page h1")).toHaveCSS("opacity", "1");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/about/`, { waitUntil: "networkidle" });
  const heading = page.locator("#about-story-title");
  await heading.scrollIntoViewIfNeeded();
  await expect(heading).toHaveAttribute("data-scroll-reveal", "complete");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.goto(base, { waitUntil: "networkidle" });
  await expect(
    page.locator(".experience-home [data-scroll-reveal]"),
  ).toHaveCount(0);
  expect(errors).toEqual([]);
  console.log(
    "Passed: all section headings, paragraphs and captions covered on 20 inner routes; scroll entry, FAQs, filtered content, focus visibility, live reduced motion, mobile and landing-page isolation.",
  );
} finally {
  await browser.close();
}
