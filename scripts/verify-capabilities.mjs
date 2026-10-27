import { chromium, expect } from "@playwright/test";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(process.env.PREVIEW_URL || "http://127.0.0.1:3000", {
    waitUntil: "networkidle",
  });
  const track = page.locator(".reference-capabilities");
  await expect(track.locator("canvas")).toHaveCount(0);
  // On the landing page the showcase starts far below the fold. The dedicated
  // capabilities route places it close enough to preload its SVG immediately.
  if (new URL(page.url()).pathname === "/")
    await expect(track.locator(".capability-visual-stage")).toHaveCount(0);
  await track.scrollIntoViewIfNeeded();
  await expect(track.locator(".capability-visual-stage")).toHaveCount(3);
  await expect(
    track.locator(".capability-intelligence-grid .capability-signal"),
  ).toHaveCount(22);
  const headingPositions = [];
  async function scrub(progress) {
    await track.evaluate(
      (el, p) =>
        scrollTo(
          0,
          el.getBoundingClientRect().top +
            scrollY +
            (el.offsetHeight - innerHeight) * p,
        ),
      progress,
    );
    await page.waitForTimeout(1100);
  }
  const titles = [
    "Smarter decisions. Greater possibilities.",
    "Human experiences, thoughtfully connected.",
    "Bridge the gaps. Move forward together.",
  ];
  for (const chapter of [0, 1, 2, 1, 0]) {
    await scrub([0.12, 0.49, 0.86][chapter]);
    await expect(track.locator("h3 .capability-copy-full")).toHaveText(
      titles[chapter],
    );
    await expect(
      track.locator(`.capability-visual-stage-${chapter}`),
    ).toHaveCSS("opacity", "1");
    const index = await track
      .locator(".capability-number-reel > span")
      .nth(chapter)
      .boundingBox();
    const window = await track
      .locator(".capability-number-window")
      .boundingBox();
    expect(
      Math.abs(index.y - window.y),
      "The visible index must match the artwork",
    ).toBeLessThan(2);
    if (chapter === 0) {
      const heading = await track.locator("h2").boundingBox();
      const crest = await track
        .locator(".capability-fin")
        .evaluateAll((nodes) =>
          Math.min(
            ...nodes
              .filter((el) => Number(getComputedStyle(el).opacity) > 0.05)
              .map((el) => el.getBoundingClientRect().top),
          ),
        );
      expect(
        crest,
        "The moving crest stays clear of the heading",
      ).toBeGreaterThan(heading.y + heading.height + 20);
    }
    headingPositions.push((await track.locator("h2").boundingBox()).y);
    await page.screenshot({
      path: `/tmp/vectramind-capability-${chapter + 1}.png`,
    });
  }
  expect(
    Math.max(...headingPositions) - Math.min(...headingPositions),
  ).toBeLessThan(2);
  await scrub(0.03);
  const fin = track
    .locator('.capability-fin[data-panel-index="12"]')
    .locator('[data-geometry="fin"]');
  const initial = await fin.getAttribute("d");
  await scrub(0.22);
  expect(await fin.getAttribute("d")).not.toBe(initial);
  await scrub(0.12);
  const heldFin = await fin.getAttribute("d");
  await scrub(0.21);
  expect(
    await fin.getAttribute("d"),
    "Individual panels circulate along the held track",
  ).not.toBe(heldFin);
  await expect(track.locator('[data-geometry="fin-edge"]')).toHaveCount(42);
  await expect(track.locator('[data-geometry="fin-highlight"]')).toHaveCount(
    42,
  );
  const firstScene = track.locator(".capability-visual-stage-0");
  const flow = firstScene.locator(".capability-signal").first();
  await expect(firstScene).toHaveAttribute("data-flow", "running");
  const beforeFlow = await flow.evaluate((el) =>
    parseFloat(getComputedStyle(el).strokeDashoffset),
  );
  const mist = firstScene.locator(".capability-intelligence-mist");
  const mistBefore = await mist.evaluate(
    (el) => getComputedStyle(el).transform,
  );
  const panelBefore = await fin.getAttribute("d");
  const panelRatio = await firstScene
    .locator('[data-geometry="fin"]')
    .evaluateAll((nodes) => {
      const crest = nodes
        .map((el) => el.getBBox())
        .sort((a, b) => a.y - b.y)[0];
      return crest.height / crest.width;
    });
  expect(panelRatio, "The crest uses broad rectangular faces").toBeGreaterThan(
    2,
  );
  expect(panelRatio).toBeLessThan(4);

  const movingId = await firstScene
    .locator(".capability-fin")
    .evaluateAll((nodes) => {
      const visible = nodes.find((el) => {
        const box = el.getBoundingClientRect();
        return (
          Number(getComputedStyle(el).opacity) > 0.9 &&
          box.x > innerWidth * 0.4 &&
          box.x < innerWidth * 0.6
        );
      });
      return visible?.dataset.panelIndex;
    });
  expect(movingId).toBeDefined();
  const movingPanel = firstScene.locator(`[data-panel-index="${movingId}"]`);
  const movingBefore = await movingPanel.boundingBox();
  const paintOrder = await firstScene
    .locator(".capability-fin")
    .evaluateAll((nodes) =>
      nodes
        .filter((el) => Number(getComputedStyle(el).opacity) > 0.05)
        .map((el) => el.getBoundingClientRect().x),
    );
  for (let i = 1; i < paintOrder.length; i++)
    expect(
      paintOrder[i],
      "Left foreground panels must paint over right background panels",
    ).toBeLessThanOrEqual(paintOrder[i - 1] + 1);
  const restingScroll = await page.evaluate(() => scrollY);
  await page.waitForTimeout(350);
  const afterFlow = await flow.evaluate((el) =>
    parseFloat(getComputedStyle(el).strokeDashoffset),
  );
  expect(
    Math.abs(afterFlow - beforeFlow),
    "The light flow continues while scrolling is stopped",
  ).toBeGreaterThan(3);
  expect(await page.evaluate(() => scrollY)).toBe(restingScroll);
  expect(
    (await movingPanel.boundingBox()).x,
    "Visible panels travel from left to right",
  ).toBeGreaterThan(movingBefore.x + 3);
  expect(
    await fin.getAttribute("d"),
    "Panels circulate while scrolling is stopped",
  ).not.toBe(panelBefore);
  expect(
    await mist.evaluate((el) => getComputedStyle(el).transform),
    "Foreground mist drifts while scrolling is stopped",
  ).not.toBe(mistBefore);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(firstScene).toHaveAttribute("data-flow", "paused");
  await page.evaluate(() => {
    Reflect.deleteProperty(document, "hidden");
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(firstScene).toHaveAttribute("data-flow", "running");

  await expect(track.locator(".capability-integration-map")).toHaveCount(1);
  await scrub(0.2525);
  const firstShelf = track.locator('[data-geometry="plate"][data-index="0"]');
  const firstCircuit = track
    .locator('[data-geometry="plate-signal"][data-index="0"]')
    .first();
  expect(
    await firstShelf.evaluate((el) => Number(getComputedStyle(el).opacity)),
    "The illuminated scaffold appears before the solid shelves",
  ).toBeLessThan(0.1);
  expect(
    await firstCircuit.evaluate((el) => Number(getComputedStyle(el).opacity)),
  ).toBeGreaterThan(0.9);
  await scrub(0.33);
  expect(
    await firstShelf.evaluate((el) => Number(getComputedStyle(el).opacity)),
    "The broad shelves emerge as the entrance turns toward the viewer",
  ).toBeGreaterThan(0.9);
  await expect(firstScene).toHaveAttribute("data-flow", "paused");
  const pausedPanel = await fin.getAttribute("d");
  const pausedFlow = await flow.evaluate(
    (el) => getComputedStyle(el).strokeDashoffset,
  );
  await page.waitForTimeout(180);
  expect(
    await flow.evaluate((el) => getComputedStyle(el).strokeDashoffset),
  ).toBe(pausedFlow);
  expect(await fin.getAttribute("d"), "Panels pause after leaving 01").toBe(
    pausedPanel,
  );
  const plate = track.locator('[data-geometry="plate"]').first();
  const plateBefore = await plate.getAttribute("d");
  const connectedScene = track.locator(".capability-visual-stage-1");
  const circuit = connectedScene
    .locator('.capability-signal[data-geometry="plate-signal"]')
    .last();
  await expect(connectedScene).toHaveAttribute("data-flow", "running");
  const circuitBefore = await circuit.evaluate(
    (el) => getComputedStyle(el).strokeDashoffset,
  );
  await page.waitForTimeout(250);
  expect(
    await circuit.evaluate((el) => getComputedStyle(el).strokeDashoffset),
    "The connected circuits keep flowing while the camera rests",
  ).not.toBe(circuitBefore);
  expect(
    await plate.getAttribute("d"),
    "The layer camera holds its position when scrolling stops",
  ).toBe(plateBefore);
  await scrub(0.66);
  await expect(track.locator("h3 .capability-copy-full")).toHaveText(titles[1]);
  expect(
    await plate.getAttribute("d"),
    "The camera must turn around the layers within the held middle chapter",
  ).not.toBe(plateBefore);
  const circuitSpan = () =>
    connectedScene
      .locator('[data-geometry="plate-signal"]')
      .evaluateAll((nodes) => {
        const centers = nodes.map((node) => {
          const rect = node.getBoundingClientRect();
          return rect.y + rect.height / 2;
        });
        return Math.max(...centers) - Math.min(...centers);
      });
  await scrub(0.37);
  const openCircuitSpan = await circuitSpan();
  await scrub(0.54);
  expect(
    await circuitSpan(),
    "The illuminated circuits gather before the outer shelves close",
  ).toBeLessThan(openCircuitSpan * 0.5);
  await scrub(0.37);
  expect(
    Math.abs((await circuitSpan()) - openCircuitSpan),
    "Reverse scrolling opens the same circuit arrangement",
  ).toBeLessThan(2);
  await scrub(0.6);
  const shelves = track.locator('[data-geometry="plate"]');
  const pressed = await shelves.evaluateAll((nodes) =>
    nodes.map((el) => ({
      d: el.getAttribute("d"),
      opacity: Number(getComputedStyle(el).opacity),
      center:
        el.getBoundingClientRect().y + el.getBoundingClientRect().height / 2,
    })),
  );
  expect(
    new Set(pressed.map((plate) => plate.d)).size,
    "The press must collapse all shelves onto one plate",
  ).toBe(1);
  expect(
    pressed.filter((plate) => plate.opacity > 0.05).length,
    "Only one material face is visible during the pressed hold",
  ).toBe(1);
  await scrub(0.69);
  const risen = await shelves.evaluateAll((nodes) =>
    nodes.map((el) => ({
      center:
        el.getBoundingClientRect().y + el.getBoundingClientRect().height / 2,
      opacity: Number(getComputedStyle(el).opacity),
    })),
  );
  expect(
    Math.max(...risen.map((plate) => plate.center)) -
      Math.min(...risen.map((plate) => plate.center)),
    "The single plate expands into a separated stack",
  ).toBeGreaterThan(100);
  expect(
    Math.min(...risen.map((plate) => plate.center)),
    "The new stack grows upward from the press",
  ).toBeLessThan(pressed[0].center - 100);
  expect(risen.filter((plate) => plate.opacity > 0.9).length).toBe(6);
  await scrub(0.6);
  expect(
    await shelves.first().getAttribute("d"),
    "Reverse scroll returns to the same single pressed plate",
  ).toBe(pressed[0].d);
  // The shelves physically converge, then the same surface flattens into 03's chip.
  await scrub(0.725);
  const compressedSpread = await shelves.evaluateAll((nodes) => {
    const ys = nodes.map((el) => {
      const r = el.getBoundingClientRect();
      return r.y + r.height / 2;
    });
    return Math.max(...ys) - Math.min(...ys);
  });
  expect(
    compressedSpread,
    "The rising stack presses back into one plate",
  ).toBeLessThan(60);
  await scrub(0.75);
  const morph = track.locator(".capability-stack-chip");
  await expect(morph).toHaveCSS("opacity", "1");
  const turningPlate = await morph.locator("path").first().getAttribute("d");
  await expect(track.locator(".integration-hub-surface")).toHaveCSS(
    "opacity",
    "0",
  );
  await scrub(0.78);
  expect(
    await morph.locator("path").first().getAttribute("d"),
    "Isometric surface flattens and moves into the integration hub",
  ).not.toBe(turningPlate);
  await scrub(0.795);
  await expect(morph).toHaveCSS("opacity", "0");
  await expect(track.locator(".integration-hub-surface")).toHaveCSS(
    "opacity",
    "1",
  );
  await scrub(0.75);
  expect(
    await morph.locator("path").first().getAttribute("d"),
    "Reverse scrolling restores the same intermediate surface",
  ).toBe(turningPlate);
  // Section 02's stack fades completely before the integration diagram resolves.
  await scrub(0.75);
  await expect(connectedScene).toHaveAttribute("data-flow", "paused");
  await expect(connectedScene).toHaveCSS("opacity", "0");
  const systemScene = track.locator(".capability-visual-stage-2");
  await expect(systemScene.locator("[data-column-index]")).toHaveCount(0);
  await expect(systemScene.locator(".integration-system-card")).toHaveCount(4);
  await expect(systemScene.locator(".integration-hub image")).toHaveAttribute(
    "href",
    "/images/vectramind-logo.svg",
  );
  // Every route is visible and pulsing before its endpoint chip unfolds.
  for (const [step, index] of [0, 2, 3, 1, 4].entries()) {
    const start = 3.18 + step * 0.16;
    await scrub((start + 0.04) / 4);
    const connection = systemScene.locator(`[data-connection="${index}"]`);
    const routeOffset = await connection
      .locator(".integration-route")
      .evaluate((el) => parseFloat(getComputedStyle(el).strokeDashoffset));
    expect(routeOffset).toBeGreaterThan(0.1);
    expect(routeOffset).toBeLessThan(0.9);
    await expect(connection.locator(".integration-leading-pulse")).toHaveCSS(
      "opacity",
      "1",
    );
    const body = systemScene.locator(".integration-chip-body").nth(index);
    const before = await body.boundingBox();
    expect(
      index === 4 ? before.height : before.width,
      "Chip remains closed while the pulse connects",
    ).toBeLessThan(1);
    await scrub((start + 0.15) / 4);
    const after = await body.boundingBox();
    expect(
      index === 4 ? after.height : after.width,
      "Chip unfolds after the connection arrives",
    ).toBeGreaterThan(20);
    await expect(body).toHaveCSS("opacity", "1");
  }
  await scrub(0.83);
  await expect(track.locator("h3 .capability-copy-full")).toHaveText(titles[2]);
  await expect(systemScene).toHaveAttribute("data-flow", "running");
  const firstCard = systemScene.locator(".integration-system-card").first();
  const earlyWidth = (
    await firstCard.locator(".integration-chip-body").boundingBox()
  ).width;
  expect(earlyWidth).toBeGreaterThan(20);
  expect(
    (
      await systemScene
        .locator(".integration-infrastructure .integration-chip-body")
        .boundingBox()
    ).height,
  ).toBeLessThan(1);
  await firstScene.evaluate((el) => {
    window.capabilityHiddenWrites = 0;
    window.capabilityHiddenObserver = new MutationObserver((records) => {
      window.capabilityHiddenWrites += records.length;
    });
    window.capabilityHiddenObserver.observe(el, {
      subtree: true,
      attributes: true,
      attributeFilter: ["d"],
    });
  });
  await scrub(0.999);
  expect(
    await page.evaluate(() => {
      window.capabilityHiddenObserver.disconnect();
      return window.capabilityHiddenWrites;
    }),
    "Hidden first-chapter geometry stays idle in 03",
  ).toBe(0);
  for (const name of ["CRM", "EMR", "Synapse", "Firstpass"]) {
    await expect(systemScene.locator(`[data-system="${name}"]`)).toHaveCSS(
      "opacity",
      "1",
    );
  }
  for (const route of await systemScene.locator(".integration-route").all()) {
    await expect(route).toHaveCSS("stroke-dashoffset", "0px");
  }
  const outgoing = systemScene.locator(".integration-packet").first();
  const returning = systemScene.locator(".integration-return").first();
  const offsets = await Promise.all(
    [outgoing, returning].map((node) =>
      node.evaluate(
        (el) => +getComputedStyle(el).strokeDashoffset.replace("px", ""),
      ),
    ),
  );
  await page.waitForTimeout(300);
  const after = await Promise.all(
    [outgoing, returning].map((node) =>
      node.evaluate(
        (el) => +getComputedStyle(el).strokeDashoffset.replace("px", ""),
      ),
    ),
  );
  expect(after[0]).toBeLessThan(offsets[0]);
  expect(after[1]).toBeGreaterThan(offsets[1]);
  await page.screenshot({ path: "/tmp/vectramind-integration-redesign.png" });
  await scrub(0.83);
  expect(
    (await firstCard.locator(".integration-chip-body").boundingBox()).width,
    "Reverse scroll restores module reveal",
  ).toBeCloseTo(earlyWidth, 1);
  await scrub(0.12);
  await expect(systemScene).toHaveAttribute("data-flow", "paused");
  await track
    .getByRole("button", { name: "Next capability", exact: true })
    .click();
  await expect(track.locator("h3 .capability-copy-full")).toHaveText(titles[1]);
  await track
    .getByRole("button", { name: "Previous capability", exact: true })
    .click();
  await expect(track.locator("h3 .capability-copy-full")).toHaveText(titles[0]);
  if (new URL(page.url()).pathname.startsWith("/capabilities")) {
    await expect(
      track.getByRole("link", { name: "Explore our expertise" }),
    ).toHaveAttribute("href", "#capability-services");
  } else {
    await expect(
      track.getByRole("link", { name: "Explore the possibilities" }),
    ).toHaveAttribute("href", /^\/capabilities\/?$/);
  }
  for (const width of [2560, 1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: width < 800 ? 844 : 1000 });
    await page.waitForTimeout(400);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `Overflow at ${width}`,
    ).toBe(true);
    if (width > 900) {
      for (const progress of [0.49, 0.73, 0.9]) {
        await scrub(progress);
        const heading = await track.locator("h2").boundingBox();
        const copy = await track
          .locator(".experience-capability-copy")
          .boundingBox();
        const bounds = await track
          .locator(
            progress < 0.75
              ? '[data-geometry="plate"]'
              : ".integration-system-card .integration-chip-body > rect, .integration-hub > rect, .integration-infrastructure .integration-chip-body > rect",
          )
          .evaluateAll((nodes) =>
            nodes
              .filter((el) => Number(getComputedStyle(el).opacity) > 0.1)
              .map((el) => {
                const r = el.getBoundingClientRect();
                const svg = el.ownerSVGElement;
                const clip = svg.querySelector(".capability-connected-clip");
                const m = svg.getScreenCTM();
                const x = Number(clip.getAttribute("x"));
                const y = Number(clip.getAttribute("y"));
                const w = Number(clip.getAttribute("width"));
                const h = Number(clip.getAttribute("height"));
                return {
                  top: Math.max(r.top, m.f + y * m.d),
                  bottom: Math.min(r.bottom, m.f + (y + h) * m.d),
                  left: Math.max(r.left, m.e + x * m.a),
                  right: Math.min(r.right, m.e + (x + w) * m.a),
                };
              })
              .filter((r) => r.bottom > r.top && r.right > r.left),
          );
        expect(
          Math.min(...bounds.map((r) => r.top)),
          "Panels stay below the heading throughout the orbit and rise",
        ).toBeGreaterThan(heading.y + heading.height + 20);
        expect(
          Math.min(...bounds.map((r) => r.left)),
          "The stack stays beside the copy",
        ).toBeGreaterThan(copy.x + copy.width + 20);
        expect(
          Math.max(...bounds.map((r) => r.right)),
          "The stack fits within the viewport",
        ).toBeLessThan(width - 20);
      }
    }
  }
  await expect(track.locator(".experience-capability-sticky")).toHaveCSS(
    "position",
    "relative",
  );
  await track
    .getByRole("button", { name: "Next capability", exact: true })
    .click();
  await expect(track.locator("h3 .capability-copy-full")).toHaveText(titles[1]);
  await expect(track.locator(".capability-visual-stage-1")).toHaveCSS(
    "opacity",
    "1",
  );
  await track.scrollIntoViewIfNeeded();
  await page.screenshot({ path: "/tmp/vectramind-capability-mobile.png" });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(track.locator(".experience-capability-sticky")).toHaveCSS(
    "position",
    "relative",
  );
  await expect(track.locator(".capability-number-mobile")).toBeVisible();
  await track
    .getByRole("button", { name: "Next capability", exact: true })
    .click();
  await expect(track.locator("h3 .capability-copy-full")).toHaveText(titles[2]);
  expect(errors).toEqual([]);
  console.log(
    "Passed: three SVG chapters, fixed heading, matching visible index/artwork/copy, forward and reverse scrolling, moving fins, desktop/mobile controls, 320–2560px widths, reduced motion, no WebGL, and no browser errors.",
  );
} finally {
  await browser.close();
}
