import { mkdir, rm, writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const rootDir = process.cwd();
const outputRoot = path.resolve(rootDir, "exports");
const viewportHeight = 1200;
const widthPresets = [840, 640, 400];
const pages = [
  { slug: "00_integrated_naver_mobile", source: "html/00_integrated_naver_mobile.html" },
  { slug: "01_live_mealworm_1kg", source: "html/01_live_mealworm_1kg.html" },
  { slug: "02_live_superworm_count", source: "html/02_live_superworm_count.html" },
  { slug: "03_live_superworm_1kg", source: "html/03_live_superworm_1kg.html" },
  { slug: "04_dried_mealworm", source: "html/04_dried_mealworm.html" },
  { slug: "05_dried_superworm", source: "html/05_dried_superworm.html" },
  { slug: "06_naver_option_manual", source: "html/06_naver_option_manual.html" }
];
const pageArg = process.argv.find((arg) => arg.startsWith("--page="))?.split("=")[1];
const pagesToExport = pageArg ? pages.filter((page) => page.slug === pageArg) : pages;

if (pagesToExport.length === 0) {
  throw new Error(`Unknown page: ${pageArg}`);
}

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

async function waitForAssets(page) {
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
}

await mkdir(outputRoot, { recursive: true });

const browser = await chromium.launch();

try {
  for (const pageSpec of pagesToExport) {
    const sourcePath = path.resolve(rootDir, pageSpec.source);
    const pageOutputRoot = path.join(outputRoot, pageSpec.slug);
    await rm(pageOutputRoot, { recursive: true, force: true });
    await mkdir(pageOutputRoot, { recursive: true });

    for (const outputWidth of widthPresets) {
      const outputDir = path.join(pageOutputRoot, `${outputWidth}px`);
      await mkdir(outputDir, { recursive: true });

      const page = await browser.newPage({
        viewport: { width: outputWidth, height: viewportHeight },
        deviceScaleFactor: 1,
        isMobile: outputWidth <= 640,
        hasTouch: outputWidth <= 640
      });

      try {
        await page.goto(`${pathToFileURL(sourcePath).href}?w=${outputWidth}`, { waitUntil: "load" });
        await page.evaluate((width) => {
          document.documentElement.dataset.pageWidth = String(width);
          document.body.classList.add("image-export");
        }, outputWidth);
        await waitForAssets(page);
        await page.waitForTimeout(250);

        let pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
        await page.setViewportSize({ width: outputWidth, height: Math.ceil(pageHeight) });
        await page.waitForTimeout(100);
        pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);

        const blocks = await page.evaluate(() => {
          const exportBlocks = Array.from(document.querySelectorAll("[data-export-name]"));
          const elements = exportBlocks.length > 0
            ? exportBlocks
            : Array.from(document.querySelectorAll("body > header, main > section"));

          return elements.map((element, index) => ({
            name: element.dataset.exportName || `section_${String(index + 1).padStart(2, "0")}`,
            pad: Number(element.dataset.exportPad || 0),
            label: element.querySelector("h1,h2,h3,b")?.textContent?.trim() || `Section ${index + 1}`
          }));
        });

        const manifest = [];

        for (const [index, block] of blocks.entries()) {
          const locator = block.name.startsWith("section_")
            ? page.locator("body > header, main > section").nth(index)
            : page.locator(`[data-export-name="${block.name}"]`).first();
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
            clip: { x: 0, y, width: outputWidth, height },
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
          widthPreset: `${outputWidth}px`,
          viewport: {
            cssWidth: outputWidth,
            deviceScaleFactor: 1,
            outputWidth
          },
          files: manifest
        }, null, 2), "utf8");

        console.log(`Generated ${manifest.length} images in ${path.relative(rootDir, outputDir)}`);
        for (const item of manifest) {
          console.log(`${item.file} - ${item.width}x${item.height}`);
        }
      } finally {
        await page.close();
      }
    }
  }
} finally {
  await browser.close();
}
