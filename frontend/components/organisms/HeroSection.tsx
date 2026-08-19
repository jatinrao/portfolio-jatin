'use client'

import { Fragment, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
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
                  <span className="hero-link-copy">Reach out</span>
                </Link>
              ) : null}
              {connectHref ? (
                <Link
                  href={connectHref}
                  className="hero-cta hero-cta-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="hero-link-copy">Connect</span>
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

function ViewShot({
  width,
  height,
  children,
}: {
  width: number
  height: number
  children: ReactNode
}) {
  const clipRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0)

  useLayoutEffect(() => {
    const el = clipRef.current
    if (!el) return
    const measure = () => {
      const next = el.clientWidth / width
      setScale(Number.isFinite(next) && next > 0 ? next : 0)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [width])

  return (
    <div
      ref={clipRef}
      className="hero-shot"
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <div
        className="hero-shot-page"
        style={{
          width,
          height,
          transform: `scale(${scale})`,
          visibility: scale > 0 ? 'visible' : 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  )
}

function IphoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="hero-iphone">
      <span className="hero-iphone-btn hero-iphone-silent" aria-hidden="true" />
      <span className="hero-iphone-btn hero-iphone-vol-up" aria-hidden="true" />
      <span className="hero-iphone-btn hero-iphone-vol-down" aria-hidden="true" />
      <span className="hero-iphone-btn hero-iphone-power" aria-hidden="true" />
      <div className="hero-iphone-bezel">
        <span className="hero-iphone-island" aria-hidden="true" />
        <div className="hero-iphone-screen">{children}</div>
        <span className="hero-iphone-home" aria-hidden="true" />
      </div>
    </div>
  )
}

interface HeroSectionProps {
  data: HeroRawData
  locale: LangId
}

export function HeroSection({ data, locale = 'en' }: HeroSectionProps) {
  const { trackRef, style } = useHeroScale()

  const name = localize(data.name, locale) || ''
  const greeting = localize(data.greeting, locale) || 'Hi, my name is'
  const headline = localize(data.headline, locale)
  const openToWorkLabel = localize(data.openToWorkLabel, locale) || 'Open to Work'
  const bioText = blocksToPlainText(localizeBlocks(data.bio_short, locale))
  const stats = (data.stats ?? []).map((s) => ({
    value: s.value,
    label: localize(s.label, locale),
  }))
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
            {/* <div className="hero-phone-slot" aria-hidden="true" inert>
              <IphoneFrame>
                <ViewShot width={390} height={844}>
                  <HeroLayout {...layout} preview="lqip" />
                </ViewShot>
              </IphoneFrame>
            </div> */}
            <Image
              src="/images/hero_tv_shadow_color.png"
              alt=""
              width={740}
              height={440}
              className="hero-glow-image"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <div className="hero-intro">
        <HeroFeatureGroup />
      </div>
    </section>
  )
}
