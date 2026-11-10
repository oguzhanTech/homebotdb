"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useConsentBannerRequired } from "@/components/consent/ConsentRegionProvider";
import { uiCopy } from "@/config/ui-copy";
import {
  DEFAULT_OPT_IN_PREFERENCES,
  OPEN_COOKIE_SETTINGS_EVENT,
  readCookieConsentFromStorage,
  writeCookieConsentToStorage,
  type CookieConsentPreferences,
  type CookieConsentState,
} from "@/lib/consent/cookieConsent";
import { applyGoogleConsent } from "@/lib/consent/googleConsent";

type BannerView = "prompt" | "manage";

function preferencesForManage(stored: CookieConsentState | null): CookieConsentPreferences {
  if (!stored) return DEFAULT_OPT_IN_PREFERENCES;
  return {
    analytics: stored.analytics,
    advertising: stored.advertising,
  };
}

export function CookieConsentBanner() {
  const consentBannerRequired = useConsentBannerRequired();
  const [visible, setVisible] = useState(false);
  const [view, setView] = useState<BannerView>("prompt");
  const [managePreferences, setManagePreferences] = useState<CookieConsentPreferences>(
    DEFAULT_OPT_IN_PREFERENCES,
  );

  const finalizeConsent = useCallback((preferences: CookieConsentPreferences) => {
    writeCookieConsentToStorage(preferences);
    applyGoogleConsent(preferences);
    setVisible(false);
    setView("prompt");
  }, []);

  const openManage = useCallback((stored: CookieConsentState | null) => {
    setManagePreferences(preferencesForManage(stored));
    setView("manage");
    setVisible(true);
  }, []);

  const openSettings = useCallback(() => {
    openManage(readCookieConsentFromStorage());
  }, [openManage]);

  useEffect(() => {
    if (!consentBannerRequired) {
      applyGoogleConsent(DEFAULT_OPT_IN_PREFERENCES);
      return;
    }

    const stored = readCookieConsentFromStorage();
    if (stored) {
      applyGoogleConsent({
        analytics: stored.analytics,
        advertising: stored.advertising,
      });
      return;
    }

    setVisible(true);
  }, [consentBannerRequired]);

  useEffect(() => {
    if (!consentBannerRequired) return;

    const handleOpenSettings = () => openSettings();
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, handleOpenSettings);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, handleOpenSettings);
  }, [consentBannerRequired, openSettings]);

  if (!consentBannerRequired || !visible) return null;

  return (
    <div
      role="dialog"
      aria-label={uiCopy.consent.dialogLabel}
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-[70] w-full rounded-t-[18px] border border-line border-b-0 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-card sm:inset-x-auto sm:bottom-4 sm:right-4 sm:w-[min(340px,calc(100vw-2rem))] sm:rounded-[18px] sm:border-b"
    >
      {view === "prompt" ? (
        <>
          <p className="text-sm leading-relaxed text-[#3d4550]">
            {uiCopy.consent.prompt}{" "}
            <Link href="/cookies" className="font-medium text-blue hover:underline">
              {uiCopy.consent.policyLink}
            </Link>
            .
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => finalizeConsent(DEFAULT_OPT_IN_PREFERENCES)}
              className="flex-1 cursor-pointer rounded-[12px] bg-blue px-4 py-2 text-sm font-semibold text-white hover:bg-blue/90"
            >
              {uiCopy.consent.accept}
            </button>
            <button
              type="button"
              onClick={() => openManage(null)}
              className="flex-1 cursor-pointer rounded-[12px] border border-line bg-white px-4 py-2 text-sm font-semibold text-ink hover:border-blue/30"
            >
              {uiCopy.consent.manage}
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm font-semibold text-ink">{uiCopy.consent.preferencesTitle}</p>
          <p className="mt-1 text-sm text-[#3d4550]">{uiCopy.consent.preferencesLead}</p>
          <div className="mt-4 space-y-3">
            <div className="flex items-start gap-3 text-sm text-[#3d4550]">
              <input
                type="checkbox"
                checked
                disabled
                readOnly
                aria-readonly="true"
                className="mt-0.5 h-4 w-4 accent-blue"
              />
              <span>
                <span className="font-medium text-ink">{uiCopy.consent.essential}</span>
                <span className="mt-0.5 block text-[#5d6570]">{uiCopy.consent.essentialDetail}</span>
              </span>
            </div>
            <label className="flex cursor-pointer items-start gap-3 text-sm text-[#3d4550]">
              <input
                type="checkbox"
                checked={managePreferences.analytics}
                onChange={(event) =>
                  setManagePreferences((current) => ({
                    ...current,
                    analytics: event.target.checked,
                  }))
                }
                className="mt-0.5 h-4 w-4 cursor-pointer accent-blue"
              />
              <span>
                <span className="font-medium text-ink">{uiCopy.consent.analytics}</span>
                <span className="mt-0.5 block text-[#5d6570]">{uiCopy.consent.analyticsDetail}</span>
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 text-sm text-[#3d4550]">
              <input
                type="checkbox"
                checked={managePreferences.advertising}
                onChange={(event) =>
                  setManagePreferences((current) => ({
                    ...current,
                    advertising: event.target.checked,
                  }))
                }
                className="mt-0.5 h-4 w-4 cursor-pointer accent-blue"
              />
              <span>
                <span className="font-medium text-ink">{uiCopy.consent.advertising}</span>
                <span className="mt-0.5 block text-[#5d6570]">
                  {uiCopy.consent.advertisingDetail}
                </span>
              </span>
            </label>
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => finalizeConsent(managePreferences)}
              className="flex-1 cursor-pointer rounded-[12px] bg-blue px-4 py-2 text-sm font-semibold text-white hover:bg-blue/90"
            >
              {uiCopy.consent.confirm}
            </button>
            <button
              type="button"
              onClick={() => setView("prompt")}
              className="flex-1 cursor-pointer rounded-[12px] border border-line bg-white px-4 py-2 text-sm font-semibold text-ink hover:border-blue/30"
            >
              {uiCopy.consent.back}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export function openCookieSettings(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_COOKIE_SETTINGS_EVENT));
}
