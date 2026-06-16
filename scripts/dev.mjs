import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const children = [];

function start(command, args) {
  const child = spawn(command, args, {
    cwd: root,
    stdio: "inherit",
    shell: true,
  });
  children.push(child);
  return child;
}

function shutdown(code = 0) {
  for (const child of children) {
    if (!child.killed) child.kill();
  }
  process.exit(code);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

start("node", ["scripts/watch-news.mjs"]);
const next = start("npx", ["next", "dev", "--webpack"]);

next.on("exit", (code) => shutdown(code ?? 0));
