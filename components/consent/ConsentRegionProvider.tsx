"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import type { ConsentRegion } from "@/lib/consent/consentRegion";
import { readConsentRegionFromCookie } from "@/lib/consent/readConsentRegion";

const ConsentRegionContext = createContext<ConsentRegion>("consent_required");

function subscribe(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("focus", onStoreChange);
  document.addEventListener("visibilitychange", onStoreChange);
  return () => {
    window.removeEventListener("focus", onStoreChange);
    document.removeEventListener("visibilitychange", onStoreChange);
  };
}

function getClientConsentRegion(): ConsentRegion {
  return readConsentRegionFromCookie() ?? "consent_required";
}

function getServerSnapshot(): ConsentRegion {
  return "consent_required";
}

export function ConsentRegionProvider({ children }: { children: ReactNode }) {
  const region = useSyncExternalStore(subscribe, getClientConsentRegion, getServerSnapshot);
  const value = useMemo(() => region, [region]);

  return <ConsentRegionContext.Provider value={value}>{children}</ConsentRegionContext.Provider>;
}

export function useConsentRegion(): ConsentRegion {
  return useContext(ConsentRegionContext);
}

export function useConsentBannerRequired(): boolean {
  return useConsentRegion() === "consent_required";
}
