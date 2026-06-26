"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SearchBrowseIcon, SearchArticleIcon } from "@/components/search/SearchBrowseIcon";
import {
  groupSiteSearchResults,
  searchSite,
} from "@/lib/site-search";
import { cn } from "@/lib/utils";
import { uiCopy } from "@/config/ui-copy";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = useMemo(() => searchSite(query, 12), [query]);
  const grouped = useMemo(() => groupSiteSearchResults(results), [results]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("homebot:open-command-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("homebot:open-command-palette", onOpen);
    };
  }, []);

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
          placeholder="Search robots, news, and radar feed..."
          className="w-full border-b border-line px-4 py-4 text-sm outline-none"
        />
        <div className="max-h-[50vh] overflow-x-hidden overflow-y-auto p-2">
          {query.trim().length >= 2 ? (
            <>
              {grouped.filters.length > 0 ? (
                <>
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-muted">
                    Browse
                  </div>
                  {grouped.filters.map((filter) => (
                    <Link
                      key={filter.id}
                      href={filter.href}
                      onClick={() => setOpen(false)}
                      title={`${filter.title} — ${filter.subtitle}`}
                      className="flex min-w-0 items-center gap-2 overflow-hidden rounded-xl px-3 py-2 text-sm hover:bg-blue-soft"
                    >
                      <SearchBrowseIcon
                        kind={filter.kind}
                        id={filter.id}
                        title={filter.title}
                      />
                      <span className="min-w-0 flex-1 overflow-hidden">
                        <span className="block truncate font-bold">{filter.title}</span>
                        <span className="block truncate text-xs text-muted">
                          {filter.subtitle}
                        </span>
                      </span>
                    </Link>
                  ))}
                </>
              ) : null}
              {grouped.robots.length > 0 ? (
                <>
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-muted">
                    Robots
                  </div>
                  {grouped.robots.map((robot) => (
                    <Link
                      key={robot.id}
                      href={robot.href}
                      onClick={() => setOpen(false)}
                      title={`${robot.title} — ${robot.subtitle}`}
                      className="flex min-w-0 items-center gap-2 overflow-hidden rounded-xl px-3 py-2 text-sm hover:bg-blue-soft"
                    >
                      <BrandLogo brand={robot.subtitle} size="xs" className="shrink-0" />
                      <span className="min-w-0 flex-1 overflow-hidden">
                        <span className="block truncate font-bold">{robot.title}</span>
                        <span className="block truncate text-xs text-muted">{robot.subtitle}</span>
                      </span>
                    </Link>
                  ))}
                </>
              ) : null}
              {grouped.articles.length > 0 ? (
                <>
                  <div className="mt-2 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-muted">
                    {uiCopy.search.sectionNewsAndRadar}
                  </div>
                  {grouped.articles.map((update) => (
                    <Link
                      key={update.id}
                      href={update.href}
                      onClick={() => setOpen(false)}
                      title={
                        update.date
                          ? `${update.title} — ${update.date}`
                          : update.title
                      }
                      className={cn(
                        "flex min-w-0 items-center gap-2 overflow-hidden rounded-xl px-3 py-2 text-sm hover:bg-blue-soft",
                      )}
                    >
                      <SearchArticleIcon
                        kind={update.kind === "news" ? "news" : "update"}
                      />
                      <span className="min-w-0 flex-1 overflow-hidden">
                        <span className="flex min-w-0 items-baseline gap-2">
                          <span className="min-w-0 truncate">{update.title}</span>
                          {update.date ? (
                            <span className="shrink-0 text-[11px] text-muted/70">
                              {update.date}
                            </span>
                          ) : null}
                        </span>
                      </span>
                    </Link>
                  ))}
                </>
              ) : null}
              {results.length === 0 ? (
                <div className="px-3 py-4 text-sm text-muted">No matches found.</div>
              ) : null}
            </>
          ) : (
            <div className="px-3 py-4 text-sm text-muted">
              Type at least 2 characters to search.
            </div>
          )}
          <div className="mt-2 grid gap-1 border-t border-line pt-2">
            <Link href="/compare" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2 text-sm hover:bg-blue-soft">
              {uiCopy.search.compareRobots}
            </Link>
            <Link href="/tracked" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2 text-sm hover:bg-blue-soft">
              {uiCopy.search.trackedRobots}
            </Link>
            <Link href="/wizard" onClick={() => setOpen(false)} className="rounded-xl px-3 py-2 text-sm hover:bg-blue-soft">
              {uiCopy.nav.robotMatchmaker}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
