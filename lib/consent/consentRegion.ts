export type ConsentRegion = "consent_required" | "consent_optional";

export const CONSENT_REGION_COOKIE = "hbr_consent_region";
export const CONSENT_REGION_HEADER = "x-hbr-consent-region";
export const CONSENT_REGION_COOKIE_MAX_AGE_SECONDS = 86_400;

/** EU-27 + EEA (IS, LI, NO) + UK + CH. Same set as CountryToLive. */
export const CONSENT_REQUIRED_COUNTRY_CODES = new Set([
  "AT",
  "BE",
  "BG",
  "HR",
  "CY",
  "CZ",
  "DK",
  "EE",
  "FI",
  "FR",
  "DE",
  "GR",
  "HU",
  "IE",
  "IT",
  "LV",
  "LT",
  "LU",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SK",
  "SI",
  "ES",
  "SE",
  "IS",
  "LI",
  "NO",
  "GB",
  "CH",
]);

export function normalizeCountryCode(code: string | null | undefined): string | null {
  if (!code || typeof code !== "string") return null;
  const normalized = code.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(normalized) ? normalized : null;
}

export function isConsentRequiredCountry(code: string | null | undefined): boolean {
  const normalized = normalizeCountryCode(code);
  if (!normalized) return true;
  return CONSENT_REQUIRED_COUNTRY_CODES.has(normalized);
}

export function getConsentRegionFromCountry(code: string | null | undefined): ConsentRegion {
  return isConsentRequiredCountry(code) ? "consent_required" : "consent_optional";
}
