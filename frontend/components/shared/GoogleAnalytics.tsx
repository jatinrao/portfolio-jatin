"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

// Set NEXT_PUBLIC_GA_ID in your environment (Vercel project settings AND
// wherever you build for Cloudflare, since NEXT_PUBLIC_* vars are inlined
// at build time — there's no server at request time on the static side to
// read them dynamically).
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "::1"]);

export default function GoogleAnalytics() {
  // Starts disabled and only flips on after mount, once we can read
  // location.hostname — matches the SSR output (which has no `window`) so
  // there's no hydration mismatch, and keeps dev traffic out of real
  // analytics regardless of whether NEXT_PUBLIC_GA_ID happens to be set
  // locally (e.g. copied from a shared .env for convenience).
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!LOCAL_HOSTNAMES.has(window.location.hostname)) {
      setEnabled(true);
    }
  }, []);

  if (!GA_MEASUREMENT_ID || !enabled) {
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