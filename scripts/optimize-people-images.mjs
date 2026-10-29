import sharp from "sharp";

// Keep the source photos and full desktop detail; generate smaller choices for
// the lazy-loaded Home/About gallery instead of sending every phone the JPEG.
for (const [source, name, widths] of [
  ["milestone-01.jpg", "milestone-01", [640, 960, 1359]],
  ["career.webp", "career", [480, 640, 800]],
  ["ceo_about.webp", "ceo_about", [480]],
]) {
  for (const width of widths) {
    const result = await sharp(`public/images/${source}`)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 85, effort: 6 })
      .toFile(`public/images/${name}-${width}.webp`);
    console.log(`${name}-${width}.webp: ${result.size} bytes`);
  }
}
