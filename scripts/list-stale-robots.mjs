#!/usr/bin/env node
/**
 * List catalog robots by oldest lastUpdated (staleness ranking for freshness pass).
 * Usage:
 *   node scripts/list-stale-robots.mjs
 *   node scripts/list-stale-robots.mjs --limit 10
 *   node scripts/list-stale-robots.mjs --json
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const robotsPath = join(__dirname, "..", "data", "robots.ts");
const source = readFileSync(robotsPath, "utf8");

const limitArg = process.argv.indexOf("--limit");
const limit =
  limitArg >= 0 && process.argv[limitArg + 1]
    ? Math.max(1, Number(process.argv[limitArg + 1]) || 12)
    : 12;
const asJson = process.argv.includes("--json");

/** @type {{ slug: string, name: string, lastUpdated: string, daysStale: number }[]} */
const robots = [];

const blockRe =
  /\{\s*id:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"[\s\S]*?slug:\s*"([^"]+)"[\s\S]*?lastUpdated:\s*"(\d{4}-\d{2}-\d{2})"/g;

let match;
while ((match = blockRe.exec(source)) !== null) {
  const [, id, name, slug, lastUpdated] = match;
  // Prefer slug; id is fallback if slug block order differs
  const key = slug || id;
  const updated = new Date(`${lastUpdated}T00:00:00Z`);
  const daysStale = Number.isNaN(updated.getTime())
    ? 9999
    : Math.floor((Date.now() - updated.getTime()) / (1000 * 60 * 60 * 24));
  robots.push({ slug: key, name, lastUpdated, daysStale });
}

robots.sort((a, b) => {
  if (a.lastUpdated !== b.lastUpdated) {
    return a.lastUpdated < b.lastUpdated ? -1 : 1;
  }
  return a.slug.localeCompare(b.slug);
});

const sliced = robots.slice(0, limit);

if (asJson) {
  console.log(JSON.stringify({ total: robots.length, items: sliced }, null, 2));
  process.exit(0);
}

console.log(
  `Stale ranking (oldest lastUpdated first). Showing ${sliced.length} of ${robots.length}\n`,
);
console.log(
  "days".padStart(5),
  "lastUpdated".padEnd(12),
  "slug".padEnd(28),
  "name",
);
console.log("-".repeat(72));
for (const row of sliced) {
  console.log(
    String(row.daysStale).padStart(5),
    row.lastUpdated.padEnd(12),
    row.slug.padEnd(28),
    row.name,
  );
}
console.log(
  "\nFreshness pass: research top 1–2 unless the user named other slugs.",
);
