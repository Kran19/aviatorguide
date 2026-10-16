"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateGlobalSettings } from "@/actions/settings.actions"
import { Save, Sparkles, Globe, Link as LinkIcon, ShieldCheck } from "lucide-react"

export default function SettingsForm({ initialData }: { initialData: any }) {
  const [pending, setPending] = useState(false)
  const [message, setMessage] = useState("")
  const [portalEnabled, setPortalEnabled] = useState(initialData?.featuredPortalEnabled ?? true)
  const [relFollow, setRelFollow] = useState(initialData?.featuredPortalRelFollow ?? false)

  async function handleSubmit(formData: FormData) {
    setPending(true)
    setMessage("")
    try {
      formData.set("featuredPortalEnabled", portalEnabled ? "true" : "false")
      formData.set("featuredPortalRelFollow", relFollow ? "true" : "false")
      await updateGlobalSettings(formData)
      setMessage("Settings saved successfully!")
    } catch (err: any) {
      setMessage(err.message || "Failed to save settings")
    } finally {
      setPending(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8 max-w-4xl">
      {message && (
        <div className={`text-sm p-4 rounded-xl font-medium border ${message.includes("success") ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-destructive/10 border-destructive/30 text-destructive"}`}>
          {message}
        </div>
      )}
      
      {/* General Site & SEO Settings */}
      <div className="p-6 rounded-2xl bg-card border border-border/70 shadow-sm space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-border/50">
          <Globe className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">General &amp; SEO Configuration</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site Name</Label>
            <Input id="siteName" name="siteName" required defaultValue={initialData?.siteName || "I Sports Game Guide"} />
            <p className="text-xs text-muted-foreground">The main name of your website.</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="seoTitle">Default SEO Title</Label>
            <Input id="seoTitle" name="seoTitle" defaultValue={initialData?.seoTitle || ""} placeholder="e.g. I Sports Game Guide - Esports & Crash Game Guides" />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="seoDescription">Default SEO Description</Label>
          <Textarea id="seoDescription" name="seoDescription" defaultValue={initialData?.seoDescription || ""} rows={3} placeholder="A short description of your site for search engines..." />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="seoKeywords">Default SEO Keywords</Label>
          <Input id="seoKeywords" name="seoKeywords" defaultValue={initialData?.seoKeywords || ""} placeholder="gaming, news, reviews, esports" />
        </div>
      </div>

      {/* Featured Gaming Portal Section Configuration */}
      <div className="p-6 rounded-2xl bg-card border border-border/70 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-400" />
            <div>
              <h2 className="text-lg font-bold text-foreground">Featured Gaming Portal (CTA Banner)</h2>
              <p className="text-xs text-muted-foreground">Configure the promotional banner shown on the homepage and blog articles.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="portalEnabledToggle" className="text-sm font-semibold cursor-pointer">
              {portalEnabled ? "Active" : "Disabled"}
            </Label>
            <input
              id="portalEnabledToggle"
              type="checkbox"
              checked={portalEnabled}
              onChange={(e) => setPortalEnabled(e.target.checked)}
              className="h-5 w-5 rounded border-border bg-background text-emerald-500 focus:ring-emerald-500 cursor-pointer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="featuredPortalHeading">Section Heading / Badge</Label>
            <Input
              id="featuredPortalHeading"
              name="featuredPortalHeading"
              defaultValue={initialData?.featuredPortalHeading || "Featured Gaming Portal"}
              placeholder="Featured Gaming Portal"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="featuredPortalTitle">Title</Label>
            <Input
              id="featuredPortalTitle"
              name="featuredPortalTitle"
              defaultValue={initialData?.featuredPortalTitle || "Ready to Play & Win Rewards?"}
              placeholder="Ready to Play & Win Rewards?"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="featuredPortalDescription">Description</Label>
          <Textarea
            id="featuredPortalDescription"
            name="featuredPortalDescription"
            defaultValue={initialData?.featuredPortalDescription || "Experience fast multiplier rounds, instant cashouts, and official certified fair play."}
            rows={2}
            placeholder="Experience fast multiplier rounds, instant cashouts, and official certified fair play."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="featuredPortalBadge1">Feature Badge 1</Label>
            <Input
              id="featuredPortalBadge1"
              name="featuredPortalBadge1"
              defaultValue={initialData?.featuredPortalBadge1 || "Provably Fair"}
              placeholder="Provably Fair"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="featuredPortalBadge2">Feature Badge 2</Label>
            <Input
              id="featuredPortalBadge2"
              name="featuredPortalBadge2"
              defaultValue={initialData?.featuredPortalBadge2 || "Instant Cashouts"}
              placeholder="Instant Cashouts"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-border/40">
          <div className="space-y-2">
            <Label htmlFor="featuredPortalCtaText">CTA Button Text</Label>
            <Input
              id="featuredPortalCtaText"
              name="featuredPortalCtaText"
              defaultValue={initialData?.featuredPortalCtaText || "PLAY NOW"}
              placeholder="PLAY NOW"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="featuredPortalCtaUrl">CTA Destination URL</Label>
            <Input
              id="featuredPortalCtaUrl"
              name="featuredPortalCtaUrl"
              defaultValue={initialData?.featuredPortalCtaUrl || "https://rocky11.club/?refercode=SEO"}
              placeholder="https://example.com/play"
            />
          </div>
        </div>

        {/* SEO Link Relationship Selector */}
        <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-3">
          <div className="flex items-center gap-2">
            <LinkIcon className="h-4 w-4 text-primary" />
            <Label className="text-sm font-bold text-foreground">CTA Link SEO Relationship</Label>
          </div>
          <p className="text-xs text-muted-foreground">
            Control whether search engine bots follow or ignore the promotional CTA link.
          </p>
          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer font-medium">
              <input
                type="radio"
                name="portalRelRadio"
                checked={!relFollow}
                onChange={() => setRelFollow(false)}
                className="text-primary focus:ring-primary cursor-pointer"
              />
              <span>Nofollow (Recommended for Affiliate/Sponsored CTA)</span>
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer font-medium">
              <input
                type="radio"
                name="portalRelRadio"
                checked={relFollow}
                onChange={() => setRelFollow(true)}
                className="text-primary focus:ring-primary cursor-pointer"
              />
              <span>Follow (Standard Link)</span>
            </label>
          </div>
        </div>
      </div>
      
      <Button type="submit" disabled={pending} size="lg" className="gap-2 h-12 px-6 rounded-xl font-bold">
        <Save className="h-4 w-4" />
        {pending ? "Saving Settings..." : "Save Settings"}
      </Button>
    </form>
  )
}
