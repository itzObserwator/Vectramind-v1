import { chromium, expect } from "@playwright/test";
const base = process.env.PREVIEW_URL || "http://127.0.0.1:3001";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors = [];
try {
  const context = await browser.newContext();
  await context.addInitScript(() => {
    localStorage.setItem("vectramind-notice", "dismissed");
    window.__curtainPhases = [];
    new MutationObserver((records) => {
      for (const record of records)
        if (
          record.target instanceof Element &&
          record.target.matches(".page-curtain")
        )
          window.__curtainPhases.push({
            phase: record.target.getAttribute("data-phase"),
            time: performance.now(),
            y: record.target.getBoundingClientRect().y,
            height: record.target.getBoundingClientRect().height,
            background: getComputedStyle(record.target).backgroundColor,
            duration: getComputedStyle(record.target).animationDuration,
            headingAnimation: document.querySelector("main h1")
              ? getComputedStyle(document.querySelector("main h1"))
                  .animationName
              : "",
            headerAnimation: document.querySelector(".header")
              ? getComputedStyle(document.querySelector(".header"))
                  .animationName
              : "",
            images: [
              ...document.querySelectorAll("[data-page-image-reveal]"),
            ].map((element) => getComputedStyle(element).animationName),
          });
    }).observe(document, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-phase"],
    });
  });
  const page = await context.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(base, { waitUntil: "networkidle" });
    await page.keyboard.press("Escape");
    const curtain = page.locator(".page-curtain");
    for (const [name, path] of [
      ["Synapse", "/synapse"],
      ["Firstpass", "/firstpass"],
      ["Capabilities", "/capabilities"],
      ["About us", "/about"],
      ["Support", "/support"],
    ]) {
      await expect(curtain).toHaveAttribute("data-phase", "idle");
      const before = new URL(page.url()).pathname;
      await page.evaluate(() => {
        window.__curtainPhases = [];
      });
      if (width <= 900)
        await page.getByRole("button", { name: "Open menu" }).click();
      await page
        .getByRole("navigation", {
          name: width <= 900 ? "Mobile navigation" : "Main navigation",
        })
        .getByRole("link", { name, exact: true })
        .click();
      await expect(curtain).toHaveAttribute("data-phase", "covering");
      expect(new URL(page.url()).pathname).toBe(before);
      await expect(curtain).toHaveCSS("animation-duration", "0.6s");
      const coverStart = await curtain.boundingBox();
      expect(coverStart.y).toBeGreaterThan(0);
      await expect(page).toHaveURL(new RegExp(`${path}/?$`));
      await expect(curtain).toHaveAttribute("data-phase", "idle");
      await expect(page.locator("html")).not.toHaveAttribute(
        "data-page-arriving",
        "",
      );
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      const phases = await page.evaluate(() => window.__curtainPhases);
      expect(phases.map((item) => item.phase)).toEqual([
        "covering",
        "waiting",
        "revealing",
        "idle",
      ]);
      expect(phases[0].duration).toBe("0.6s");
      expect(phases[1].y).toBe(0);
      expect(phases[1].height).toBe(1000);
      expect(phases[1].background).toBe("rgb(255, 255, 255)");
      expect(phases[2].duration).toBe("0.65s");
      expect(phases[2].headingAnimation).toBe("page-content-reveal");
      expect(phases[2].headerAnimation).toBe("page-navigation-reveal");
      if (name === "About us" && width === 1440)
        expect(phases[2].images).toContain("page-image-reveal");
      expect(phases[1].time - phases[0].time).toBeGreaterThanOrEqual(550);
      expect(phases[2].time - phases[1].time).toBeGreaterThanOrEqual(270);
      expect(phases[3].time - phases[2].time).toBeGreaterThanOrEqual(600);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    await page.goBack();
    await expect(page).toHaveURL(/\/about\/?$/);
    await expect(curtain).toHaveAttribute("data-phase", "idle");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await page.goForward();
    await expect(page).toHaveURL(/\/support\/?$/);
    await expect(curtain).toHaveAttribute("data-phase", "idle");
    await page.evaluate(() => {
      window.__curtainPhases = [];
    });
    await page
      .getByRole("link", { name: "Find an answer", exact: true })
      .click();
    await expect(page).toHaveURL(/#support-answers$/);
    await expect(page.getByRole("searchbox")).toBeInViewport();
    expect(await page.evaluate(() => window.__curtainPhases)).toEqual([]);
    console.log(
      `${width}px: five cover/hold/uncover sequences, skewed content arrival, history and same-page anchors passed`,
    );
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${base}/firstpass/`, { waitUntil: "networkidle" });
  await page.keyboard.press("Escape");
  await page.locator(".module-panel .text-link").first().click();
  await expect(page).toHaveURL(/\/firstpass\/fp-scheduler\/?$/);
  await expect(page.locator(".page-curtain")).toHaveAttribute(
    "data-phase",
    "idle",
  );
  await expect(page.locator(".firstpass-module-page h1")).toBeVisible();
  await page
    .locator(".header")
    .getByRole("link", { name: "Vectramind home", exact: true })
    .click();
  await expect(page).toHaveURL(new RegExp(`${base}/?$`));
  await expect(page.locator(".page-curtain")).toHaveAttribute(
    "data-phase",
    "idle",
  );
  await expect(page.locator(".experience-home h1")).toBeVisible();
  await page
    .locator("footer")
    .getByRole("link", { name: "Privacy policy", exact: true })
    .last()
    .click();
  await expect(page).toHaveURL(/\/privacy-policy\/?$/);
  await expect(page.locator(".page-curtain")).toHaveAttribute(
    "data-phase",
    "idle",
  );
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  console.log(
    "Nested module routes, homepage arrival and footer-to-legal navigation passed.",
  );
  await page
    .locator("footer")
    .getByRole("link", { name: "Insights", exact: true })
    .click();
  await expect(page).toHaveURL(/\/blog\/?$/);
  await expect(page.locator(".page-curtain")).toHaveAttribute(
    "data-phase",
    "idle",
  );
  await page.locator(".insight-copy h2 a").first().click();
  await expect(page).toHaveURL(/\/blog\/[^/]+\/?$/);
  await expect(page.locator(".page-curtain")).toHaveAttribute(
    "data-phase",
    "idle",
  );
  await expect(page.locator(".article-header h1")).toBeVisible();
  await expect(page.locator(".article-cover img")).toBeVisible();
  console.log(
    "Insights and article navigation retain the same curtain and content arrival.",
  );

  const slow = await context.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  let release;
  const gate = new Promise((resolve) => (release = resolve));
  await slow.route("**/about/**", async (route) => {
    await gate;
    await route.continue();
  });
  await slow.goto(`${base}/support/`, { waitUntil: "domcontentloaded" });
  await slow.keyboard.press("Escape");
  await expect(slow.locator("#support-title")).toBeVisible();
  await slow
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "About us", exact: true })
    .click();
  await expect(slow.locator(".page-curtain")).toHaveAttribute(
    "data-phase",
    "waiting",
  );
  await slow.waitForTimeout(700);
  await expect(slow.locator(".page-curtain")).toHaveAttribute(
    "data-phase",
    "waiting",
  );
  release();
  await expect(slow).toHaveURL(/\/about\/?$/);
  await expect(slow.locator(".page-curtain")).toHaveAttribute(
    "data-phase",
    "idle",
  );
  await expect(slow.locator("#about-title")).toBeVisible();
  await slow.close();
  console.log("A delayed route remains covered until its content is ready.");
  const reduced = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  await reduced.goto(base, { waitUntil: "networkidle" });
  await reduced.keyboard.press("Escape");
  await reduced
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Support", exact: true })
    .click();
  await expect(reduced).toHaveURL(/\/support\/?$/);
  await expect(reduced.locator(".page-curtain")).toBeHidden();
  await expect(reduced.locator("#support-title")).toBeVisible();
  expect(errors).toEqual([]);
  console.log("Reduced motion skips the curtain; no browser errors.");
} finally {
  await browser.close();
}
