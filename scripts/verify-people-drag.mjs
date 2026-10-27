import { chromium, expect } from "@playwright/test";
const base = process.env.PREVIEW_URL || "http://127.0.0.1:3001";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({
    reducedMotion: "reduce",
    hasTouch: true,
  });
  await page.addInitScript(() =>
    localStorage.setItem("vectramind-notice", "dismissed"),
  );
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${base}/about/`, { waitUntil: "networkidle" });
    const gallery = page.getByRole("region", {
      name: "Vectramind team photos",
    });
    await gallery.scrollIntoViewIfNeeded();
    const bounds = await gallery.boundingBox();
    const y = bounds.y + 100;
    const start = bounds.x + bounds.width * 0.9;
    const end = bounds.x + 10;
    await page.mouse.move(start, y);
    await page.mouse.down();
    await expect(gallery).toHaveAttribute("data-dragging", "true");
    await page.mouse.move(end, y, { steps: 12 });
    expect(await gallery.evaluate((el) => el.scrollLeft)).toBeGreaterThan(80);
    await expect(gallery).toHaveCSS("scroll-snap-type", "none");
    // Pointer capture keeps the drag alive when it leaves the photo strip.
    await page.mouse.move(end, y - 180, { steps: 3 });
    await page.mouse.up();
    await expect(gallery).not.toHaveAttribute("data-dragging", "true");
    await expect(gallery).toHaveCSS("cursor", "grab");
    await expect(
      page.getByRole("button", { name: "Previous team photo" }),
    ).toBeEnabled();
    await page.mouse.move(end, y);
    await page.mouse.down();
    await page.mouse.move(start, y, { steps: 12 });
    await page.mouse.up();
    await expect
      .poll(() => gallery.evaluate((el) => el.scrollLeft))
      .toBeLessThan(2);
    await expect(
      page.getByRole("button", { name: "Previous team photo" }),
    ).toBeDisabled();
    await gallery.focus();
    await gallery.press("End");
    await expect(
      page.getByRole("button", { name: "Next team photo" }),
    ).toBeDisabled();
    await page.getByRole("button", { name: "Previous team photo" }).click();
    await expect(
      page.getByRole("button", { name: "Next team photo" }),
    ).toBeEnabled();
    await gallery.focus();
    await gallery.press("Home");
    // Losing capture must restore snapping and the normal cursor.
    await gallery.evaluate((el) =>
      el.addEventListener(
        "pointerdown",
        (event) => {
          el.dataset.testPointer = String(event.pointerId);
        },
        { once: true },
      ),
    );
    await page.mouse.move(start, y);
    await page.mouse.down();
    await page.mouse.move(end, y, { steps: 5 });
    await gallery.evaluate((el) =>
      el.releasePointerCapture(Number(el.dataset.testPointer)),
    );
    await page.mouse.up();
    await expect(gallery).not.toHaveAttribute("data-dragging", "true");
    await expect(gallery).toHaveCSS("scroll-snap-type", "x mandatory");
    expect(await page.evaluate(() => getSelection()?.toString())).toBe("");
    expect(
      await gallery
        .locator("img")
        .evaluateAll((nodes) => nodes.every((el) => !el.draggable)),
    ).toBe(true);
    console.log(
      `${width}px: drag both ways, release outside, capture loss, snap restoration and arrow/keyboard synchronization passed`,
    );
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/about/`, { waitUntil: "networkidle" });
  const gallery = page.getByRole("region", { name: "Vectramind team photos" });
  await gallery.scrollIntoViewIfNeeded();
  const bounds = await gallery.boundingBox();
  const cdp = await page.context().newCDPSession(page);
  const swipe = async (x1, y1, x2, y2) => {
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: x1, y: y1 }],
    });
    for (let i = 1; i <= 12; i++)
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [
          { x: x1 + ((x2 - x1) * i) / 12, y: y1 + ((y2 - y1) * i) / 12 },
        ],
      });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
  };
  await swipe(
    bounds.x + bounds.width * 0.85,
    bounds.y + 100,
    bounds.x + 20,
    bounds.y + 100,
  );
  await expect
    .poll(() => gallery.evaluate((el) => el.scrollLeft))
    .toBeGreaterThan(50);
  await expect(gallery).not.toHaveAttribute("data-dragging", "true");
  const before = await page.evaluate(() => scrollY);
  await swipe(195, bounds.y + 150, 195, bounds.y + 50);
  await expect
    .poll(() => page.evaluate(() => scrollY))
    .toBeGreaterThan(before + 30);
  expect(errors).toEqual([]);
  console.log(
    "Native touch swiping and vertical page scrolling passed; no browser errors.",
  );
} finally {
  await browser.close();
}
