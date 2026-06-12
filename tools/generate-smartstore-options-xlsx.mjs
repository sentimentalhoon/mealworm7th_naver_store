import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const outputDir = path.join(rootDir, "exports", "options");
const outputPath = path.join(outputDir, "mealworm7th_smartstore_options.xlsx");
let crcTable;

const sizes = ["소", "중", "대"];
const liveAmounts = ["500마리", "1000마리", "2000마리", "3000마리", "5000마리", "1kg"];
const dryWeights = ["0.5kg", "1kg"];
const baseSalePrice = 11000;
const mealwormPrices = new Map([
  ["1kg", 13000]
]);
const superwormPrices = new Map([
  ["500마리", 11000],
  ["1000마리", 17000],
  ["2000마리", 33000],
  ["3000마리", 46000],
  ["5000마리", 84000],
  ["1kg", 20000]
]);
const driedMealwormPrices = new Map([
  ["0.5kg", 19000],
  ["1kg", 22000]
]);
const driedSuperwormPrices = new Map([
  ["0.5kg", 22000],
  ["1kg", 29000]
]);

const rows = [
  ...["밀웜", "슈퍼밀웜"].flatMap((category) => (
    sizes.flatMap((size) => liveAmounts.map((amount) => {
      const actualPrice = livePrice(category, amount);
      return {
        choice1: category,
        choice2: size,
        choice3: amount,
        optionPrice: optionPrice(actualPrice),
        use: actualPrice == null ? "N" : "Y",
        code: `${category === "밀웜" ? "MW" : "SW"}-${romanizeSize(size)}-${romanizeAmount(amount)}`
      };
    }))
  )),
  ...dryWeights.map((weight) => {
    const actualPrice = driedMealwormPrices.get(weight);
    return {
      choice1: "건조밀웜",
      choice2: weight,
      choice3: "단일",
      optionPrice: optionPrice(actualPrice),
      use: "Y",
      code: `DMW-${romanizeAmount(weight)}`
    };
  }),
  ...dryWeights.map((weight) => {
    const actualPrice = driedSuperwormPrices.get(weight);
    return {
      choice1: "건조슈퍼밀웜",
      choice2: weight,
      choice3: "단일",
      optionPrice: optionPrice(actualPrice),
      use: "Y",
      code: `DSW-${romanizeAmount(weight)}`
    };
  })
];

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

function romanizeSize(size) {
  return ({ "소": "S", "중": "M", "대": "L" })[size] || size;
}

function livePrice(category, amount) {
  if (category === "밀웜") return mealwormPrices.get(amount) ?? null;
  return superwormPrices.get(amount);
}

function optionPrice(actualPrice) {
  if (actualPrice == null) return 0;
  return actualPrice - baseSalePrice;
}

function romanizeAmount(amount) {
  return amount
    .replace("마리", "")
    .replace(".", "_")
    .replace("kg", "KG");
}

function createWorkbook(sheets) {
  const files = new Map();
  files.set("[Content_Types].xml", contentTypesXml(sheets.length));
  files.set("_rels/.rels", rootRelsXml());
  files.set("xl/workbook.xml", workbookXml(sheets));
  files.set("xl/_rels/workbook.xml.rels", workbookRelsXml(sheets.length));
  files.set("xl/styles.xml", stylesXml());

  sheets.forEach((sheet, index) => {
    files.set(`xl/worksheets/sheet${index + 1}.xml`, worksheetXml(sheet.rows));
  });

  return zipStore(files);
}

function contentTypesXml(sheetCount) {
  const sheetOverrides = Array.from({ length: sheetCount }, (_, index) => (
    `<Override PartName="/xl/worksheets/sheet${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`
  )).join("");

  return xml(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  ${sheetOverrides}
</Types>`);
}

function rootRelsXml() {
  return xml(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`);
}

function workbookXml(sheets) {
  const sheetXml = sheets.map((sheet, index) => (
    `<sheet name="${escapeXml(sheet.name)}" sheetId="${index + 1}" r:id="rId${index + 1}"/>`
  )).join("");

  return xml(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>${sheetXml}</sheets>
</workbook>`);
}

function workbookRelsXml(sheetCount) {
  const worksheetRels = Array.from({ length: sheetCount }, (_, index) => (
    `<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${index + 1}.xml"/>`
  )).join("");

  return xml(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  ${worksheetRels}
  <Relationship Id="rId${sheetCount + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`);
}

function stylesXml() {
  return xml(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts>
  <fills count="1"><fill><patternFill patternType="none"/></fill></fills>
  <borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs>
  <cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`);
}

function worksheetXml(rows) {
  const maxColumns = Math.max(...rows.map((row) => row.length));
  const columnXml = Array.from({ length: maxColumns }, (_, index) => (
    `<col min="${index + 1}" max="${index + 1}" width="${index < 3 ? 16 : 14}" customWidth="1"/>`
  )).join("");

  const rowXml = rows.map((row, rowIndex) => {
    const cells = row.map((value, columnIndex) => cellXml(rowIndex + 1, columnIndex + 1, value)).join("");
    return `<row r="${rowIndex + 1}">${cells}</row>`;
  }).join("");

  return xml(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <cols>${columnXml}</cols>
  <sheetData>${rowXml}</sheetData>
</worksheet>`);
}

function cellXml(rowIndex, columnIndex, value) {
  const ref = `${columnName(columnIndex)}${rowIndex}`;
  if (typeof value === "number" && Number.isFinite(value)) {
    return `<c r="${ref}"><v>${value}</v></c>`;
  }
  const text = value == null ? "" : String(value);
  return `<c r="${ref}" t="inlineStr"><is><t>${escapeXml(text)}</t></is></c>`;
}

function columnName(index) {
  let name = "";
  let current = index;
  while (current > 0) {
    const remainder = (current - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    current = Math.floor((current - 1) / 26);
  }
  return name;
}

function xml(value) {
  return value.trim();
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function zipStore(files) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const [name, content] of files.entries()) {
    const nameBuffer = Buffer.from(name, "utf8");
    const data = Buffer.isBuffer(content) ? content : Buffer.from(content, "utf8");
    const crc = crc32(data);
    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0, 6);
    localHeader.writeUInt16LE(0, 8);
    localHeader.writeUInt16LE(0, 10);
    localHeader.writeUInt16LE(0, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(data.length, 18);
    localHeader.writeUInt32LE(data.length, 22);
    localHeader.writeUInt16LE(nameBuffer.length, 26);
    localHeader.writeUInt16LE(0, 28);

    localParts.push(localHeader, nameBuffer, data);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0, 8);
    centralHeader.writeUInt16LE(0, 10);
    centralHeader.writeUInt16LE(0, 12);
    centralHeader.writeUInt16LE(0, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(data.length, 20);
    centralHeader.writeUInt32LE(data.length, 24);
    centralHeader.writeUInt16LE(nameBuffer.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);

    centralParts.push(centralHeader, nameBuffer);
    offset += localHeader.length + nameBuffer.length + data.length;
  }

  const centralDirectory = Buffer.concat(centralParts);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(files.size, 8);
  end.writeUInt16LE(files.size, 10);
  end.writeUInt32LE(centralDirectory.length, 12);
  end.writeUInt32LE(offset, 16);
  end.writeUInt16LE(0, 20);

  return Buffer.concat([...localParts, centralDirectory, end]);
}

function crc32(buffer) {
  const table = getCrcTable();
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = (crc >>> 8) ^ table[(crc ^ byte) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function getCrcTable() {
  if (crcTable) return crcTable;

  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let value = index;
    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }
    table[index] = value >>> 0;
  }
  crcTable = table;
  return crcTable;
}
