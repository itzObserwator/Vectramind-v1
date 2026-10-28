import { chromium, expect } from "@playwright/test";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  for (const [width, height] of [
    [320, 667],
    [390, 844],
    [600, 390],
    [768, 1024],
    [900, 844],
  ]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(process.env.PREVIEW_URL || "http://127.0.0.1:3001", {
      waitUntil: "networkidle",
    });
    await page.keyboard.press("Escape");
    const section = page.locator(".reference-capabilities");
    const scroll = async (progress) => {
      await section.evaluate(
        (el, p) =>
          scrollTo(
            0,
            el.getBoundingClientRect().top +
              scrollY +
              (innerWidth >= 500 && innerHeight <= 500
                ? 0
                : Math.max(740 - innerHeight, 0)) +
              (el.offsetHeight -
                innerHeight -
                (innerWidth >= 500 && innerHeight <= 500
                  ? 0
                  : Math.max(740 - innerHeight, 0))) *
                p,
          ),
        progress,
      );
    };
    await scroll(0.1);
    const visual = section.locator(".capability-visual");
    const titles =
      width <= 600
        ? [
            "Smarter decisions.",
            "Designed around people.",
            "Systems, connected.",
          ]
        : [
            "Smarter decisions. Greater possibilities.",
            "Human experiences, thoughtfully connected.",
            "Bridge the gaps. Move forward together.",
          ];
    await expect(visual).toHaveAttribute("data-active", "0");
    for (const [progress, chapter] of [
      [0.1, 0],
      [0.5, 1],
      [0.88, 2],
      [0.5, 1],
      [0.1, 0],
    ]) {
      await scroll(progress);
      await expect(visual).toHaveAttribute("data-active", String(chapter));
      await expect(section.locator("h3 > span:visible")).toHaveText(
        titles[chapter],
      );
      await expect(
        section.locator(`.capability-visual-stage-${chapter}`),
      ).toHaveAttribute("data-flow", "running");
      await expect(section.locator(".experience-capability-sticky")).toHaveCSS(
        "position",
        "sticky",
      );
      const bounds = await section.locator(".capability-explore").boundingBox();
      expect(
        bounds.y + bounds.height,
        `Explore CTA stays in view at ${width}x${height}`,
      ).toBeLessThanOrEqual(height + 1);
    }
    const shelf = section
      .locator('.capability-visual-stage-1 [data-geometry="plate"]')
      .first();
    await scroll(0.35);
    await expect(visual).toHaveAttribute("data-active", "1");
    await page.waitForTimeout(1100);
    const earlyShelf = await shelf.getAttribute("d");
    await page.waitForTimeout(700);
    expect(await shelf.getAttribute("d"), "02 holds without scrolling").toBe(
      earlyShelf,
    );
    await scroll(0.55);
    await expect.poll(() => shelf.getAttribute("d")).not.toBe(earlyShelf);
    await scroll(0.35);
    await expect.poll(() => shelf.getAttribute("d")).toBe(earlyShelf);
    const route = section.locator(
      '.capability-visual-stage-2 [data-connection="0"] .integration-route',
    );
    await scroll(0.77);
    await expect(visual).toHaveAttribute("data-active", "2");
    await expect(route).toHaveCSS("stroke-dashoffset", "1px");
    await page.waitForTimeout(700);
    await expect(
      route,
      "03 does not draw itself while scrolling is stopped",
    ).toHaveCSS("stroke-dashoffset", "1px");
    await scroll(1);
    await expect(route).toHaveCSS("stroke-dashoffset", "0px");
    await expect
      .poll(() =>
        section.locator(".integration-chip-body").evaluateAll((nodes) =>
          nodes.every((node) => {
            const matrix = node.transform.baseVal.consolidate()?.matrix;
            return !matrix || (matrix.a > 0.99 && matrix.d > 0.99);
          }),
        ),
      )
      .toBe(true);
    await scroll(0.77);
    await expect(
      route,
      "03 reverses its connections with reverse scrolling",
    ).toHaveCSS("stroke-dashoffset", "1px");
    await scroll(0.1);
    await expect(visual).toHaveAttribute("data-active", "0");
    await section
      .getByRole("button", { name: "Next capability", exact: true })
      .click();
    await expect(visual).toHaveAttribute("data-active", "1");
    await expect(section.locator("h3 > span:visible")).toHaveText(titles[1]);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (width === 390 || width === 600)
      await page.screenshot({
        path: `/tmp/vectramind-capabilities-${width}-scroll.png`,
      });
    console.log(
      `${width}x${height}: chapters, 02/03 scrubbed builds, stationary holds, reverse scrolling, shortcuts and viewport bounds passed`,
    );
    await page.close();
  }
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(process.env.PREVIEW_URL || "http://127.0.0.1:3001", {
    waitUntil: "networkidle",
  });
  const section = page.locator(".reference-capabilities");
  await section.scrollIntoViewIfNeeded();
  await expect(section.locator(".experience-capability-sticky")).toHaveCSS(
    "position",
    "relative",
  );
  await section
    .getByRole("button", { name: "Next capability", exact: true })
    .click();
  await expect(section.locator(".capability-visual")).toHaveAttribute(
    "data-active",
    "1",
  );
  console.log(
    "Reduced motion: no pinned scrolling; manual chapter navigation passed.",
  );
} finally {
  await browser.close();
}
