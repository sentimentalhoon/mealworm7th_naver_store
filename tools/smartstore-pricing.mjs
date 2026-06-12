export const sizes = ["소", "중", "대"];
export const baseSalePrice = 13000;
export const optionPriceMin = -6500;
export const optionPriceMax = 6500;

export const priceGroups = [
  {
    product: "생밀웜",
    choice1: "밀웜",
    choice2Values: sizes,
    choice3: "1kg",
    price: 13000,
    codePrefix: "MW"
  },
  {
    product: "슈퍼밀웜",
    optionLabel: "마리수형 / 소,중,대 / 500마리",
    choice1: "슈퍼밀웜",
    choice2Values: sizes,
    choice3: "500마리",
    price: 11000,
    codePrefix: "SW"
  },
  {
    product: "슈퍼밀웜",
    optionLabel: "마리수형 / 소,중,대 / 1,000마리",
    choice1: "슈퍼밀웜",
    choice2Values: sizes,
    choice3: "1000마리",
    price: 17000,
    codePrefix: "SW"
  },
  {
    product: "슈퍼밀웜",
    optionLabel: "마리수형 / 소,중,대 / 2,000마리",
    choice1: "슈퍼밀웜",
    choice2Values: sizes,
    choice3: "2000마리",
    price: 33000,
    codePrefix: "SW"
  },
  {
    product: "슈퍼밀웜",
    optionLabel: "마리수형 / 소,중,대 / 3,000마리",
    choice1: "슈퍼밀웜",
    choice2Values: sizes,
    choice3: "3000마리",
    price: 46000,
    codePrefix: "SW"
  },
  {
    product: "슈퍼밀웜",
    optionLabel: "마리수형 / 소,중,대 / 5,000마리",
    choice1: "슈퍼밀웜",
    choice2Values: sizes,
    choice3: "5000마리",
    price: 84000,
    codePrefix: "SW"
  },
  {
    product: "슈퍼밀웜",
    optionLabel: "1kg / 소,중,대",
    choice1: "슈퍼밀웜",
    choice2Values: sizes,
    choice3: "1kg",
    price: 20000,
    codePrefix: "SW"
  },
  {
    product: "건조밀웜",
    choice1: "건조밀웜",
    choice2Values: ["0.5kg"],
    choice3: "단일",
    price: 19000,
    codePrefix: "DMW"
  },
  {
    product: "건조밀웜",
    choice1: "건조밀웜",
    choice2Values: ["1kg"],
    choice3: "단일",
    price: 22000,
    codePrefix: "DMW"
  },
  {
    product: "건조슈퍼밀웜",
    choice1: "건조슈퍼밀웜",
    choice2Values: ["0.5kg"],
    choice3: "단일",
    price: 22000,
    codePrefix: "DSW"
  },
  {
    product: "건조슈퍼밀웜",
    choice1: "건조슈퍼밀웜",
    choice2Values: ["1kg"],
    choice3: "단일",
    price: 29000,
    codePrefix: "DSW"
  }
];

export const recommendedProductPlans = [
  {
    code: "P01",
    productName: "생밀웜 1kg",
    basePrice: 13000,
    mode: "sizeAmount",
    groups: [
      findPriceGroup("밀웜", "1kg")
    ],
    memo: "가장 많이 판매되는 기준 상품입니다. 소/중/대 크기만 옵션으로 둡니다.",
    optionalInRange: ""
  },
  {
    code: "P02",
    productName: "슈퍼밀웜 소량/1kg",
    basePrice: 17000,
    mode: "sizeAmount",
    groups: [
      findPriceGroup("슈퍼밀웜", "500마리"),
      findPriceGroup("슈퍼밀웜", "1000마리"),
      findPriceGroup("슈퍼밀웜", "1kg")
    ],
    memo: "500마리와 1000마리, 1kg을 한 상품 안에서 처리할 수 있습니다.",
    optionalInRange: ""
  },
  {
    code: "P03",
    productName: "슈퍼밀웜 중대량",
    basePrice: 33000,
    mode: "sizeAmount",
    groups: [
      findPriceGroup("슈퍼밀웜", "2000마리"),
      findPriceGroup("슈퍼밀웜", "3000마리")
    ],
    memo: "사용자 의견처럼 2000마리를 기준으로 두면 3000마리까지 안정적으로 묶입니다.",
    optionalInRange: "1000마리와 1kg도 범위 안이지만 P02와 중복되므로 제외"
  },
  {
    code: "P04",
    productName: "슈퍼밀웜 5000마리",
    basePrice: 84000,
    mode: "sizeAmount",
    groups: [
      findPriceGroup("슈퍼밀웜", "5000마리")
    ],
    memo: "가격 차이가 커서 별도 상품으로 분리하는 편이 안전합니다.",
    optionalInRange: "3000마리도 범위 안이지만 P03과 중복되므로 제외"
  },
  {
    code: "P05",
    productName: "건조밀웜/건조슈퍼밀웜",
    basePrice: 22000,
    mode: "productWeight",
    groups: [
      findPriceGroup("건조밀웜", "0.5kg"),
      findPriceGroup("건조밀웜", "1kg"),
      findPriceGroup("건조슈퍼밀웜", "0.5kg"),
      findPriceGroup("건조슈퍼밀웜", "1kg")
    ],
    memo: "건조 상품 4개는 22,000원 기준으로 모두 옵션가 범위 안에 들어옵니다.",
    optionalInRange: ""
  }
];

export function optionPrice(actualPrice) {
  return actualPrice - baseSalePrice;
}

export function optionPriceFor(basePrice, actualPrice) {
  return actualPrice - basePrice;
}

export function optionRangeForBasePrice(basePrice) {
  if (basePrice < 2000) return { min: 0, max: basePrice };
  if (basePrice < 10000) return { min: -basePrice * 0.5, max: basePrice };
  return { min: -basePrice * 0.5, max: basePrice * 0.5 };
}

export function isWithinOptionRange(actualPrice) {
  const value = optionPrice(actualPrice);
  return value >= optionPriceMin && value <= optionPriceMax;
}

export function isWithinOptionRangeForBase(basePrice, actualPrice) {
  const range = optionRangeForBasePrice(basePrice);
  const value = optionPriceFor(basePrice, actualPrice);
  return value >= range.min && value <= range.max;
}

export function buildSmartStoreOptionRows() {
  return priceGroups
    .filter((group) => isWithinOptionRange(group.price))
    .flatMap((group) => (
      group.choice2Values.map((choice2) => ({
        choice1: group.choice1,
        choice2,
        choice3: group.choice3,
        optionPrice: optionPrice(group.price),
        use: "Y",
        code: `${group.codePrefix}-${romanizeSize(choice2)}-${romanizeAmount(group.choice3)}`
      }))
    ));
}

export function buildProductPlanOptionRows(plan) {
  return plan.groups.flatMap((group) => (
    group.choice2Values.map((choice2) => {
      const productWeightMode = plan.mode === "productWeight";
      const choice1 = productWeightMode ? group.choice1 : choice2;
      const choice2Value = productWeightMode ? choice2 : group.choice3;
      const choice3 = "단일";
      const codeSuffix = productWeightMode
        ? `${group.codePrefix}-${romanizeAmount(choice2)}`
        : `${group.codePrefix}-${romanizeSize(choice2)}-${romanizeAmount(group.choice3)}`;

      return {
        productCode: plan.code,
        productName: plan.productName,
        basePrice: plan.basePrice,
        actualPrice: group.price,
        choice1,
        choice2: choice2Value,
        choice3,
        optionPrice: optionPriceFor(plan.basePrice, group.price),
        use: "Y",
        code: `${plan.code}-${codeSuffix}`,
        sourceOption: group.optionLabel || `${group.choice1} / ${choice2} / ${group.choice3}`
      };
    })
  ));
}

export function priceTableRows() {
  return priceGroups.map((group) => ({
    product: group.product,
    option: group.optionLabel || `${group.choice2Values.join(", ")} / ${group.choice3}`,
    price: group.price,
    optionPrice: optionPrice(group.price),
    inRange: isWithinOptionRange(group.price)
  }));
}

export function formatWon(value, { signed = false } = {}) {
  const sign = signed && value > 0 ? "+" : "";
  return `${sign}${value.toLocaleString("ko-KR")}원`;
}

export function romanizeSize(size) {
  return ({ "소": "S", "중": "M", "대": "L" })[size] || size;
}

export function romanizeAmount(amount) {
  return amount
    .replace("마리", "")
    .replace(".", "_")
    .replace("kg", "KG");
}

function findPriceGroup(choice1, choice3) {
  const group = priceGroups.find((item) => (
    item.choice1 === choice1 && (item.choice3 === choice3 || item.choice2Values.includes(choice3))
  ));
  if (!group) throw new Error(`Missing price group: ${choice1} ${choice3}`);
  return group;
}
