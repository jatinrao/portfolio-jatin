"use client";

import Script from "next/script";

// Set NEXT_PUBLIC_GA_ID in your environment (Vercel project settings AND
// wherever you build for Cloudflare, since NEXT_PUBLIC_* vars are inlined
// at build time — there's no server at request time on the static side to
// read them dynamically).
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      {/* lazyOnload = loaded only once the browser is idle, after LCP/TTI —
          this is intentionally the *last* thing to run on the page. */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="lazyOnload"
      />
      <Script id="ga-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){ dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}