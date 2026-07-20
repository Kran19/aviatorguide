"use client"

import React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function HeroContent() {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="pointer-events-auto flex flex-col items-center max-w-[650px] space-y-6"
      >
        <span className="inline-block border border-white/20 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.2em] text-white/90 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          THE FUTURE OF SPORTS BETTING
        </span>

        <h1 className="text-5xl md:text-7xl lg:text-[96px] font-extrabold leading-[0.9] text-white drop-shadow-2xl">
          <span className="block">BET SMART.</span>
          <span className="block">BET FASTER.</span>
          <span className="block bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.6)]">
            BETSETGO.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-white/70 font-medium">
          Experience real-time betting, AI-powered insights, instant payouts, and premium gaming designed for the next generation.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
          <Button 
            size="lg" 
            className="rounded-full h-14 px-8 text-lg font-bold bg-white text-black hover:bg-gray-200 shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group"
          >
            {/* Light sweep animation */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:animate-[shimmer_1.5s_infinite] skew-x-12 opacity-50 mix-blend-overlay" />
            <span className="relative z-10">Start Betting</span>
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="rounded-full h-14 px-8 text-lg font-bold border-white/20 text-white hover:bg-white/10 hover:text-white backdrop-blur-md transition-all duration-300"
          >
            Learn More
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
