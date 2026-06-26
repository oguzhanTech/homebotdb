"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getRobotsBySlugs } from "@/lib/data/repository";

const STORAGE_KEY = "homebotradar-favorites";
const LEGACY_STORAGE_KEY = "homebotdb-favorites";

function readStoredFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    let stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      stored = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (stored) localStorage.setItem(STORAGE_KEY, stored);
    }
    if (stored) return JSON.parse(stored) as string[];
  } catch {
    // ignore
  }
  return [];
}

interface FavoritesContextValue {
  slugs: string[];
  toggle: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
  isFavorite: (slug: string) => boolean;
  count: number;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSlugs(readStoredFavorites());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  }, [slugs, ready]);

  const toggle = useCallback((slug: string) => {
    setSlugs((current) =>
      current.includes(slug)
        ? current.filter((s) => s !== slug)
        : [...current, slug],
    );
  }, []);

  const remove = useCallback((slug: string) => {
    setSlugs((current) => current.filter((s) => s !== slug));
  }, []);

  const clear = useCallback(() => setSlugs([]), []);

  const value = useMemo<FavoritesContextValue>(() => {
    const validSlugs = getRobotsBySlugs(slugs).map((r) => r.slug);
    return {
      slugs: validSlugs,
      toggle,
      remove,
      clear,
      isFavorite: (slug: string) => validSlugs.includes(slug),
      count: validSlugs.length,
    };
  }, [slugs, toggle, remove, clear]);

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
