import { CONSENT_REGION_COOKIE, type ConsentRegion } from "@/lib/consent/consentRegion";

export function readConsentRegionFromCookie(cookieHeader?: string | null): ConsentRegion | null {
  const source = cookieHeader ?? (typeof document !== "undefined" ? document.cookie : "");
  if (!source) return null;

  const match = source.match(new RegExp(`(?:^|;\\s*)${CONSENT_REGION_COOKIE}=([^;]+)`));
  if (!match) return null;

  const value = decodeURIComponent(match[1]);
  if (value === "consent_required" || value === "consent_optional") {
    return value;
  }

  return null;
}
