import { chromium, expect } from "@playwright/test";

const base = process.env.PREVIEW_URL || "http://127.0.0.1:3001";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const route of ["/", "/synapse/", "/support/"]) {
      await page.goto(new URL(route, base).href, { waitUntil: "networkidle" });
      await page.keyboard.press("Escape");
      if (width <= 900)
        await page.getByRole("button", { name: "Open menu" }).click();
      const consultation = page.getByRole("link", {
        name: "Consultation",
        exact: true,
      });
      await expect(consultation).toHaveAttribute(
        "href",
        "/support/#contact-form",
      );
      await consultation.click();
      await expect(page).toHaveURL(/\/support\/?#contact-form$/);
      await expect(
        page.locator("#contact-form input[name='name']"),
      ).toBeInViewport();
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(
        page.getByRole("navigation", { name: "Mobile navigation" }),
      ).toHaveCount(0);
      await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
      await expect
        .poll(async () => {
          const form = await page.locator("#contact-form").boundingBox();
          const header = await page.locator(".header").boundingBox();
          return form.y >= header.y + header.height && form.y < 300;
        })
        .toBe(true);
    }
    for (const product of ["synapse", "firstpass"]) {
      await page.goto(`${base}/${product}/`, { waitUntil: "networkidle" });
      await page.keyboard.press("Escape");
      await page
        .getByRole("link", {
          name:
            width <= 600
              ? "Request a demo"
              : product === "synapse"
                ? "Request a Synapse demo"
                : "Request a Firstpass demo",
          exact: true,
        })
        .click();
      await expect(page).toHaveURL(
        new RegExp(`/support/\\?topic=${product}#contact-form$`),
      );
      await expect(page.getByRole("combobox")).toHaveValue(product);
      await expect(
        page.locator("#contact-form input[name='name']"),
      ).toBeInViewport();
    }
    for (const topic of [
      "",
      "firstpass",
      "artificial-intelligence",
      "careers",
    ]) {
      await page.goto(
        `${base}/contact/${topic ? `?topic=${topic}` : ""}#contact-form`,
        { waitUntil: "networkidle" },
      );
      await expect(page).toHaveURL(
        /\/support\/?(?:\?topic=[^#]+)?#contact-form$/,
      );
      await page.keyboard.press("Escape");
      await expect(page.locator(".site-preloader")).toBeHidden();
      await expect(page.locator("h1")).toHaveText("Here to help.With you.");
      await expect(page.getByRole("combobox")).toHaveValue(topic || "support");
      await expect(
        page.locator("#contact-form input[name='name']"),
      ).toBeInViewport();
    }
    await page.goto(`${base}/contact/#locations`, { waitUntil: "networkidle" });
    await expect(page).toHaveURL(/\/about\/?#about-locations-title$/);
    expect(errors).toEqual([]);
    console.log(
      `${width}px: direct Consultation anchors, menu cleanup, retired Contact redirects, enquiry topics and office bookmarks passed`,
    );
    await page.close();
  }
} finally {
  await browser.close();
}
