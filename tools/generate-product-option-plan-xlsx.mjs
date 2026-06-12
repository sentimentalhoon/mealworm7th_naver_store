import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  buildProductPlanOptionRows,
  formatWon,
  isWithinOptionRangeForBase,
  optionPriceFor,
  optionRangeForBasePrice,
  priceGroups,
  recommendedProductPlans
} from "./smartstore-pricing.mjs";
import { createWorkbook } from "./xlsx-writer.mjs";

const rootDir = process.cwd();
const outputDir = path.join(rootDir, "exports", "options");
const outputPath = path.join(outputDir, "mealworm7th_product_option_plan.xlsx");
const planOptionRows = recommendedProductPlans.flatMap((plan) => buildProductPlanOptionRows(plan));

const workbook = createWorkbook([
  {
    name: "추천상품구성",
    rows: [
      ["상품코드", "상품명", "기준판매가", "허용옵션가", "포함옵션", "옵션행수", "운영메모", "범위내 추가가능"],
      ...recommendedProductPlans.map((plan) => {
        const range = optionRangeForBasePrice(plan.basePrice);
        const optionRows = buildProductPlanOptionRows(plan);
        return [
          plan.code,
          plan.productName,
          plan.basePrice,
          `${formatWon(range.min)} ~ ${formatWon(range.max, { signed: true })}`,
          plan.groups.map((group) => group.optionLabel || `${group.choice1} / ${group.choice3}`).join("\n"),
          optionRows.length,
          plan.memo,
          plan.optionalInRange
        ];
      })
    ]
  },
  {
    name: "전체옵션표",
    rows: [
      ["상품코드", "상품명", "기준판매가", "선택1", "선택2", "선택3", "실제판매가", "옵션가", "재고수량", "관리코드", "사용여부"],
      ...planOptionRows.map((row) => [
        row.productCode,
        row.productName,
        row.basePrice,
        row.choice1,
        row.choice2,
        row.choice3,
        row.actualPrice,
        row.optionPrice,
        "",
        row.code,
        row.use
      ])
    ]
  },
  {
    name: "전체가격검토",
    rows: [
      ["상품", "옵션", "실제판매가", "추천상품", "추천기준가", "옵션가", "처리", "메모"],
      ...priceGroups.map((group) => {
        const plan = recommendedProductPlans.find((item) => item.groups.includes(group));
        const optionValue = plan ? optionPriceFor(plan.basePrice, group.price) : "";
        return [
          group.product,
          group.optionLabel || `${group.choice2Values.join(", ")} / ${group.choice3}`,
          group.price,
          plan ? plan.productName : "미배정",
          plan ? plan.basePrice : "",
          optionValue,
          plan ? "추천 구성 포함" : "검토 필요",
          plan?.memo || ""
        ];
      })
    ]
  },
  {
    name: "기준가후보",
    rows: [
      ["기준옵션", "기준판매가", "허용옵션가", "포함가능 가격", "포함가능 옵션", "판단"],
      ...baselineCandidateRows()
    ]
  },
  ...recommendedProductPlans.map((plan) => ({
    name: planSheetName(plan),
    rows: [
      ["선택1", "선택2", "선택3", "옵션가", "재고수량", "관리코드", "사용여부"],
      ...buildProductPlanOptionRows(plan).map((row) => [
        row.choice1,
        row.choice2,
        row.choice3,
        row.optionPrice,
        "",
        row.code,
        row.use
      ])
    ]
  }))
]);

await mkdir(outputDir, { recursive: true });
await writeFile(outputPath, workbook);

console.log(`Generated ${path.relative(rootDir, outputPath)}`);
console.log(`Recommended products: ${recommendedProductPlans.length}`);
console.log(`Option rows: ${planOptionRows.length}`);

function baselineCandidateRows() {
  const groupedByPrice = new Map();
  for (const group of priceGroups) {
    const items = groupedByPrice.get(group.price) || [];
    items.push(group);
    groupedByPrice.set(group.price, items);
  }

  return Array.from(groupedByPrice.entries())
    .sort(([a], [b]) => a - b)
    .map(([basePrice, baseGroups]) => {
      const range = optionRangeForBasePrice(basePrice);
      const inRangeGroups = priceGroups.filter((group) => isWithinOptionRangeForBase(basePrice, group.price));
      return [
        baseGroups.map((group) => group.optionLabel || `${group.product} / ${group.choice3}`).join("\n"),
        basePrice,
        `${formatWon(range.min)} ~ ${formatWon(range.max, { signed: true })}`,
        Array.from(new Set(inRangeGroups.map((group) => formatWon(group.price)))).join(", "),
        inRangeGroups.map((group) => group.optionLabel || `${group.product} / ${group.choice3}`).join("\n"),
        candidateMemo(basePrice)
      ];
    });
}

function candidateMemo(basePrice) {
  if (basePrice === 17000) return "슈퍼밀웜 500마리/1000마리/1kg 묶음에 적합";
  if (basePrice === 33000) return "사용자 의견처럼 2000마리 기준 상품에 적합. 3000마리까지 안정적으로 포함";
  if (basePrice === 84000) return "5000마리 별도 상품 기준. 3000마리도 범위 안이나 노출가가 높아짐";
  if (basePrice === 22000) return "건조 상품 4종을 모두 묶기 좋음";
  if (basePrice === 13000) return "생밀웜 1kg 기준 상품에 적합";
  return "가격 범위는 가능하지만 상품 성격 혼합 여부 확인 필요";
}

function planSheetName(plan) {
  const names = {
    P01: "P01_생밀웜",
    P02: "P02_슈퍼소량",
    P03: "P03_슈퍼중대량",
    P04: "P04_슈퍼5000",
    P05: "P05_건조"
  };
  return names[plan.code] || plan.code;
}
