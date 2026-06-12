import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import {
  baseSalePrice,
  formatWon,
  optionPriceMax,
  optionPriceMin,
  priceTableRows
} from "./smartstore-pricing.mjs";

const rootDir = process.cwd();
const outputDir = path.join(rootDir, "exports", "options");
const outputPath = path.join(outputDir, "mealworm7th_price_table.png");
const rows = priceTableRows();

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 1600 },
    deviceScaleFactor: 2
  });

  await page.setContent(renderHtml(rows), { waitUntil: "load" });
  await page.locator(".sheet").screenshot({ path: outputPath });
} finally {
  await browser.close();
}

console.log(`Generated ${path.relative(rootDir, outputPath)}`);

function renderHtml(tableRows) {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <style>
    *{box-sizing:border-box}
    body{margin:0;background:#f7efe6;color:#3f2a1b;font-family:"Malgun Gothic","Apple SD Gothic Neo",Arial,sans-serif}
    .sheet{width:1180px;margin:0 auto;padding:48px;background:#fffaf4}
    .panel{border:2px solid #ead8c5;border-radius:28px;background:#fff;overflow:hidden;box-shadow:0 16px 40px rgba(79,45,22,.08)}
    header{padding:36px 42px 28px;background:#4f2d16;color:#fff}
    h1{margin:0;font-size:42px;letter-spacing:-.02em}
    .sub{margin:14px 0 0;font-size:20px;line-height:1.6;color:#f5dfc9}
    .meta{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;padding:24px 42px;background:#fff4e8;border-bottom:1px solid #ead8c5}
    .meta-card{border:1px solid #e6ccb2;border-radius:16px;background:#fff;padding:18px}
    .meta-card b{display:block;margin-bottom:8px;color:#8a4f22;font-size:16px}
    .meta-card span{font-size:22px;font-weight:800;color:#4f2d16}
    table{width:100%;border-collapse:collapse}
    th{background:#f4e1ce;color:#4f2d16;font-size:17px;text-align:left;padding:16px 18px;border-bottom:1px solid #e4c7aa}
    td{font-size:17px;line-height:1.45;padding:16px 18px;border-bottom:1px solid #f0dfce;vertical-align:middle}
    tr:last-child td{border-bottom:0}
    .product{font-weight:800;color:#4f2d16}
    .price,.delta{font-weight:800;white-space:nowrap}
    .delta.negative{color:#1f6f5b}
    .delta.positive{color:#9a4a1d}
    .delta.zero{color:#386f2f}
    .badge{display:inline-block;border-radius:999px;padding:8px 12px;font-size:15px;font-weight:800;white-space:nowrap}
    .include{background:#e8f4e2;color:#386f2f}
    .separate{background:#fff0e9;color:#a6502a}
    footer{padding:22px 42px 34px;color:#6d5749;font-size:15px;line-height:1.7;background:#fff}
  </style>
</head>
<body>
  <main class="sheet">
    <section class="panel">
      <header>
        <h1>밀웜7번가 스마트스토어 가격표</h1>
        <p class="sub">기준 판매가를 가장 많이 판매되는 생밀웜 1kg 기준으로 두고, 네이버 옵션가 허용 범위 안의 항목만 통합 옵션 엑셀에 포함합니다.</p>
      </header>
      <div class="meta">
        <div class="meta-card"><b>기준 판매가</b><span>${formatWon(baseSalePrice)}</span></div>
        <div class="meta-card"><b>허용 옵션가</b><span>${formatWon(optionPriceMin)} ~ ${formatWon(optionPriceMax, { signed: true })}</span></div>
        <div class="meta-card"><b>엑셀 포함 기준</b><span>범위 안 항목만</span></div>
      </div>
      <table>
        <thead>
          <tr>
            <th style="width:170px">상품</th>
            <th>옵션</th>
            <th style="width:150px">판매가</th>
            <th style="width:160px">옵션가</th>
            <th style="width:180px">처리</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows.map((row) => `
          <tr>
            <td class="product">${escapeHtml(row.product)}</td>
            <td>${escapeHtml(row.option)}</td>
            <td class="price">${formatWon(row.price)}</td>
            <td class="delta ${deltaClass(row.optionPrice)}">${formatWon(row.optionPrice, { signed: true })}</td>
            <td><span class="badge ${row.inRange ? "include" : "separate"}">${row.inRange ? "엑셀 포함" : "별도 상품 권장"}</span></td>
          </tr>`).join("")}
        </tbody>
      </table>
      <footer>
        네이버 옵션가는 판매가 기준으로 제한됩니다. 현재 기준 판매가 13,000원에서는 -6,500원부터 +6,500원까지가 통합 옵션 엑셀 처리 범위입니다. 범위를 넘는 항목은 별도 상품 또는 별도 옵션 구성으로 등록하는 것이 안전합니다.
      </footer>
    </section>
  </main>
</body>
</html>`;
}

function deltaClass(value) {
  if (value < 0) return "negative";
  if (value > 0) return "positive";
  return "zero";
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
