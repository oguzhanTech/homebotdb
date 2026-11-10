import type { CookieConsentPreferences } from "@/lib/consent/cookieConsent";

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-9P14ZJ5JK6";

export const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "ca-pub-5128333026855810";

/**
 * AdSense script still loads for site review. Ad requests stay paused until
 * NEXT_PUBLIC_ADSENSE_SERVE_ADS=true and advertising consent is granted.
 */
export function isAdSenseServingEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ADSENSE_SERVE_ADS === "true";
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    adsbygoogle?: Array<Record<string, unknown>> & { pauseAdRequests?: number };
  }
}

function ensureGtag(): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
  }
}

function consentValue(granted: boolean): "granted" | "denied" {
  return granted ? "granted" : "denied";
}

export function syncAdSenseAdRequests(advertisingConsentGranted: boolean): void {
  if (typeof window === "undefined") return;
  const queue = (window.adsbygoogle =
    window.adsbygoogle ||
    ([] as Array<Record<string, unknown>> & { pauseAdRequests?: number }));
  const serve = isAdSenseServingEnabled() && advertisingConsentGranted;
  queue.pauseAdRequests = serve ? 0 : 1;
}

export function applyGoogleConsent(preferences: CookieConsentPreferences): void {
  if (typeof window === "undefined") return;

  ensureGtag();
  window.gtag?.("set", "ads_data_redaction", !preferences.advertising);
  window.gtag?.("consent", "update", {
    analytics_storage: consentValue(preferences.analytics),
    ad_storage: consentValue(preferences.advertising),
    ad_user_data: consentValue(preferences.advertising),
    ad_personalization: consentValue(preferences.advertising),
  });
  syncAdSenseAdRequests(preferences.advertising);
}
