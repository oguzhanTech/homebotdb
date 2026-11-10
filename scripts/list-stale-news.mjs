#!/usr/bin/env node
/**
 * List news articles by oldest updatedAt (news update scan ranking).
 * Usage:
 *   node scripts/list-stale-news.mjs
 *   node scripts/list-stale-news.mjs --limit 8
 *   node scripts/list-stale-news.mjs --json
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const newsDir = join(__dirname, "..", "data", "news");

const limitArg = process.argv.indexOf("--limit");
const limit =
  limitArg >= 0 && process.argv[limitArg + 1]
    ? Math.max(1, Number(process.argv[limitArg + 1]) || 8)
    : 8;
const asJson = process.argv.includes("--json");

function field(raw, key) {
  const match = raw.match(new RegExp(`^${key}:\\s*"?([^"\\n]+)"?\\s*$`, "m"));
  return match ? match[1].trim() : "";
}

/** @type {{ slug: string, title: string, updatedAt: string, createdAt: string, daysStale: number }[]} */
const articles = [];

for (const file of readdirSync(newsDir)) {
  if (!file.endsWith(".md") || file.toLowerCase() === "readme.md") continue;
  const raw = readFileSync(join(newsDir, file), "utf8");
  const createdAt = field(raw, "createdAt");
  const updatedAt = field(raw, "updatedAt") || createdAt;
  const slug = field(raw, "slug") || file.replace(/\.md$/, "");
  const title = field(raw, "title");
  const updated = new Date(updatedAt);
  const daysStale = Number.isNaN(updated.getTime())
    ? 9999
    : Math.floor((Date.now() - updated.getTime()) / (1000 * 60 * 60 * 24));
  articles.push({ slug, title, updatedAt, createdAt, daysStale });
}

articles.sort((a, b) => {
  if (a.updatedAt !== b.updatedAt) return a.updatedAt < b.updatedAt ? -1 : 1;
  return a.slug.localeCompare(b.slug);
});

const sliced = articles.slice(0, limit);

if (asJson) {
  console.log(JSON.stringify({ total: articles.length, items: sliced }, null, 2));
  process.exit(0);
}

console.log(
  `News ranking (oldest updatedAt first). Showing ${sliced.length} of ${articles.length}\n`,
);
console.log(
  "days".padStart(5),
  "updatedAt".padEnd(22),
  "slug".padEnd(42),
  "title",
);
console.log("-".repeat(100));
for (const row of articles.slice(0, limit)) {
  console.log(
    String(row.daysStale).padStart(5),
    row.updatedAt.padEnd(22),
    row.slug.padEnd(42),
    row.title,
  );
}
console.log("\nNews scan: research the top 2 unless the user named other slugs.");
