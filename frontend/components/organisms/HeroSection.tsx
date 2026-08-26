'use client'

import { Fragment } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  localize,
  localizeBlocks,
  blocksToPlainText,
  LangId,
} from '@/lib/locale'
import type { HeroRawData } from '@/lib/queries'
import { useParallaxTilt } from '@/hooks/use-parallax-tilt'
import { useHeroScale } from '@/hooks/use-hero-scale'
import { OpenToWorkBadge } from '@/components/atoms/OpenToWorkBadge'
import HeroGreeting from '@/components/molecules/HeroGreeting'
import StatItem from '@/components/molecules/StatItem'
import { HeroFeatureGroup } from '@/components/molecules/HeroFeatureGroup'
import { HeroDiamondSlot } from '@/components/organisms/HeroDiamondSlot'
import './hero.css'

function channelHref(
  channels: ReturnType<typeof mapChannels>,
  ...needles: string[]
) {
  const hit = channels.find((channel) => {
    const hay = `${channel.url ?? ''} ${channel.label ?? ''}`.toLowerCase()
    return needles.some((needle) => hay.includes(needle))
  })
  return hit?.url
}

interface HeroImageProps {
  src: string
  alt?: string
  lqip?: string
  openToWork?: boolean
  openToWorkLabel?: string
  tilt?: boolean
  preview?: 'full' | 'lqip'
}
function HeroImageLqip({ lqip, openToWork, openToWorkLabel }: Pick<HeroImageProps, 'lqip' | 'openToWork' | 'openToWorkLabel'>) {
  return (
    <div className="hero-portrait">
      <div className="hero-portrait-frame" />
      <div className="hero-portrait-photo">
        <div
          className="hero-portrait-lqip"
          style={lqip ? { backgroundImage: `url(${lqip})` } : undefined}
          aria-hidden="true"
        />
      </div>
      {openToWork ? <OpenToWorkBadge highlight="✓" label={openToWorkLabel} /> : null}
    </div>
  )
}

function HeroImage({ src, alt, lqip, openToWork, openToWorkLabel, tilt = false, preview = 'full' }: HeroImageProps) {
  if (preview === 'lqip') {
    return <HeroImageLqip lqip={lqip} openToWork={openToWork} openToWorkLabel={openToWorkLabel} />
  }

  const { cardRef, handlers, cardStyle, frameStyle, badgeStyle, glossStyle } = useParallaxTilt()

  const photo = (
    <div className="hero-portrait-photo">
      <Image
        src={src}
        alt={alt || 'Profile picture'}
        fill
        sizes="(min-width: 768px) 360px, (min-width: 640px) 300px, 240px"
        className="object-cover"
        placeholder={lqip ? 'blur' : 'empty'}
        blurDataURL={lqip}
        preload={tilt}
        fetchPriority={tilt ? 'high' : undefined}
      />
      {lqip ? (
        <div
          className="hero-portrait-lqip hero-portrait-lqip-cover"
          style={{ backgroundImage: `url(${lqip})` }}
          aria-hidden="true"
        />
      ) : null}
      {tilt ? (
        <motion.div aria-hidden="true" style={glossStyle} className="pointer-events-none absolute inset-0 z-20" />
      ) : null}
    </div>
  )

  const badge = openToWork ? (
    <OpenToWorkBadge highlight="✓" label={openToWorkLabel} />
  ) : null

  return (
    <motion.div
      ref={cardRef}
      {...handlers}
      style={cardStyle}
      className="hero-portrait"
    >
      <motion.div style={frameStyle} className="hero-portrait-frame" />
      {photo}
      {badge ? <motion.div style={badgeStyle}>{badge}</motion.div> : null}
    </motion.div>
  )
}

function mapChannels(channels: HeroRawData['channels'], locale: LangId) {
  return (channels ?? []).map((s) => ({
    ...s,
    label: localize(s?.label, locale),
  }))
}

interface HeroLayoutProps {
  name: string
  greeting: string
  headline: string
  bioText: string
  stats: Array<{ value: string; label: string }>
  avatarUrl?: string
  avatarAlt?: string
  avatarLqip?: string
  openToWork?: boolean
  openToWorkLabel?: string
  reachOutHref?: string
  connectHref?: string
  reachOutLabel?: string
  connectLabel?: string
  heading?: boolean
  tilt?: boolean
  preview?: 'full' | 'lqip'
}

function HeroLayout({
  name,
  greeting,
  headline,
  bioText,
  stats,
  avatarUrl,
  avatarAlt,
  avatarLqip,
  openToWork,
  openToWorkLabel,
  reachOutHref,
  connectHref,
  reachOutLabel = 'Reach out',
  connectLabel = 'Connect',
  heading = false,
  tilt = false,
  preview = 'full',
}: HeroLayoutProps) {
  const Title = heading ? 'h1' : 'p'

  return (
    <div className="hero-layout">
      <div className="hero-inner">
        <div className="hero-copy">
          <HeroGreeting text={greeting} />

          <Title className="hero-title">
            <span className="hero-private hero-private-name">
              <span className="hero-name hero-private-live">{name}</span>
            </span>
            {headline ? (
              <span className="hero-private hero-private-block">
                <span className="hero-headline hero-private-live">{headline}</span>
              </span>
            ) : null}
          </Title>

          {bioText ? (
            <p className="hero-bio">
              <span className="hero-private hero-private-block">
                <span className="hero-private-live">{bioText}</span>
              </span>
            </p>
          ) : null}

          {stats.length > 0 && (
            <div className="hero-stats">
              {stats.map((stat, i) => (
                <Fragment key={stat.label || i}>
                  <StatItem value={stat.value} label={stat.label} />
                  {i < stats.length - 1 ? <div className="hero-stat-rule" /> : null}
                </Fragment>
              ))}
            </div>
          )}

          {(reachOutHref || connectHref) && (
            <div className="hero-actions">
              {reachOutHref ? (
                <Link
                  href={reachOutHref}
                  className="hero-cta hero-cta-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="hero-link-copy">{reachOutLabel}</span>
                </Link>
              ) : null}
              {connectHref ? (
                <Link
                  href={connectHref}
                  className="hero-cta hero-cta-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="hero-link-copy">{connectLabel}</span>
                </Link>
              ) : null}
            </div>
          )}
        </div>

        {avatarUrl ? (
          <HeroImage
            src={avatarUrl}
            alt={avatarAlt || 'Profile picture'}
            lqip={avatarLqip}
            openToWork={openToWork}
            openToWorkLabel={openToWorkLabel}
            tilt={tilt}
            preview={preview}
          />
        ) : null}
      </div>
    </div>
  )
}

interface HeroSectionProps {
  data: HeroRawData
  locale: LangId
  reachOutLabel?: string
  connectLabel?: string
}

export function HeroSection({ data, locale = 'en', reachOutLabel, connectLabel }: HeroSectionProps) {
  const { trackRef, style, phone, z } = useHeroScale()

  const name = localize(data.name, locale) || ''
  const greeting = localize(data.greeting, locale) || 'Hi, my name is'
  const headline = localize(data.headline, locale)
  const openToWorkLabel = localize(data.openToWorkLabel, locale) || 'Open to Work'
  const bioText = blocksToPlainText(localizeBlocks(data.bio_short, locale))
  const stats = (data.stats ?? []).map((s) => ({
    value: s.value,
    label: localize(s.label, locale),
  }))
  const featureHighlights = (data.featureHighlights ?? [])
    .filter((item) => item.iconName)
    .map((item) => ({
      key: item._key,
      iconName: item.iconName,
      kicker: item.kicker,
      label: localize(item.label, locale) || '',
    }))
  const featureIntro = localize(data.featureIntro, locale)
  const featureLinkLabel = localize(data.featureLinkLabel, locale)

  const channels = mapChannels(data.channels, locale)
  const reachOutHref =
    channelHref(channels, 'calendly', 'meet.google', 'calendar') || data.primaryCta?.href
  const connectHref =
    channelHref(channels, 'linkedin') || data.secondaryCta?.href

  const layout = {
    name,
    greeting,
    headline,
    bioText,
    stats,
    avatarUrl: data.avatar?.asset?.url,
    avatarAlt: localize(data.avatar?.alt, locale),
    avatarLqip: data.avatar?.asset?.metadata?.lqip,
    openToWork: data.openToWork,
    openToWorkLabel,
    reachOutHref,
    connectHref,
    reachOutLabel,
    connectLabel,
  }

  return (
    <section aria-label="Hero" className="hero-section">
      <div ref={trackRef} className="hero-track" style={style}>
        <div className="hero-sticky">
          <div className="hero-scale">
            <div className="hero-glow" aria-hidden="true" />
            <div className="hero-screen">
              <div className="hero-show">
                <HeroLayout {...layout} heading tilt />
              </div>
            </div>
            {/* <div className="hero-phone-slot" aria-hidden="true">
              <HeroDiamondSlot phone={phone} z={z} />
            </div> */}
            <Image
              src="/images/hero_tv_shadow_color.png"
              alt=""
              width={1192}
              height={108}
              className="hero-glow-image hero-glow-image-light"
              aria-hidden="true"
              // Static /public asset, not a Sanity CDN one — Next's default
              // loader would otherwise route it through /_next/image, which
              // only exists on Vercel. The Cloudflare static export has no
              // server for that endpoint, so the image 404s there (see
              // scripts/extract-static-for-cloudflare.ts's image-rewriting
              // step, which only handles cdn.sanity.io URLs). `unoptimized`
              // makes Next emit the plain /images/... path instead, which
              // works identically on both deploys.
              unoptimized
            />
            <Image
              src="/images/hero_tv_shadow_color_dark.png"
              alt=""
              width={1192}
              height={108}
              className="hero-glow-image hero-glow-image-dark"
              aria-hidden="true"
              unoptimized
            />
          </div>
        </div>
      </div>

      <div className="hero-intro">
        <HeroFeatureGroup
          features={featureHighlights}
          intro={featureIntro}
          linkUrl={data.featureLinkUrl}
          linkLabel={featureLinkLabel}
        />
      </div>
    </section>
  )
}
