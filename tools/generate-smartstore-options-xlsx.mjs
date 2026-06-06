import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const outputDir = path.join(rootDir, "exports", "options");
const outputPath = path.join(outputDir, "mealworm7th_smartstore_options.xlsx");
let crcTable;

const sizes = ["소", "중", "대"];
const counts = ["500마리", "1000마리", "2000마리", "3000마리", "5000마리"];

const rows = [
  ...sizes.map((size) => ({
    category: "밀웜",
    detail: `생밀웜 1kg / ${size}`,
    code: `MW-LIVE-1KG-${romanizeSize(size)}`,
    memo: "1kg 중량 기준, 크기 선택"
  })),
  ...sizes.flatMap((size) => counts.map((count) => ({
    category: "슈퍼밀웜",
    detail: `마리수형 / ${size} / ${count}`,
    code: `SW-COUNT-${romanizeSize(size)}-${count.replace("마리", "")}`,
    memo: "마리수형, 크기/수량 선택"
  }))),
  ...sizes.map((size) => ({
    category: "슈퍼밀웜",
    detail: `슈퍼밀웜 1kg / ${size}`,
    code: `SW-LIVE-1KG-${romanizeSize(size)}`,
    memo: "1kg 중량 기준, 크기 선택"
  })),
  ...["0.5kg", "1.0kg"].map((weight) => ({
    category: "건조 밀웜",
    detail: `건조밀웜 / ${weight}`,
    code: `MW-DRIED-${weight.replace(".", "_").replace("kg", "KG")}`,
    memo: "건조 상품, 중량 선택"
  })),
  ...["0.5kg", "1.0kg"].map((weight) => ({
    category: "건조슈퍼밀웜",
    detail: `건조슈퍼밀웜 / ${weight}`,
    code: `SW-DRIED-${weight.replace(".", "_").replace("kg", "KG")}`,
    memo: "건조 상품, 중량 선택"
  }))
];

const validKeys = new Set(rows.map((row) => `${row.category}|||${row.detail}`));
const categories = ["밀웜", "슈퍼밀웜", "건조 밀웜", "건조슈퍼밀웜"];
const details = rows.map((row) => row.detail);
const allCombinationRows = categories.flatMap((category) => details.map((detail) => {
  const isValid = validKeys.has(`${category}|||${detail}`);
  return {
    category,
    detail,
    status: isValid ? "판매 가능" : "사용여부 N / 미노출",
    memo: isValid ? "정상 조합" : "카테고리와 세부 선택 불일치"
  };
}));

const workbook = createWorkbook([
  {
    name: "네이버_조합옵션",
    rows: [
      ["옵션명1", "옵션값1", "옵션명2", "옵션값2", "옵션가", "재고수량", "사용여부", "판매자관리코드", "관리메모"],
      ...rows.map((row) => [
        "상품 카테고리",
        row.category,
        "세부 선택",
        row.detail,
        "",
        "",
        "Y",
        row.code,
        row.memo
      ])
    ]
  },
  {
    name: "가격재고_입력표",
    rows: [
      ["상품 카테고리", "세부 선택", "실제 판매가", "기준 판매가", "옵션가", "재고수량", "판매상태", "사용여부", "판매자관리코드", "메모"],
      ...rows.map((row) => [
        row.category,
        row.detail,
        "",
        "",
        "",
        "",
        "판매중",
        "Y",
        row.code,
        row.memo
      ])
    ]
  },
  {
    name: "전체조합_점검",
    rows: [
      ["상품 카테고리", "세부 선택", "처리", "메모"],
      ...allCombinationRows.map((row) => [row.category, row.detail, row.status, row.memo])
    ]
  },
  {
    name: "사용안내",
    rows: [
      ["항목", "내용"],
      ["목적", "밀웜7번가 네이버 스마트스토어 조합형 옵션 입력용 원본표"],
      ["업로드 전 확인", "판매자센터에서 엑셀양식 다운(조합)을 받은 뒤, 이 파일의 네이버_조합옵션 시트를 양식에 맞게 붙여넣어 사용하세요."],
      ["가격/재고", "옵션가와 재고수량은 가격표 확정 후 입력하세요. 정상 판매중이며 옵션가 0원인 옵션이 하나 이상 필요합니다."],
      ["조합 정리", "전체조합_점검 시트에서 사용여부 N / 미노출 조합은 고객 화면에 노출되지 않도록 관리하세요."],
      ["주의", "네이버 양식이 변경될 수 있으므로 최종 업로드 파일은 판매자센터에서 받은 최신 양식을 기준으로 저장하세요."]
    ]
  }
]);

await mkdir(outputDir, { recursive: true });
await writeFile(outputPath, workbook);

console.log(`Generated ${path.relative(rootDir, outputPath)}`);
console.log(`Option rows: ${rows.length}`);
console.log(`Combination check rows: ${allCombinationRows.length}`);

function romanizeSize(size) {
  return ({ "소": "S", "중": "M", "대": "L" })[size] || size;
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
    `<col min="${index + 1}" max="${index + 1}" width="${index < 4 ? 24 : 16}" customWidth="1"/>`
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
