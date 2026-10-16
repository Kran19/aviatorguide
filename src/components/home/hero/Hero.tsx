import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight } from "lucide-react"

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
          <span>PREMIUM I-SPORTS &amp; ESPORTS INTELLIGENCE</span>
        </div>

        {/* Semantic Primary H1 Header */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] sm:leading-[1.05]">
          <span className="block text-foreground">PLAY SMART.</span>
          <span className="block text-foreground/90">WIN STRATEGIC.</span>
          <span className="block bg-gradient-to-r from-primary via-emerald-400 to-teal-400 bg-clip-text text-transparent drop-shadow-sm">
            I SPORTS GAME GUIDE.
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="max-w-2xl text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed font-normal">
          Your premier destination for in-depth i-sports guides, crash game mechanics, sports analytics, and competitive gaming intelligence.
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
