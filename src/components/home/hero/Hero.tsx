import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, ShieldCheck, Zap, Trophy } from "lucide-react"

export function Hero() {
  return (
    <section className="relative w-full min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-background text-foreground py-20 px-4 sm:px-6 lg:px-8">
      {/* CSS-Only Ambient Glow Gradients (Zero JS / No continuous rAF) */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[450px] sm:h-[600px] bg-gradient-to-b from-primary/20 via-blue-500/10 to-transparent blur-3xl opacity-60 rounded-full" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-emerald-500/10 blur-3xl rounded-full opacity-40" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-blue-600/10 blur-3xl rounded-full opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center space-y-8">
        
        {/* Quality Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/25 bg-primary/10 text-primary text-xs sm:text-sm font-semibold tracking-wide shadow-sm">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>PREMIUM GAMING &amp; ESPORTS INTELLIGENCE</span>
        </div>

        {/* Semantic Primary H1 Header */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] sm:leading-[1.05]">
          <span className="block text-foreground">BET SMART.</span>
          <span className="block text-foreground/90">BET FASTER.</span>
          <span className="block bg-gradient-to-r from-primary via-blue-500 to-emerald-400 bg-clip-text text-transparent drop-shadow-sm">
            BETSETGO.
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed font-normal">
          Your premier destination for in-depth game guides, crash game mechanics, sports analytics, and the latest esports drops.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 w-full sm:w-auto">
          <Button 
            size="lg" 
            className="w-full sm:w-auto rounded-full h-13 px-8 text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/35 transition-all duration-300 transform hover:-translate-y-0.5" 
            asChild
          >
            <Link href="/blog" className="flex items-center justify-center gap-2">
              <span>Explore Latest Drops</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>

          <Button 
            size="lg" 
            variant="outline" 
            className="w-full sm:w-auto rounded-full h-13 px-8 text-base font-semibold border-border hover:bg-muted/80 transition-all duration-300"
            asChild
          >
            <a 
              href="https://rocky11.club/?refercode=SEO" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4 text-emerald-400" />
              <span>Join Games</span>
            </a>
          </Button>
        </div>

        {/* Feature Highlights / Trust Signals */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-10 border-t border-border/40 w-full max-w-3xl text-left">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-card/40 border border-border/40 backdrop-blur-sm">
            <Zap className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="text-xs font-bold text-foreground">Real-Time Insights</p>
              <p className="text-[11px] text-muted-foreground">Updated strategies &amp; reviews</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-card/40 border border-border/40 backdrop-blur-sm">
            <Trophy className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-foreground">Expert Breakdowns</p>
              <p className="text-[11px] text-muted-foreground">Crash games, slots &amp; sports</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-card/40 border border-border/40 backdrop-blur-sm">
            <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-foreground">Verified Coverage</p>
              <p className="text-[11px] text-muted-foreground">100% fair analysis</p>
            </div>
          </div>
        </div>

      </div>

      {/* Subtle Bottom Section Fade */}
      <div 
        aria-hidden="true" 
        className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" 
      />
    </section>
  )
}
