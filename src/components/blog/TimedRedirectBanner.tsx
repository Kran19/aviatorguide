"use client"

import React, { useState, useEffect, useRef } from "react"
import { ExternalLink, X, Clock, ArrowRight } from "lucide-react"

interface TimedRedirectBannerProps {
  redirectEnabled?: boolean | null
  redirectUrl?: string | null
  redirectDelay?: number | null
  postId: string
  slug: string
}

export function TimedRedirectBanner({
  redirectEnabled,
  redirectUrl,
  redirectDelay = 3,
  postId,
  slug,
}: TimedRedirectBannerProps) {
  const delaySeconds = Math.max(1, Math.min(60, redirectDelay ?? 3))
  const [secondsLeft, setSecondsLeft] = useState<number>(delaySeconds)
  const [cancelled, setCancelled] = useState(false)
  const [redirecting, setRedirecting] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!redirectEnabled || !redirectUrl || cancelled) return

    // Track initial page view / visit
    fetch("/api/blog/track-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId,
        slug,
        ctaButton: "Timed Auto-Redirect Pageview",
        clickedUrl: window.location.href,
        userAgent: navigator.userAgent,
        referrer: document.referrer || "Direct",
      }),
    }).catch(() => {})

    // Countdown interval
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Redirect timeout
    timerRef.current = setTimeout(() => {
      setRedirecting(true)
      window.location.href = redirectUrl
    }, delaySeconds * 1000)

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [redirectEnabled, redirectUrl, delaySeconds, postId, slug, cancelled])

  const handleInstantRedirect = () => {
    if (!redirectUrl) return
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (timerRef.current) clearTimeout(timerRef.current)
    setRedirecting(true)
    window.location.href = redirectUrl
  }

  const handleCancelRedirect = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (timerRef.current) clearTimeout(timerRef.current)
    setCancelled(true)
  }

  if (!redirectEnabled || !redirectUrl || cancelled) {
    return null
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full p-4 rounded-2xl bg-slate-900/95 border border-emerald-500/40 shadow-2xl backdrop-blur-md text-white animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: "3s" }} />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Timed Redirect Notice</p>
            <p className="text-sm font-semibold text-white">
              {redirecting ? (
                <span>Redirecting now...</span>
              ) : (
                <span>
                  You will be redirected in <strong className="text-emerald-400 font-extrabold text-base">{secondsLeft}</strong> seconds...
                </span>
              )}
            </p>
          </div>
        </div>

        <button
          onClick={handleCancelRedirect}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Cancel Redirect"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={handleInstantRedirect}
          className="flex-1 py-2 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center space-x-1.5 transition-all shadow-md"
        >
          <span>Redirect Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleCancelRedirect}
          className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg text-xs transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
