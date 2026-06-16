import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const newsDir = path.join(__dirname, "../data/news");
let timer = null;
let building = false;

function buildNews() {
  if (building) return;
  building = true;

  const child = spawn("node", ["scripts/build-news.mjs"], {
    cwd: path.join(__dirname, ".."),
    stdio: "inherit",
    shell: true,
  });

  child.on("exit", () => {
    building = false;
  });
}

function scheduleBuild(filename) {
  if (!filename || !filename.endsWith(".md") || filename.toLowerCase() === "readme.md") {
    return;
  }

  clearTimeout(timer);
  timer = setTimeout(() => {
    console.log(`[news:watch] ${filename} changed — rebuilding news…`);
    buildNews();
  }, 150);
}

buildNews();

fs.watch(newsDir, { recursive: false }, (_event, filename) => {
  scheduleBuild(filename);
});

console.log("[news:watch] Watching data/news/*.md");
