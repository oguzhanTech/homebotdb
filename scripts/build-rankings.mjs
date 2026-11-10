import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rankingsDir = path.join(__dirname, "../data/rankings");
const outFile = path.join(__dirname, "../data/rankings.generated.json");

const REQUIRED = [
  "title",
  "description",
  "summary",
  "publishedAt",
  "updatedAt",
  "list",
  "order",
];
const LISTS = new Set([
  "buyable",
  "humanoid",
  "pets",
  "cheapest",
  "elder",
  "desktop500",
  "coming",
  "apartment",
]);

function toIso(value) {
  if (value instanceof Date) return value.toISOString();
  return String(value).trim();
}

function assertNoEmDash(file, label, value) {
  if (value.includes("—")) {
    throw new Error(`${file}: em dash in ${label}`);
  }
}

function loadRankings() {
  if (!fs.existsSync(rankingsDir)) {
    fs.mkdirSync(rankingsDir, { recursive: true });
  }

  const files = fs
    .readdirSync(rankingsDir)
    .filter((file) => file.endsWith(".md") && file.toLowerCase() !== "readme.md")
    .sort();

  const articles = [];
  const orders = new Set();

  for (const file of files) {
    const filePath = path.join(rankingsDir, file);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    const slug = String(data.slug ?? file.replace(/\.md$/, "")).trim();

    for (const key of REQUIRED) {
      if (data[key] === undefined || String(data[key]).trim() === "") {
        throw new Error(`${file}: missing required frontmatter field "${key}"`);
      }
    }

    if (!LISTS.has(data.list)) {
      throw new Error(
        `${file}: invalid list "${data.list}". Use buyable, humanoid, pets, cheapest, elder, desktop500, coming, or apartment.`,
      );
    }

    const order = Number(data.order);
    if (!Number.isInteger(order) || order < 1) {
      throw new Error(`${file}: order must be a positive integer`);
    }
    if (orders.has(order)) {
      throw new Error(`${file}: duplicate order ${order}`);
    }
    orders.add(order);

    if (!Array.isArray(data.faqs) || data.faqs.length < 3) {
      throw new Error(`${file}: faqs needs at least 3 questions`);
    }
    const faqs = data.faqs.map((faq, index) => {
      const q = String(faq?.q ?? "").trim();
      const a = String(faq?.a ?? "").trim();
      if (!q || !a) {
        throw new Error(`${file}: faq ${index + 1} needs q and a`);
      }
      assertNoEmDash(file, `faq ${index + 1}`, `${q} ${a}`);
      return { q, a };
    });

    const compareSlugs = Array.isArray(data.compareSlugs)
      ? data.compareSlugs.map((slugValue) => String(slugValue).trim()).filter(Boolean)
      : [];

    const body = content.trim();
    if (body.length < 400) {
      throw new Error(`${file}: body is too short to be more than a table`);
    }

    assertNoEmDash(file, "title", String(data.title));
    assertNoEmDash(file, "description", String(data.description));
    assertNoEmDash(file, "summary", String(data.summary));
    assertNoEmDash(file, "body", body);

    articles.push({
      title: String(data.title).trim(),
      slug,
      description: String(data.description).trim(),
      summary: String(data.summary).trim(),
      publishedAt: toIso(data.publishedAt),
      updatedAt: toIso(data.updatedAt),
      list: data.list,
      order,
      compareSlugs,
      faqs,
      content: body,
    });
  }

  articles.sort((a, b) => a.order - b.order);
  fs.writeFileSync(outFile, `${JSON.stringify(articles, null, 2)}\n`);
  console.log(
    `Built ${articles.length} ranking page(s) → data/rankings.generated.json`,
  );
}

loadRankings();
