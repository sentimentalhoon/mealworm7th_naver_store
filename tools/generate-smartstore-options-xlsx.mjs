import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { buildSmartStoreOptionRows } from "./smartstore-pricing.mjs";
import { createWorkbook } from "./xlsx-writer.mjs";

const rootDir = process.cwd();
const outputDir = path.join(rootDir, "exports", "options");
const outputPath = path.join(outputDir, "mealworm7th_smartstore_options.xlsx");
const rows = buildSmartStoreOptionRows();

const workbook = createWorkbook([
  {
    name: "옵션목록",
    rows: [
      ["선택1", "선택2", "선택3", "옵션가", "재고수량", "관리코드", "사용여부"],
      ...rows.map((row) => [
        row.choice1,
        row.choice2,
        row.choice3,
        row.optionPrice,
        "",
        row.code,
        row.use
      ])
    ]
  }
]);

await mkdir(outputDir, { recursive: true });
await writeFile(outputPath, workbook);

console.log(`Generated ${path.relative(rootDir, outputPath)}`);
console.log(`Option rows: ${rows.length}`);
