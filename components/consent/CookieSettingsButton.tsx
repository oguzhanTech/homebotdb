"use client";

import { openCookieSettings } from "@/components/consent/CookieConsentBanner";
import { useConsentBannerRequired } from "@/components/consent/ConsentRegionProvider";
import { uiCopy } from "@/config/ui-copy";

export function CookieSettingsButton() {
  const consentBannerRequired = useConsentBannerRequired();

  if (!consentBannerRequired) return null;

  return (
    <button
      type="button"
      onClick={() => openCookieSettings()}
      className="cursor-pointer font-medium uppercase tracking-wider text-[#5d6570] transition-colors hover:text-ink"
    >
      {uiCopy.consent.settings}
    </button>
  );
}
