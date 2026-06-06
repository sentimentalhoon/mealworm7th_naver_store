import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const rootDir = process.cwd();
const sourcePath = path.resolve(rootDir, "html/00_integrated_naver_mobile.html");
const outputDir = path.resolve(rootDir, "exports/00_integrated_naver_mobile");
const viewportWidth = 430;
const viewportHeight = 1200;
const scale = 2;
const outputWidth = viewportWidth * scale;

function pngSize(filePath) {
  const buffer = readFileSync(filePath);
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}

function safeName(value) {
  return value.replace(/[^a-z0-9_-]/gi, "_").replace(/_+/g, "_");
}

await mkdir(outputDir, { recursive: true });
const existingFiles = await readdir(outputDir);
await Promise.all(existingFiles
  .filter((file) => file.endsWith(".png") || file === "manifest.json")
  .map((file) => rm(path.join(outputDir, file))));

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: viewportWidth, height: viewportHeight },
  deviceScaleFactor: scale,
  isMobile: true,
  hasTouch: true
});

try {
  await page.goto(pathToFileURL(sourcePath).href, { waitUntil: "load" });
  await page.evaluate(() => document.body.classList.add("image-export"));
  await page.evaluate(async () => {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    await Promise.all(Array.from(document.images).map((image) => {
      if (image.complete && image.naturalWidth > 0) return Promise.resolve();
      return new Promise((resolve) => {
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", resolve, { once: true });
      });
    }));
  });
  await page.waitForTimeout(250);

  let pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.setViewportSize({ width: viewportWidth, height: Math.ceil(pageHeight) });
  await page.waitForTimeout(100);
  pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);

  const blocks = await page.locator("[data-export-name]").evaluateAll((elements) => {
    return elements.map((element) => ({
      name: element.dataset.exportName,
      pad: Number(element.dataset.exportPad || 0),
      label: element.querySelector("h1,h2,h3,b")?.textContent?.trim() || element.dataset.exportName
    }));
  });

  const manifest = [];

  for (const [index, block] of blocks.entries()) {
    const locator = page.locator(`[data-export-name="${block.name}"]`).first();
    const box = await locator.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return {
        x: rect.x + window.scrollX,
        y: rect.y + window.scrollY,
        width: rect.width,
        height: rect.height
      };
    });
    if (!box) {
      throw new Error(`Cannot measure export block: ${block.name}`);
    }

    const y = Math.max(0, Math.floor(box.y - block.pad));
    const height = Math.ceil(Math.min(pageHeight - y, box.height + block.pad * 2));
    const fileName = `${String(index + 1).padStart(2, "0")}_${safeName(block.name)}.png`;
    const filePath = path.join(outputDir, fileName);

    await page.screenshot({
      path: filePath,
      clip: { x: 0, y, width: viewportWidth, height },
      animations: "disabled",
      type: "png"
    });

    const size = pngSize(filePath);
    if (size.width !== outputWidth) {
      throw new Error(`${fileName} width is ${size.width}px, expected ${outputWidth}px`);
    }

    manifest.push({
      file: fileName,
      label: block.label,
      width: size.width,
      height: size.height
    });
  }

  const manifestPath = path.join(outputDir, "manifest.json");
  await writeFile(manifestPath, JSON.stringify({
    source: path.relative(rootDir, sourcePath).replace(/\\/g, "/"),
    generatedAt: new Date().toISOString(),
    viewport: {
      cssWidth: viewportWidth,
      deviceScaleFactor: scale,
      outputWidth
    },
    files: manifest
  }, null, 2), "utf8");

  console.log(`Generated ${manifest.length} images in ${path.relative(rootDir, outputDir)}`);
  for (const item of manifest) {
    console.log(`${item.file} - ${item.width}x${item.height}`);
  }
} finally {
  await browser.close();
}
