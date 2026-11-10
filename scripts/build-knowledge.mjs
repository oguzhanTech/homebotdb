import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const knowledgeDir = path.join(__dirname, "../data/knowledge");
const outFile = path.join(__dirname, "../data/knowledge.generated.json");
const robotsFile = path.join(__dirname, "../data/robots.ts");
const comparesFile = path.join(__dirname, "../data/indexable-compares.ts");
const rankingsDir = path.join(__dirname, "../data/rankings");

const CATEGORIES = new Set(["buying", "price", "shipping", "capabilities", "safety"]);
const REQUIRED = [
  "title",
  "description",
  "summary",
  "shortAnswer",
  "category",
  "publishedAt",
  "updatedAt",
  "compareSlug",
  "rankingSlug",
];
const QUESTION_HEADING = /^#{2,3}\s+(How|What|Why|Can|Does|Is|When|Where)\b/i;

function toIso(value) {
  if (value instanceof Date) return value.toISOString();
  return String(value).trim();
}

function assertNoEmDash(file, label, value) {
  if (String(value).includes("—")) {
    throw new Error(`${file}: em dash in ${label}`);
  }
}

function countWords(text) {
  const plain = text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/\/[a-z0-9/-]+/g, " ")
    .replace(/[#>*_~`]/g, " ");
  return plain.split(/\s+/).filter(Boolean).length;
}

function catalogSlugs() {
  const text = fs.readFileSync(robotsFile, "utf8");
  return new Set([...text.matchAll(/slug: "([^"]+)"/g)].map((match) => match[1]));
}

function indexableCompareSlugs() {
  const text = fs.readFileSync(comparesFile, "utf8");
  const pairs = [...text.matchAll(/\["([a-z0-9-]+)", "([a-z0-9-]+)"\]/g)];
  return new Set(pairs.map(([, left, right]) => [left, right].sort().join("-vs-")));
}

function rankingSlugs() {
  if (!fs.existsSync(rankingsDir)) return new Set();
  return new Set(
    fs
      .readdirSync(rankingsDir)
      .filter((file) => file.endsWith(".md"))
      .map((file) => file.replace(/\.md$/, "")),
  );
}

function loadKnowledge() {
  if (!fs.existsSync(knowledgeDir)) {
    fs.mkdirSync(knowledgeDir, { recursive: true });
  }

  const robots = catalogSlugs();
  const compares = indexableCompareSlugs();
  const rankings = rankingSlugs();
  const files = fs
    .readdirSync(knowledgeDir)
    .filter((file) => file.endsWith(".md") && file.toLowerCase() !== "readme.md")
    .sort();

  const articles = [];
  const slugs = new Set();

  for (const file of files) {
    const filePath = path.join(knowledgeDir, file);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    const slug = String(data.slug ?? file.replace(/\.md$/, "")).trim();

    for (const key of REQUIRED) {
      if (data[key] === undefined || String(data[key]).trim() === "") {
        throw new Error(`${file}: missing required frontmatter field "${key}"`);
      }
    }

    if (CATEGORIES.has(slug)) {
      throw new Error(`${file}: slug "${slug}" is reserved for a category`);
    }
    if (slugs.has(slug)) {
      throw new Error(`${file}: duplicate slug "${slug}"`);
    }
    slugs.add(slug);

    const category = String(data.category).trim();
    if (!CATEGORIES.has(category)) {
      throw new Error(
        `${file}: invalid category "${category}". Use buying, price, shipping, capabilities, or safety.`,
      );
    }

    const robotSlugs = Array.isArray(data.robotSlugs)
      ? data.robotSlugs.map((value) => String(value).trim()).filter(Boolean)
      : [];
    if (robotSlugs.length < 2) {
      throw new Error(`${file}: robotSlugs needs at least 2 catalog robots`);
    }
    for (const robotSlug of robotSlugs) {
      if (!robots.has(robotSlug)) {
        throw new Error(`${file}: unknown robot slug "${robotSlug}"`);
      }
    }

    const compareSlug = String(data.compareSlug).trim();
    if (!compares.has(compareSlug)) {
      throw new Error(`${file}: compareSlug "${compareSlug}" is not indexable`);
    }

    const rankingSlug = String(data.rankingSlug).trim();
    if (!rankings.has(rankingSlug)) {
      throw new Error(`${file}: unknown ranking "${rankingSlug}"`);
    }

    if (data.source) {
      throw new Error(`${file}: use sources, a list of {label, url}, not source`);
    }
    const sourceItems = Array.isArray(data.sources) ? data.sources : [];
    if (sourceItems.length < 2) {
      throw new Error(`${file}: sources needs at least 2 official pages`);
    }
    const seenSourceUrls = new Set();
    const sources = [];
    for (const item of sourceItems) {
      const label = String(item?.label ?? "").trim();
      const url = String(item?.url ?? "").trim();
      if (!label || !url || !/^https?:\/\//.test(url)) {
        throw new Error(`${file}: each source needs a label and an http(s) url`);
      }
      if (seenSourceUrls.has(url)) {
        throw new Error(`${file}: duplicate source url "${url}"`);
      }
      seenSourceUrls.add(url);
      assertNoEmDash(file, "source label", label);
      sources.push({ label, url });
    }

    const body = content.trim();
    const words = countWords(body);
    if (words < 400 || words > 700) {
      throw new Error(`${file}: body must be 400–700 words (got ${words})`);
    }

    for (const line of body.split("\n")) {
      if (QUESTION_HEADING.test(line.trim())) {
        throw new Error(`${file}: question heading "${line.trim()}"`);
      }
    }

    const shortAnswer = String(data.shortAnswer).trim();
    assertNoEmDash(file, "title", String(data.title));
    assertNoEmDash(file, "description", String(data.description));
    assertNoEmDash(file, "summary", String(data.summary));
    assertNoEmDash(file, "shortAnswer", shortAnswer);
    assertNoEmDash(file, "body", body);

    articles.push({
      title: String(data.title).trim(),
      slug,
      description: String(data.description).trim(),
      summary: String(data.summary).trim(),
      shortAnswer,
      category,
      publishedAt: toIso(data.publishedAt),
      updatedAt: toIso(data.updatedAt),
      robotSlugs,
      compareSlug,
      rankingSlug,
      sources,
      content: body,
    });
  }

  articles.sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
  fs.writeFileSync(outFile, `${JSON.stringify(articles, null, 2)}\n`);
  console.log(`Built ${articles.length} knowledge answer(s) → data/knowledge.generated.json`);
}

loadKnowledge();
