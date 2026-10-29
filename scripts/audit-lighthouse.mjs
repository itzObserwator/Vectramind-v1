import { mkdir, readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

const profiles = process.argv.includes("--all")
  ? ["desktop", "mobile"]
  : [process.argv.includes("--desktop") ? "desktop" : "mobile"];
const directory = resolve("test-results/lighthouse");
// Example: npm run audit -- --path=/synapse/ (builds and audits this route).
const route = process.argv.find((arg) => arg.startsWith("--path="))?.slice(7);
if (
  route &&
  (!route.startsWith("/") || route.startsWith("//") || /[?#]/.test(route))
)
  throw new Error("--path must be a local pathname, for example /synapse/.");
const reportPrefix = route
  ? `${route.split("/").filter(Boolean).join("-") || "home"}-`
  : "";
let preview;
let current;

function run(command, args) {
  return new Promise((resolveRun, reject) => {
    const child = spawn(command, args, { stdio: "inherit" });
    current = child;
    child.once("error", reject);
    child.once("close", (code, signal) => {
      if (current === child) current = undefined;
      if (code === 0) resolveRun();
      else reject(new Error(`${command} exited with ${signal || code}.`));
    });
  });
}

function startPreview() {
  return new Promise((resolvePreview, reject) => {
    // An ephemeral port avoids both an existing dev server and stale previews.
    preview = spawn(process.execPath, ["scripts/serve.mjs"], {
      env: { ...process.env, HOST: "127.0.0.1", PORT: "0" },
      stdio: ["ignore", "inherit", "inherit", "ipc"],
    });
    const timeout = setTimeout(
      () => reject(new Error("Production preview did not start.")),
      15000,
    );
    preview.once("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    preview.once("exit", (code) => {
      clearTimeout(timeout);
      reject(new Error(`Production preview exited with ${code}.`));
    });
    preview.once("message", (message) => {
      clearTimeout(timeout);
      if (message.type === "ready")
        resolvePreview(`http://127.0.0.1:${message.port}/`);
      else reject(new Error("Unexpected production-preview startup message."));
    });
  });
}

function stop() {
  current?.kill("SIGTERM");
  preview?.kill("SIGTERM");
}
process.once("SIGINT", () => {
  stop();
  process.exit(130);
});
process.once("SIGTERM", () => {
  stop();
  process.exit(143);
});

try {
  await mkdir(directory, { recursive: true });
  let url = process.env.PREVIEW_URL;
  if (!url) {
    console.log("Building a fresh production export for Lighthouse…");
    await run("npm", ["run", "build"]);
    url = await startPreview();
  }
  if (route) url = new URL(route, url).href;
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  if (!response.ok)
    throw new Error(`Preview returned HTTP ${response.status}.`);
  const html = await response.text();
  if (
    /\/_next\/static\/chunks\/(?:webpack|main-app)\.js[?"']/.test(html) ||
    html.includes("next-devtools")
  ) {
    throw new Error(
      "PREVIEW_URL points to a Next.js development server. Run this command without PREVIEW_URL to build and audit a fresh production export.",
    );
  }
  for (const profile of profiles) {
    console.log(`Auditing production: ${url} (${profile})`);
    const args = [
      "exec",
      "--yes",
      "--package=lighthouse@13.5.0",
      "--",
      "lighthouse",
      url,
      "--quiet",
      "--output=json",
      "--output=html",
      `--output-path=${directory}/${reportPrefix}${profile}`,
      "--only-categories=performance,accessibility,best-practices,seo",
      "--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage --disable-extensions",
    ];
    if (profile === "desktop") args.push("--preset=desktop");
    await run("npm", args);
    const report = JSON.parse(
      await readFile(
        `${directory}/${reportPrefix}${profile}.report.json`,
        "utf8",
      ),
    );
    for (const category of Object.values(report.categories))
      console.log(`${category.title}: ${Math.round(category.score * 100)}`);
    for (const id of [
      "first-contentful-paint",
      "largest-contentful-paint",
      "total-blocking-time",
      "cumulative-layout-shift",
      "image-delivery-insight",
      "unused-javascript",
    ]) {
      const audit = report.audits[id];
      console.log(
        `${audit.title}: ${audit.displayValue || (audit.score === 1 ? "Passed" : "See report")}`,
      );
    }
    for (const warning of report.runWarnings || [])
      console.warn(`Audit warning: ${warning}`);
    const errors = report.audits["errors-in-console"].details?.items || [];
    console.log(`Browser console errors: ${errors.length}`);
    for (const error of errors)
      console.error(
        `${error.sourceLocation?.url || "Browser"}: ${error.description}`,
      );
    console.log(`Report: ${directory}/${reportPrefix}${profile}.report.html`);
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  stop();
}
