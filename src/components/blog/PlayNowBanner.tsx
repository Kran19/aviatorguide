"use client"

import React from "react"
import { SafeImage } from "@/components/ui/SafeImage"
import { useBlogTracker } from "@/hooks/useBlogTracker"
import { Play, Sparkles, ShieldCheck, Zap } from "lucide-react"

interface PlayNowBannerProps {
  postId?: string
  slug?: string
  title?: string
  image?: string | null
  redirectUrl?: string | null
  settings?: {
    featuredPortalEnabled?: boolean
    featuredPortalHeading?: string | null
    featuredPortalTitle?: string | null
    featuredPortalDescription?: string | null
    featuredPortalCtaText?: string | null
    featuredPortalCtaUrl?: string | null
    featuredPortalBadge1?: string | null
    featuredPortalBadge2?: string | null
    featuredPortalRelFollow?: boolean
  } | null
}

export function PlayNowBanner({ postId, slug, title, image, redirectUrl, settings }: PlayNowBannerProps) {
  const { trackAndRedirect } = useBlogTracker({ postId: postId || "home", slug: slug || "home" })

  const isEnabled = settings?.featuredPortalEnabled ?? true
  if (!isEnabled) {
    return null
  }

  const heading = settings?.featuredPortalHeading || "Featured Gaming Portal"
  const portalTitle = settings?.featuredPortalTitle || "Ready to Play & Win Rewards?"
  const description = settings?.featuredPortalDescription || "Experience fast multiplier rounds, instant cashouts, and official certified fair play."
  const ctaText = settings?.featuredPortalCtaText || "PLAY NOW"
  const destinationUrl = redirectUrl || settings?.featuredPortalCtaUrl || "https://rocky11.club/?refercode=SEO"
  const badge1 = settings?.featuredPortalBadge1 || "Provably Fair"
  const badge2 = settings?.featuredPortalBadge2 || "Instant Cashouts"
  const isFollow = settings?.featuredPortalRelFollow ?? false

  const linkRel = isFollow ? "noopener noreferrer" : "nofollow noopener noreferrer"

  const handlePlayNowClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackAndRedirect("Top Play Now Banner CTA Button", destinationUrl)
  }

  return (
    <div className="w-full my-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/90 border border-emerald-500/30 shadow-2xl relative overflow-hidden group">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Thumbnail Preview */}
        <div className="relative w-full md:w-48 h-36 rounded-2xl overflow-hidden border border-emerald-500/40 shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500">
          <SafeImage
            src={image}
            fallbackSrc="/images/default-blog-banner.svg"
            alt={title || portalTitle}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/90 text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 fill-current ml-0.5" />
            </div>
          </div>
        </div>

        {/* Content Callout */}
        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{heading}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
            {portalTitle}
          </h3>

          <p className="text-sm text-slate-300 max-w-xl">
            {description}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-400 pt-1">
            {badge1 && (
              <span className="flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{badge1}</span>
              </span>
            )}
            {badge2 && (
              <span className="flex items-center space-x-1">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>{badge2}</span>
              </span>
            )}
          </div>
        </div>

        {/* Action Button Link */}
        <div className="w-full md:w-auto shrink-0">
          <a
            href={destinationUrl}
            target="_blank"
            rel={linkRel}
            onClick={handlePlayNowClick}
            className="w-full md:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-lg rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 group/btn"
          >
            <span>{ctaText}</span>
            <Play className="w-5 h-5 fill-current group-hover/btn:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  )
}
