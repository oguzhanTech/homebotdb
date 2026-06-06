"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SearchBrowseIcon, SearchArticleIcon } from "@/components/search/SearchBrowseIcon";
import { SearchInput } from "@/components/ui/SearchInput";
import {
  groupSiteSearchResults,
  searchSite,
  type SiteSearchResult,
} from "@/lib/site-search";
import { cn } from "@/lib/utils";

function TopBarSearchField() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => searchSite(query), [query]);
  const grouped = useMemo(() => groupSiteSearchResults(results), [results]);
  const flatResults = useMemo(
    () => [...grouped.filters, ...grouped.robots, ...grouped.articles],
    [grouped.articles, grouped.filters, grouped.robots],
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const navigateTo = (result: SiteSearchResult) => {
    setOpen(false);
    setQuery("");
    router.push(result.href);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }

    if (flatResults.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => (index + 1) % flatResults.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => (index - 1 + flatResults.length) % flatResults.length);
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      navigateTo(flatResults[activeIndex] ?? flatResults[0]);
    }
  };

  const showDropdown = open && query.trim().length >= 2;

  return (
    <div ref={rootRef} className="relative min-w-0">
      <label className="flex h-[42px] items-center gap-3 rounded-[14px] border border-line bg-panel/82 px-4 text-sm text-muted shadow-card">
        <span aria-hidden className="shrink-0">
          ⌕
        </span>
        <SearchInput
          className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 shadow-none focus:border-0"
          placeholder="Search robots, brands, capabilities..."
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (query.trim().length >= 2) setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="topbar-search-results"
          aria-autocomplete="list"
          aria-label="Search robots and updates"
        />
        <TopBarSearchHint />
      </label>

      {showDropdown ? (
        <div
          id="topbar-search-results"
          role="listbox"
          className="absolute left-0 top-[calc(100%+8px)] z-50 w-[max(100%,min(520px,calc(100vw-2rem)))] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[14px] border border-line bg-panel-strong shadow-card"
        >
          {flatResults.length === 0 ? (
            <div className="px-4 py-3 text-sm text-muted">No matches found.</div>
          ) : (
            <div className="max-h-[min(60vh,360px)] overflow-x-hidden overflow-y-auto p-2">
              {grouped.filters.length > 0 ? (
                <SearchSection title="Browse">
                  {grouped.filters.map((result) => {
                    const index = flatResults.findIndex((entry) => entry.id === result.id);
                    return (
                      <SearchResultButton
                        key={result.id}
                        result={result}
                        active={index === activeIndex}
                        onSelect={() => navigateTo(result)}
                      />
                    );
                  })}
                </SearchSection>
              ) : null}

              {grouped.robots.length > 0 ? (
                <SearchSection title="Robots">
                  {grouped.robots.map((result) => {
                    const index = flatResults.findIndex((entry) => entry.id === result.id);
                    return (
                      <SearchResultButton
                        key={result.id}
                        result={result}
                        active={index === activeIndex}
                        onSelect={() => navigateTo(result)}
                      />
                    );
                  })}
                </SearchSection>
              ) : null}

              {grouped.articles.length > 0 ? (
                <SearchSection title="News & updates">
                  {grouped.articles.map((result) => {
                    const index = flatResults.findIndex((entry) => entry.id === result.id);
                    return (
                      <SearchResultButton
                        key={result.id}
                        result={result}
                        active={index === activeIndex}
                        onSelect={() => navigateTo(result)}
                      />
                    );
                  })}
                </SearchSection>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function SearchSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-1 min-w-0 last:mb-0">
      <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-muted">
        {title}
      </div>
      <div className="grid min-w-0 gap-0.5">{children}</div>
    </div>
  );
}

function searchResultTitle(result: SiteSearchResult) {
  return result.date
    ? `${result.title} — ${result.date}`
    : `${result.title} — ${result.subtitle}`;
}

function SearchResultIcon({ result }: { result: SiteSearchResult }) {
  if (result.kind === "robot") {
    return <BrandLogo brand={result.subtitle} size="xs" className="shrink-0" />;
  }

  if (result.kind === "task" || result.kind === "capability") {
    return (
      <SearchBrowseIcon kind={result.kind} id={result.id} title={result.title} />
    );
  }

  if (result.kind === "news" || result.kind === "update") {
    return <SearchArticleIcon kind={result.kind} />;
  }

  return null;
}

function SearchResultButton({
  result,
  active,
  onSelect,
}: {
  result: SiteSearchResult;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={active}
      title={searchResultTitle(result)}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onSelect}
      className={cn(
        "flex w-full min-w-0 items-center gap-2 overflow-hidden rounded-xl px-3 py-2 text-left text-sm transition-colors",
        active ? "bg-blue-soft text-ink" : "text-ink hover:bg-blue-soft/70",
      )}
    >
      <SearchResultIcon result={result} />
      <span className="min-w-0 flex-1 overflow-hidden">
        <span className="flex min-w-0 items-baseline gap-2">
          <span className="min-w-0 truncate font-bold">{result.title}</span>
          {result.date ? (
            <span className="shrink-0 text-[11px] font-normal text-muted/70">
              {result.date}
            </span>
          ) : null}
        </span>
        <span className="block truncate text-xs text-muted">{result.subtitle}</span>
      </span>
    </button>
  );
}

function TopBarSearchFallback() {
  return (
    <label className="flex h-[42px] items-center gap-3 rounded-[14px] border border-line bg-panel/82 px-4 text-sm text-muted shadow-card">
      <span aria-hidden>⌕</span>
      <SearchInput
        className="h-full min-w-0 flex-1 border-0 bg-transparent p-0 shadow-none focus:border-0"
        placeholder="Search robots, brands, capabilities..."
        aria-label="Search robots and updates"
        disabled
      />
      <TopBarSearchHint />
    </label>
  );
}

export function TopBarSearch() {
  return (
    <Suspense fallback={<TopBarSearchFallback />}>
      <TopBarSearchField />
    </Suspense>
  );
}

export function TopBarSearchHint({ className }: { className?: string }) {
  return (
    <button
      type="button"
      aria-label="Open command palette"
      className={cn(
        "ml-auto hidden shrink-0 font-mono text-xs text-muted transition-colors hover:text-ink sm:inline",
        className,
      )}
      onClick={() => window.dispatchEvent(new CustomEvent("homebot:open-command-palette"))}
    >
      ⌘K
    </button>
  );
}
