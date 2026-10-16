"use client"

import * as React from "react"
import { ShieldAlert, ShieldCheck, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

const SESSION_STORAGE_KEY = "isportsguide_age_verified"

export function AgeGateModal() {
  const [isOpen, setIsOpen] = React.useState(false)
  const modalRef = React.useRef<HTMLDivElement>(null)
  const confirmButtonRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    try {
      const verified = sessionStorage.getItem(SESSION_STORAGE_KEY)
      if (verified !== "true") {
        setIsOpen(true)
      }
    } catch {
      // In private browsing or storage-disabled environments, default to open
      setIsOpen(true)
    }
  }, [])

  // Focus trap & lock scroll when open
  React.useEffect(() => {
    if (!isOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    // Focus primary button when modal appears
    const timer = setTimeout(() => {
      confirmButtonRef.current?.focus()
    }, 50)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusableElements.length === 0) return

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener("keydown", handleKeyDown)
      clearTimeout(timer)
    }
  }, [isOpen])

  const handleConfirm = () => {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, "true")
    } catch {}
    setIsOpen(false)
  }

  const handleExit = () => {
    window.location.href = "https://www.google.com"
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      aria-describedby="age-gate-description"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md bg-slate-950 border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col items-center text-center space-y-6"
      >
        {/* Glow ambient effects */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-red-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* 18+ Badge Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* Header */}
        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black tracking-widest uppercase inline-block">
            Age Verification
          </span>
          <h2 id="age-gate-title" className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            18+ ONLY
          </h2>
        </div>

        {/* Description */}
        <p id="age-gate-description" className="text-sm text-slate-300 leading-relaxed max-w-xs sm:max-w-sm">
          This website contains gambling-related content, casino games analysis, and betting guides. You must be{" "}
          <strong className="text-white font-bold">18 years or older</strong> to enter and view our content.
        </p>

        {/* Action Buttons */}
        <div className="w-full space-y-3 pt-2">
          <Button
            ref={confirmButtonRef}
            type="button"
            onClick={handleConfirm}
            size="lg"
            className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-base shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>I AM 18 OR OLDER</span>
          </Button>

          <Button
            type="button"
            onClick={handleExit}
            variant="outline"
            size="lg"
            className="w-full h-12 rounded-xl border-border/80 bg-slate-900/60 hover:bg-red-950/40 hover:text-red-400 hover:border-red-500/40 text-slate-300 font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>EXIT WEBSITE</span>
          </Button>
        </div>

        <p className="text-[11px] text-slate-400">
          Please gamble responsibly. Terms &amp; conditions apply.
        </p>
      </div>
    </div>
  )
}
