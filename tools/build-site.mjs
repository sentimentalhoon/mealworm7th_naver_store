import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const outputDir = path.join(rootDir, "dist");
const publicHtmlFiles = [
  "00_integrated_naver_mobile.html",
  "01_live_mealworm_1kg.html",
  "02_live_superworm_count.html",
  "03_live_superworm_1kg.html",
  "04_dried_mealworm.html",
  "05_dried_superworm.html"
];
const internalAssetFiles = new Set([
  "option-category-map.svg",
  "option-combination-grid.svg",
  "option-seller-steps.svg"
]);

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

await cp(path.join(rootDir, "index.html"), path.join(outputDir, "index.html"));
await mkdir(path.join(outputDir, "html"), { recursive: true });
for (const fileName of publicHtmlFiles) {
  await cp(path.join(rootDir, "html", fileName), path.join(outputDir, "html", fileName));
}
await cp(path.join(rootDir, "assets"), path.join(outputDir, "assets"), {
  recursive: true,
  filter: (source) => !internalAssetFiles.has(path.basename(source))
});
await cp(path.join(rootDir, "robots.txt"), path.join(outputDir, "robots.txt"));
await cp(path.join(rootDir, "sitemap.xml"), path.join(outputDir, "sitemap.xml"));

console.log("Built static site into dist/");
