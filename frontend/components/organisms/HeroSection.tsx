'use client'

import { Fragment }        from 'react'
import Image               from 'next/image'
import Link                from 'next/link'
import {
  localize,
  localizeBlocks,
  blocksToPlainText,
  LangId,
}                          from '@/lib/locale'
import type { HeroRawData } from '@/lib/queries'
import ConnectChannels from '../molecules/ConnectChannels'

// ─── Sub-components ───────────────────────────────────────────────────────

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

interface GreetingProps { text: string }
function HeroGreeting({ text }: GreetingProps) {
  return (
    <p className="m-0 text-sm font-semibold uppercase tracking-[0.12em] text-secondary-fixed">
      {text}
    </p>
  )
}

interface StatItemProps { value: string; label: string }
function StatItem({ value, label }: StatItemProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[28px] font-black leading-none text-heading-ink">
        {value}
      </span>
      <span className="text-[13px] font-medium text-muted-body">
        {label}
      </span>
    </div>
  )
}

interface BadgeProps { highlight: string; label?: string }
function OpenToWorkBadge({ highlight, label }: BadgeProps) {
  return (
    <div className="absolute -bottom-3 -right-3 flex items-center gap-1.5 whitespace-nowrap rounded-full border-2 border-secondary-fixed bg-surface px-3.5 py-1.5 text-[13px] font-bold text-primary shadow-[0_2px_12px_rgba(0,0,0,0.1)]">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-black text-on-primary">
        {highlight}
      </span>
      {label}
    </div>
  )
}

interface HeroImageProps {
  src:            string
  alt?:            string
  lqip?:          string
  openToWork?:     boolean
  openToWorkLabel?: string
}
function HeroImage({ src, alt, lqip, openToWork, openToWorkLabel }: HeroImageProps) {
  return (
    <div className="relative mx-auto shrink-0 md:mx-0">
      {/* Gold frame accent */}
      <div className="absolute inset-0 z-0 translate-x-2 translate-y-2 rounded-2xl border-[3px] border-secondary-fixed" />
      <div className="relative z-10 h-[280px] w-[240px] overflow-hidden rounded-2xl border-[3px] border-surface-variant sm:h-[350px] sm:w-[300px] md:h-[420px] md:w-[360px]">
        <Image
          src={src}
          alt={alt || 'Profile picture'}
          fill
          sizes="(min-width: 768px) 360px, (min-width: 640px) 300px, 240px"
          className="object-cover"
          placeholder={lqip ? 'blur' : 'empty'}
          blurDataURL={lqip}
          priority
        />
      </div>
      {openToWork && (
        <OpenToWorkBadge highlight="✓" label={openToWorkLabel} />
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────

interface HeroSectionProps {
  data: HeroRawData
  locale:LangId
}

export function HeroSection({ data,locale="en" }: HeroSectionProps) {
  // const { lang } = useLanguage()

  // Resolve all localized strings using active language (instant — no fetch)
  const name            = localize(data.name, locale) || ''
  const greeting        = localize(data.greeting,        locale) || 'Hi, my name is'
  const headline        = localize(data.headline,        locale)
  const openToWorkLabel = localize(data.openToWorkLabel, locale) || 'Open to Work'
  const primaryText     = localize(data.primaryCta?.text,   locale)
  const secondaryText   = localize(data.secondaryCta?.text, locale)

  // bio_short is PortableText — extract plain text for the hero paragraph
  const bioBlocks = localizeBlocks(data.bio_short, locale);
  const bioText   = blocksToPlainText(bioBlocks);

  // Stats — localize label per stat
  const stats = (data.stats ?? []).map((s) => ({
    value: s.value,
    label: localize(s.label, locale),
  }))

  const channels = (data.channels ?? []).map((s) => ({
    ...s,
    label: localize(s?.label, locale),
  }))

  const avatarUrl  = data.avatar?.asset?.url
  const avatarAlt  = localize(data.avatar?.alt, locale)
  const avatarLqip = data.avatar?.asset?.metadata?.lqip

  return (
    <section aria-label="Hero" className="border-b-[3px] border-secondary-fixed bg-surface bg-[radial-gradient(#d0c5b2_1px,transparent_1px)] bg-[length:24px_24px]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-10 px-6 py-16 sm:gap-14 md:flex-row md:items-center md:gap-20 md:py-[100px]">

        {/* ── Content ─────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col gap-6">

          <HeroGreeting text={greeting} />

          {/* Name + headline */}
          <h1 className="m-0 text-[40px] font-black leading-[1.05] tracking-[-1px] text-heading-ink sm:text-[52px] md:text-[60px] lg:text-[68px] lg:tracking-[-2px]">
            <span className="border-b-[4px] border-secondary-fixed pb-0.5 text-primary bg-surface">
              {name}
            </span>
            <br />
            <span className="font-bold text-[34px] md:text-[44px] text-muted-body mt-2">{headline}</span>
            {/* Split headline into two lines at the last space */}
            {/* {(() => {
              const words    = headline.split(' ')
              const midpoint = Math.ceil(words.length / 2)
              const line1    = words.slice(0, midpoint).join(' ')
              const line2    = words.slice(midpoint).join(' ')
              return (
                <>
                  <span className="font-bold text-muted-body">{line1}</span>
                  {line2 && (
                    <>
                      <br />
                      <span className="font-bold text-muted-body">{line2}</span>
                    </>
                  )}
                </>
              )
            })()} */}
          </h1>

          {/* Short bio */}
          {bioText && (
            <p className="m-0 max-w-full border-l-[3px] border-secondary-fixed pl-4 text-[17px] leading-[1.7] text-muted-body md:max-w-[620px] bg-surface">
              {bioText}
            </p>
          )}

        {}

          {/* Stats */}
          {stats.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-8">
              {stats.map((stat, i) => (
                <Fragment key={stat.label || i}>
                  <StatItem value={stat.value} label={stat.label} />
                  {i < stats.length - 1 && (
                    <div className="h-10 w-px bg-secondary-fixed opacity-50" />
                  )}
                </Fragment>
              ))}
            </div>
          )}
          {channels && <ConnectChannels channels={channels} locale={locale} />}

          {/* CTA buttons */}
          <div className="mt-2 flex flex-wrap gap-4">
            {data.primaryCta?.href && primaryText && (
              <Link
                href={data.primaryCta.href}
                className="inline-flex items-center gap-2 rounded-md border-b-[3px] border-secondary-fixed bg-primary px-[26px] py-[13px] text-[15px] font-bold text-on-primary no-underline transition-[transform,box-shadow] duration-150 ease-out hover:-translate-y-px hover:shadow-[0_4px_14px_rgba(45,90,61,0.3)]"
              >
                {primaryText}
                <ArrowRightIcon />
              </Link>
            )}

            {data.secondaryCta?.href && secondaryText && (
              <Link
                href={data.secondaryCta.href}
                className="inline-flex items-center gap-2 rounded-md border-2 border-primary bg-transparent px-[26px] py-[13px] text-[15px] font-bold text-primary no-underline transition-colors duration-150 ease-out hover:bg-primary hover:text-on-primary"
              >
                {secondaryText}
              </Link>
            )}
          </div>
        </div>

        {/* ── Avatar ──────────────────────────────────────────── */}
        {avatarUrl && (
          <HeroImage
            src={avatarUrl}
            alt={avatarAlt  || 'Profile picture'}
            lqip={avatarLqip}
            openToWork={data.openToWork}
            openToWorkLabel={openToWorkLabel}
          />
        )}
      </div>
    </section>
  )
}