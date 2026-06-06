import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const outputDir = path.join(rootDir, "dist");

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });

await cp(path.join(rootDir, "index.html"), path.join(outputDir, "index.html"));
await cp(path.join(rootDir, "html"), path.join(outputDir, "html"), { recursive: true });
await cp(path.join(rootDir, "assets"), path.join(outputDir, "assets"), { recursive: true });

console.log("Built static site into dist/");
