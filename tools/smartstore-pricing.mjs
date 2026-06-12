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

export function optionPrice(actualPrice) {
  return actualPrice - baseSalePrice;
}

export function isWithinOptionRange(actualPrice) {
  const value = optionPrice(actualPrice);
  return value >= optionPriceMin && value <= optionPriceMax;
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

function romanizeSize(size) {
  return ({ "소": "S", "중": "M", "대": "L" })[size] || size;
}

function romanizeAmount(amount) {
  return amount
    .replace("마리", "")
    .replace(".", "_")
    .replace("kg", "KG");
}
