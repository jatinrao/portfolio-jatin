import './globals.css'
import type {Metadata} from 'next'
import {Inter, IBM_Plex_Mono} from 'next/font/google'
import {draftMode} from 'next/headers'
import {VisualEditing} from 'next-sanity/visual-editing'
import {Toaster} from 'sonner'
import {SanityLive} from '@/sanity/lib/live'
import {defaultLocale} from '@/i18n/config'
import { isRtlLocale } from '@/lib/locale'
import GoogleAnalytics from '@/components/shared/GoogleAnalytics'
import DraftModeToast from '@/components/sanity-cms/DraftModeToast'
import {handleError} from '@/app/client-utils'

/**
 * Static fallback only. The true root layout sits above app/[lang]/**, so it
 * never receives a `lang` param — the real, Sanity-driven, locale-aware SEO
 * metadata lives in app/[lang]/layout.tsx, which does receive it. This just
 * covers routes outside [lang] (the no-JS "/" redirect shell, /resume falls
 * back to its own generateMetadata) so they're never left titleless.
 */
export const metadata: Metadata = {
  title: "Jatin Kumar | Software Engineer",
}

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})
const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
})


 export default async function RootLayout({children}: LayoutProps<'/'>) {
  // The Cloudflare static export has no server: Sanity Live's connection
  // and Presentation/Visual Editing both need one (draft-mode cookies,
  // a live subscription endpoint, the Presentation Tool iframing this
  // site), and there's nowhere for `SanityLive` to connect to on that
  // deploy — that's the "Sanity Live couldn't connect / CORS policy"
  // toast users see there. Same NEXT_PUBLIC_DEPLOY_TARGET flag
  // DownloadResumeButton already branches on (see package.json's
  // build:cf-static script).
  const isCloudflareStatic = process.env.NEXT_PUBLIC_DEPLOY_TARGET === 'cloudflare'
  const isDraftMode = !isCloudflareStatic && (await draftMode()).isEnabled

  return (
    // `lang` is kept at the build-time default here on purpose — this
    // layout is the ONE place <html> can be declared (nested layouts can't
    // redeclare it), but it sits above app/[lang]/**, so it has no `lang`
    // param yet. app/[lang]/layout.tsx renders <LocaleHtmlSync> to correct
    // `document.documentElement.lang` client-side once the real locale is
    // known — see that file for why draftMode() here doesn't interfere
    // with static generation of the [lang] routes.
    <html
      lang={defaultLocale}
      dir={isRtlLocale(defaultLocale) ? 'rtl' : 'ltr'}
      className={`${inter.variable} ${ibmPlexMono.variable} bg-surface text-on-surface`}
    >
      <body>
        <Toaster />
        {isDraftMode && (
          <>
            <DraftModeToast />
            {/* Enable Visual Editing, only rendered when Draft Mode is enabled */}
            <VisualEditing />
          </>
        )}
        <section className="min-h-screen">
          <main className="">{children}</main>
        </section>
        <GoogleAnalytics/>
        {/* Makes all sanityFetch calls in the app live — always rendered,
            except on the Cloudflare static export, which has no server
            for it to connect to. */}
        {!isCloudflareStatic && <SanityLive onError={handleError} />}
      </body>
    </html>
  )
}