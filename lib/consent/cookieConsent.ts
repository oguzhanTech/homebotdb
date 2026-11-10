export const COOKIE_CONSENT_STORAGE_KEY = "hbr_cookie_consent_v1";
export const COOKIE_CONSENT_VERSION = 1;
export const COOKIE_CONSENT_TTL_MS = 365 * 24 * 60 * 60 * 1000;

export const OPEN_COOKIE_SETTINGS_EVENT = "hbr:open-cookie-settings";

export type CookieConsentCategory = "analytics" | "advertising";

export interface CookieConsentState {
  version: number;
  decidedAt: number;
  analytics: boolean;
  advertising: boolean;
}

export interface CookieConsentPreferences {
  analytics: boolean;
  advertising: boolean;
}

/** Pre-selected toggles when a first-time visitor opens Manage. */
export const DEFAULT_OPT_IN_PREFERENCES: CookieConsentPreferences = {
  analytics: true,
  advertising: true,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function parseCookieConsentState(raw: unknown, now = Date.now()): CookieConsentState | null {
  if (!isRecord(raw)) return null;

  const version = raw.version;
  const decidedAt = raw.decidedAt;
  const analytics = raw.analytics;
  const advertising = raw.advertising;

  if (
    version !== COOKIE_CONSENT_VERSION ||
    typeof decidedAt !== "number" ||
    !Number.isFinite(decidedAt) ||
    typeof analytics !== "boolean" ||
    typeof advertising !== "boolean"
  ) {
    return null;
  }

  if (now - decidedAt > COOKIE_CONSENT_TTL_MS) return null;

  return {
    version: COOKIE_CONSENT_VERSION,
    decidedAt,
    analytics,
    advertising,
  };
}

export function createCookieConsentState(
  preferences: CookieConsentPreferences,
  now = Date.now(),
): CookieConsentState {
  return {
    version: COOKIE_CONSENT_VERSION,
    decidedAt: now,
    analytics: preferences.analytics,
    advertising: preferences.advertising,
  };
}

export function readCookieConsentFromStorage(now = Date.now()): CookieConsentState | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (!raw) return null;
    return parseCookieConsentState(JSON.parse(raw), now);
  } catch {
    return null;
  }
}

export function writeCookieConsentToStorage(
  preferences: CookieConsentPreferences,
  now = Date.now(),
): CookieConsentState {
  const state = createCookieConsentState(preferences, now);

  if (typeof window !== "undefined") {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, JSON.stringify(state));
  }

  return state;
}
