"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Link as LinkIcon, ExternalLink, ShieldCheck, Trash2 } from "lucide-react"

export interface LinkModalProps {
  isOpen: boolean
  onClose: () => void
  initialUrl?: string
  initialTarget?: string | null
  initialRel?: string | null
  onApply: (data: { href: string; target: string | null; rel: string | null }) => void
  onRemove?: () => void
  isActive?: boolean
}

/**
 * Validates against dangerous URI protocols like javascript:, data:, vbscript:
 */
export function isAllowedUrl(url: string): boolean {
  const trimmed = url.trim()
  if (!trimmed) return false
  if (/^(javascript|data|vbscript):/i.test(trimmed)) {
    return false
  }
  return true
}

/**
 * Token-aware rel attribute builder.
 * Follow = no "nofollow", never "rel=follow".
 * Nofollow = includes "nofollow".
 * New tab = includes "noopener noreferrer".
 */
export function buildRel(
  openInNewTab: boolean,
  isNofollow: boolean,
  existingRel?: string | null
): string | null {
  const existingTokens = (existingRel || "")
    .split(/\s+/)
    .map((t) => t.trim().toLowerCase())
    .filter(
      (t) =>
        t.length > 0 &&
        !["noopener", "noreferrer", "nofollow", "follow"].includes(t)
    )

  const tokens: string[] = [...existingTokens]

  if (isNofollow) {
    tokens.push("nofollow")
  }

  if (openInNewTab) {
    tokens.push("noopener", "noreferrer")
  }

  const uniqueTokens = Array.from(new Set(tokens))
  return uniqueTokens.length > 0 ? uniqueTokens.join(" ") : null
}

export function LinkModal({
  isOpen,
  onClose,
  initialUrl = "",
  initialTarget = null,
  initialRel = null,
  onApply,
  onRemove,
  isActive = false,
}: LinkModalProps) {
  const [url, setUrl] = React.useState(initialUrl)
  const [openInNewTab, setOpenInNewTab] = React.useState(
    initialTarget === "_blank"
  )
  const [isNofollow, setIsNofollow] = React.useState(
    initialRel ? /\bnofollow\b/i.test(initialRel) : false
  )
  const [error, setError] = React.useState<string | null>(null)

  // Sync state when dialog opens or props change
  React.useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl || "")
      setOpenInNewTab(initialTarget === "_blank")
      setIsNofollow(initialRel ? /\bnofollow\b/i.test(initialRel) : false)
      setError(null)
    }
  }, [isOpen, initialUrl, initialTarget, initialRel])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = url.trim()
    if (!trimmed) {
      setError("Please enter a destination URL")
      return
    }
    if (!isAllowedUrl(trimmed)) {
      setError("Unsafe link protocol (javascript:, data:, vbscript: are blocked)")
      return
    }

    const target = openInNewTab ? "_blank" : null
    const rel = buildRel(openInNewTab, isNofollow, initialRel)

    onApply({
      href: trimmed,
      target,
      rel,
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border border-border/80 shadow-2xl rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-foreground">
            <LinkIcon className="h-5 w-5 text-primary" />
            {isActive ? "Edit Link" : "Insert Link"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* URL Input */}
          <div className="space-y-2">
            <label
              htmlFor="link-url-input"
              className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
            >
              Destination URL
            </label>
            <input
              id="link-url-input"
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                if (error) setError(null)
              }}
              placeholder="https://example.com/guide or /blog"
              autoFocus
              className="flex h-11 w-full rounded-xl border border-input bg-background/50 px-3.5 py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-background"
            />
            {error && (
              <p className="text-xs font-medium text-destructive mt-1">
                {error}
              </p>
            )}
          </div>

          {/* Open in New Tab Option */}
          <div className="rounded-xl border border-border/50 bg-muted/30 p-3.5 flex items-center justify-between">
            <div className="space-y-0.5">
              <label
                htmlFor="new-tab-toggle"
                className="text-sm font-semibold text-foreground flex items-center gap-1.5 cursor-pointer"
              >
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                Open in new tab
              </label>
              <p className="text-xs text-muted-foreground">
                Sets <code className="text-xs font-mono bg-muted px-1 rounded">target=&quot;_blank&quot;</code> with safe <code className="text-xs font-mono bg-muted px-1 rounded">noopener noreferrer</code>
              </p>
            </div>
            <input
              id="new-tab-toggle"
              type="checkbox"
              checked={openInNewTab}
              onChange={(e) => setOpenInNewTab(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer accent-primary"
            />
          </div>

          {/* SEO Link Relationship (Follow vs. Nofollow) */}
          <div className="space-y-2.5 rounded-xl border border-border/50 bg-muted/30 p-3.5">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                Search Engine Relationship (SEO)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {/* Follow Option */}
              <label
                className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                  !isNofollow
                    ? "border-primary/50 bg-primary/10 text-primary shadow-xs"
                    : "border-border/60 bg-background/50 hover:border-border text-muted-foreground"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs">Follow (Standard)</span>
                  <input
                    type="radio"
                    name="link-relationship"
                    value="follow"
                    checked={!isNofollow}
                    onChange={() => setIsNofollow(false)}
                    className="accent-primary cursor-pointer"
                  />
                </div>
                <span className="text-[11px] leading-snug text-muted-foreground">
                  Normal link without nofollow (passes SEO page rank)
                </span>
              </label>

              {/* Nofollow Option */}
              <label
                className={`flex flex-col p-3 rounded-xl border cursor-pointer transition-all ${
                  isNofollow
                    ? "border-primary/50 bg-primary/10 text-primary shadow-xs"
                    : "border-border/60 bg-background/50 hover:border-border text-muted-foreground"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs">Nofollow</span>
                  <input
                    type="radio"
                    name="link-relationship"
                    value="nofollow"
                    checked={isNofollow}
                    onChange={() => setIsNofollow(true)}
                    className="accent-primary cursor-pointer"
                  />
                </div>
                <span className="text-[11px] leading-snug text-muted-foreground">
                  Appends <code className="font-mono text-[10px]">rel=&quot;nofollow&quot;</code> for sponsored or external links
                </span>
              </label>
            </div>
          </div>

          <DialogFooter className="flex items-center justify-between gap-2 sm:justify-between pt-2">
            <div>
              {isActive && onRemove && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onRemove()
                    onClose()
                  }}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs font-semibold gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove Link
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="default"
                size="sm"
                className="rounded-xl font-semibold px-5"
              >
                Apply Link
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
