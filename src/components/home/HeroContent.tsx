"use client"

import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Orbitron } from 'next/font/google'

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['900'],
})

export function HeroContent({ siteName = "I Sports Game Guide", siteDesc = "Reviews, guides, eSports news, and deep dives into the modern gaming world." }: { siteName?: string, siteDesc?: string }) {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, -150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  return (
    <motion.div 
      style={{ y, opacity }}
      className="relative z-20 flex flex-col items-center justify-center h-full max-w-7xl mx-auto px-6 text-center"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-900/20 px-5 py-1.5 text-sm font-medium text-purple-300 mb-8 backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.2)]"
      >
        Welcome to {siteName} 2.0
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
        className={`text-6xl md:text-8xl lg:text-[8rem] font-black tracking-tight text-balance leading-[1.1] drop-shadow-2xl ${orbitron.className}`}
      >
        <span className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">Winning</span> <br className="hidden md:block"/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-500 to-blue-500 drop-shadow-[0_0_40px_rgba(168,85,247,0.4)] inline-block">
          Is A Habit.
        </span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-8 text-xl text-muted-foreground md:text-2xl text-balance max-w-3xl mx-auto drop-shadow-md"
      >
        {siteDesc}
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-6 mt-12 justify-center items-center"
      >
        <Button size="lg" className="rounded-full px-12 text-lg h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-[0_0_30px_-5px_rgba(168,85,247,0.5)] hover:shadow-[0_0_40px_-5px_rgba(168,85,247,0.8)] transition-all hover:-translate-y-1 border-none text-white font-bold" asChild>
          <Link href="/blog">Read Latest Posts</Link>
        </Button>
        <Button size="lg" variant="outline" className="rounded-full px-12 text-lg h-14 backdrop-blur-md bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30 transition-all hover:-translate-y-1 text-white font-bold shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)]" asChild>
          <Link href="/categories">Browse Categories</Link>
        </Button>
      </motion.div>
    </motion.div>
  )
}
