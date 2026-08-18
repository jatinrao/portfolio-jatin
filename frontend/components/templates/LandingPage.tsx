import { fetchHeroData, fetchPortfolioData }    from '@/lib/queries'
import type { HeroRawData } from '@/lib/queries'
import { HeroSection }      from '@/components/organisms/HeroSection'
import { FloatingControls } from '@/components/shared/FloatingControls'
import { LanguageProvider } from '@/components/organisms/LanguageContext'
import { LangId, localize } from '@/lib/locale'
import { Header, type HeaderData } from '../organisms/Header'
import { Footer } from '../organisms/Footer'
import { renderSection, isRoomSection, buildRoomDef } from '@/components/shared/renderSection'
import { RoomsSection, type RoomDef } from '@/components/organisms/RoomsSection'
import type { ReactNode } from 'react'

// Revalidate every 60 s (ISR) — or set to 0 for full SSG
export const revalidate = 60

export default async function HomePage({lang}: {lang: LangId}) {
  // 'jatin-kumar' is the person document's slug in Sanity
  const portfolio = await fetchPortfolioData('jatin-kumar');
  if (!portfolio) {
    return <p style={{ padding: '2rem' }}>Portfolio not found.</p>
  }

  return (
    // Wrap the tree once — LanguageSwitcher and HeroSection share the context
    <LanguageProvider lang={lang}>
      <Header data={portfolio.data.header} locale={lang}  />
      <main>
        <HeroSection data={portfolio.data.hero_section} locale={lang}/>
        {/* Add more sections here */}
        {(() => {
// Consecutive "room" sections (skills / experience / projects) are
          // grouped into one pinned RoomsSection scroll frame; everything
          // else keeps rendering as its own standalone stacked section.
          const sections = portfolio.data.sections ?? []
          const nodes: ReactNode[] = []
          let pendingRooms: RoomDef[] = []

          const flushRooms = () => {
            if (pendingRooms.length) {
              nodes.push(<RoomsSection key={`rooms-${nodes.length}`} rooms={pendingRooms} />)
              pendingRooms = []
            }
          }

          sections.forEach((section: any, i: number) => {
            if (isRoomSection(section)) {
              pendingRooms.push(buildRoomDef(section, portfolio.data, lang))
            } else {
              flushRooms()
              nodes.push(renderSection(section, portfolio.data, lang, (i + 1) % 2 !== 0))
            }
          })
          flushRooms()

          return nodes
        })()}

      </main>

      {/* <SkillsSection skills={portfolio.data.skills} locale={portfolio.data.locale} /> */}

      {/* <Timeline data={portfolio.data.experience} locale={portfolio.data.locale} /> */}

      {/* <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden pt-32">
        <div className="z-10 mb-16 grid w-full max-w-6xl grid-cols-1 items-end gap-12 px-margin-mobile md:grid-cols-2 md:px-margin-desktop">
          <div>
            <p className="mb-2 font-label-caps text-label-caps uppercase text-secondary">
              Technical Specification v.3.0
            </p>
            <h1 className="mb-4 font-headline-xl text-headline-xl uppercase tight-heading">
              Celestial Artifacts
            </h1>
          </div>
          <div className="technical-description">
            <p className="max-w-md font-body-md text-body-md">
              Analytical decomposition of deep-space optical captures. Artifacts categorized by
              luminosity, density, and chromatic variance. A definitive study in high-contrast
              engineering.
            </p>
          </div>
        </div>

        <CoverflowCarousel artifacts={artifacts} />

        <p className="mt-6 max-w-sm px-margin-mobile text-center font-label-caps text-[10px] text-outline">
          DRAG TO BROWSE — ARROW KEYS OR FLICK TO ADVANCE
        </p>
      </main> */}

      
      <Footer
        brandName={localize(portfolio.data.hero_section.name, lang)}
        tagline={localize(portfolio.data.hero_section.headline, lang)}
        locale={lang}
        navItems={(portfolio.data.header?.navItems ?? []).map((item: NonNullable<HeaderData['navItems']>[number]) => ({
          anchorId: item.anchorId,
          label: localize(item.label, lang),
        }))}
        socialLinks={(portfolio.data.hero_section.channels ?? [])
          .filter((channel: NonNullable<HeroRawData['channels']>[number]) => Boolean(channel.url))
          .map((channel: NonNullable<HeroRawData['channels']>[number]) => ({
            label: localize(channel.label, lang) || channel.url,
            href: channel.url,
          }))}
      />
      
      {/* <SkillCloud skills={portfolio.data.skills} locale={portfolio.data.locale} /> */}

      {/* Fixed overlay — sits on top of everything */}
      <FloatingControls />
    </LanguageProvider>
  )
}

