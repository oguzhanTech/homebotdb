import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const newsDir = path.join(__dirname, "../data/news");
const outFile = path.join(__dirname, "../data/news.generated.json");

const REQUIRED = ["title", "authorId", "summary", "createdAt"];
const VALID_AUTHORS = new Set([
  "oguzhan-aydin",
  "chuck-steward",
  "maya-chen",
]);

function toIso(value) {
  if (value instanceof Date) return value.toISOString();
  return String(value).trim();
}

function loadNews() {
  if (!fs.existsSync(newsDir)) {
    fs.mkdirSync(newsDir, { recursive: true });
    fs.writeFileSync(outFile, "[]\n");
    console.log("Built 0 news articles → data/news.generated.json");
    return;
  }

  const files = fs
    .readdirSync(newsDir)
    .filter((file) => file.endsWith(".md") && file.toLowerCase() !== "readme.md")
    .sort();

  const articles = [];

  for (const file of files) {
    const filePath = path.join(newsDir, file);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    const slug = String(data.slug ?? file.replace(/\.md$/, "")).trim();

    for (const key of REQUIRED) {
      if (!data[key] || String(data[key]).trim() === "") {
        throw new Error(`${file}: missing required frontmatter field "${key}"`);
      }
    }

    if (!VALID_AUTHORS.has(data.authorId)) {
      throw new Error(
        `${file}: invalid authorId "${data.authorId}". Use oguzhan-aydin, chuck-steward, or maya-chen.`,
      );
    }

    articles.push({
      id: String(data.id ?? slug).trim(),
      title: String(data.title).trim(),
      slug,
      type: "news",
      authorId: data.authorId,
      robotSlug: data.robotSlug ? String(data.robotSlug).trim() : undefined,
      summary: String(data.summary).trim(),
      content: content.trim(),
      coverImage: data.coverImage ? String(data.coverImage).trim() : undefined,
      sourceUrl: data.sourceUrl ? String(data.sourceUrl).trim() : undefined,
      createdAt: toIso(data.createdAt),
      updatedAt: toIso(data.updatedAt ?? data.createdAt),
    });
  }

  fs.writeFileSync(outFile, `${JSON.stringify(articles, null, 2)}\n`);
  console.log(`Built ${articles.length} news article(s) → data/news.generated.json`);
}

loadNews();
