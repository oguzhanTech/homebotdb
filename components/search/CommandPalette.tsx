"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { getRobots } from "@/lib/data/repository";
import { getUpdates } from "@/lib/data/repository";
import { getUpdatePublicPath } from "@/lib/update-paths";
import { cn } from "@/lib/utils";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const robots = useMemo(() => getRobots(), []);
  const updates = useMemo(() => getUpdates(), []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filteredRobots = robots.filter((robot) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      robot.name.toLowerCase().includes(q) ||
      robot.brand.toLowerCase().includes(q)
    );
  });

  const filteredUpdates = updates.filter((update) => {
    if (!query) return true;
    return update.title.toLowerCase().includes(query.toLowerCase());
  });

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-ink/20 p-4 pt-[15vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-[18px] border border-line bg-panel-strong shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search robots, updates..."
          className="w-full border-b border-line px-4 py-4 text-sm outline-none"
        />
        <div className="max-h-[50vh] overflow-y-auto p-2">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-muted">
            Robots
          </div>
          {filteredRobots.slice(0, 6).map((robot) => (
            <Link
              key={robot.slug}
              href={`/robots/${robot.slug}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-blue-soft"
            >
              <BrandLogo brand={robot.brand} size="xs" />
              <span className="font-bold">{robot.name}</span>
              <span className="text-muted">{robot.brand}</span>
            </Link>
          ))}
          <div className="mt-2 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-muted">
            Updates
          </div>
          {filteredUpdates.slice(0, 4).map((update) => (
            <Link
              key={update.slug}
              href={getUpdatePublicPath(update)}
              onClick={() => setOpen(false)}
              className={cn("block rounded-xl px-3 py-2 text-sm hover:bg-blue-soft")}
            >
              {update.title}
            </Link>
          ))}
          <div className="mt-2 grid gap-1 border-t border-line pt-2">
            <Link href="/compare" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2 text-sm hover:bg-blue-soft">
              Compare robots
            </Link>
            <Link href="/wizard" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2 text-sm hover:bg-blue-soft">
              Robot wizard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
