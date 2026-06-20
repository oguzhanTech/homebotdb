"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { buildComparePath } from "@/lib/compare";
import { getRobotsBySlugs } from "@/lib/data/repository";

const STORAGE_KEY = "homebotradar-compare";
const LEGACY_STORAGE_KEY = "homebotdb-compare";
const MAX_COMPARE = 3;

function readStoredSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    let stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      stored = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (stored) localStorage.setItem(STORAGE_KEY, stored);
    }
    if (stored) {
      const parsed = JSON.parse(stored) as string[];
      if (Array.isArray(parsed)) return parsed.slice(0, MAX_COMPARE);
    }
  } catch {
    // ignore
  }
  return [];
}

interface CompareContextValue {
  slugs: string[];
  toggle: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
  isSelected: (slug: string) => boolean;
  isFull: boolean;
  comparePath: string | null;
  count: number;
}

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSlugs(readStoredSlugs());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  }, [slugs, ready]);

  const toggle = useCallback((slug: string) => {
    setSlugs((current) => {
      if (current.includes(slug)) {
        return current.filter((s) => s !== slug);
      }
      if (current.length >= MAX_COMPARE) return current;
      return [...current, slug];
    });
  }, []);

  const remove = useCallback((slug: string) => {
    setSlugs((current) => current.filter((s) => s !== slug));
  }, []);

  const clear = useCallback(() => setSlugs([]), []);

  const value = useMemo<CompareContextValue>(() => {
    const validSlugs = getRobotsBySlugs(slugs).map((r) => r.slug);
    return {
      slugs: validSlugs,
      toggle,
      remove,
      clear,
      isSelected: (slug: string) => validSlugs.includes(slug),
      isFull: validSlugs.length >= MAX_COMPARE,
      comparePath:
        validSlugs.length >= 2 ? buildComparePath(validSlugs) : null,
      count: validSlugs.length,
    };
  }, [slugs, toggle, remove, clear]);

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
