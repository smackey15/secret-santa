import { randomInt } from "node:crypto";
import {
  mkdirSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const drawsDir = join(root, "draws");
const familyPath = join(root, "family.json");
const resultsPath = join(root, "admin-results.txt");

const WORDS = [
  "MAPLE", "RIVER", "CEDAR", "PINE", "COCOA", "FROST", "BERRY", "OLIVE",
  "AMBER", "HAZEL", "CORAL", "IVORY", "MOSS", "PEARL", "SAGE", "FLINT",
  "EMBER", "CLOVE", "HONEY", "WILLOW", "ASPEN", "DAWN", "LUMEN", "QUILL",
];

function shuffle(list) {
  const items = [...list];
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function cycleAssignments(names) {
  const shuffled = shuffle(names);
  const assignments = {};
  for (let i = 0; i < shuffled.length; i += 1) {
    assignments[shuffled[i]] = shuffled[(i + 1) % shuffled.length];
  }
  return assignments;
}

function makeCode(used) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const word = WORDS[randomInt(WORDS.length)];
    const digits = String(randomInt(100)).padStart(2, "0");
    const code = `${word}-${digits}`;
    if (!used.has(code)) {
      used.add(code);
      return code;
    }
  }
  throw new Error("Could not generate a unique code. Try again.");
}

function clearDraws() {
  mkdirSync(drawsDir, { recursive: true });
  for (const file of readdirSync(drawsDir)) {
    if (file.endsWith(".json")) {
      unlinkSync(join(drawsDir, file));
    }
  }
}

const raw = JSON.parse(readFileSync(familyPath, "utf8"));
const family = [...new Set((raw.family ?? []).map((name) => String(name).trim()).filter(Boolean))];

if (family.length < 2) {
  console.error("Add at least two names to family.json.");
  process.exit(1);
}

if (family.length !== (raw.family ?? []).length) {
  console.warn("Removed empty or duplicate names before drawing.");
}

const assignments = cycleAssignments(family);
const usedCodes = new Set();
const rows = family.map((name) => {
  const code = makeCode(usedCodes);
  const drew = assignments[name];
  return { name, code, drew };
});

clearDraws();

for (const row of rows) {
  writeFileSync(
    join(drawsDir, `${row.code}.json`),
    `${JSON.stringify({ name: row.name, drew: row.drew }, null, 2)}\n`,
  );
}

const table = [
  "Secret Santa — organizer copy (do not deploy or share this file)",
  "Text each person only the site URL and THEIR code.",
  "This list does not include who anyone drew.",
  "",
  "Name".padEnd(16) + "Code",
  "-".repeat(30),
  ...rows.map((row) => row.name.padEnd(16) + row.code),
  "",
  "Share each code privately. Do not post this full list in the family chat.",
  "Do not open files in draws/ if you want to stay blind to the matches.",
].join("\n");

writeFileSync(resultsPath, `${table}\n`);

console.log(table);
console.log(`\nWrote ${rows.length} files in draws/ and saved ${resultsPath}`);
console.log("admin-results.txt is gitignored — keep it on your computer only.");
