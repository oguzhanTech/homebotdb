import Script from "next/script";
import {
  ADSENSE_CLIENT_ID,
  GA_MEASUREMENT_ID,
  isAdSenseServingEnabled,
} from "@/lib/consent/googleConsent";
import { CONSENT_REGION_COOKIE } from "@/lib/consent/consentRegion";

function consentBootstrapScript(serveAds: boolean): string {
  return `
    (function () {
      var match = document.cookie.match(/(?:^|;\\s*)${CONSENT_REGION_COOKIE}=([^;]+)/);
      var raw = match ? decodeURIComponent(match[1]) : '';
      var optional = raw === 'consent_optional';
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      window.gtag = gtag;
      if (optional) {
        gtag('consent', 'default', {
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
          analytics_storage: 'granted',
          wait_for_update: 500
        });
        gtag('set', 'ads_data_redaction', false);
        gtag('set', 'url_passthrough', true);
      } else {
        gtag('consent', 'default', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
          analytics_storage: 'denied',
          wait_for_update: 2000
        });
        gtag('set', 'ads_data_redaction', true);
        gtag('set', 'url_passthrough', true);
      }
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.pauseAdRequests = ${serveAds ? "optional ? 0 : 1" : "1"};
    })();
  `;
}

export function ConsentScripts() {
  const serveAds = isAdSenseServingEnabled();

  return (
    <>
      <Script id="hbr-consent-default" strategy="beforeInteractive">
        {consentBootstrapScript(serveAds)}
      </Script>
      {GA_MEASUREMENT_ID ? (
        <>
          <Script
            id="hbr-google-analytics"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="hbr-google-analytics-config" strategy="afterInteractive">
            {`
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}');
            `}
          </Script>
        </>
      ) : null}
      {ADSENSE_CLIENT_ID ? (
        <Script
          id="hbr-google-adsense"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      ) : null}
    </>
  );
}
