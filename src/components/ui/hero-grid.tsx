"use client"

import React, { useEffect, useState, useMemo } from "react"
import Image from "next/image"

const GAME_IMAGES = [
  "/games/2_card_teenpatti.webp",
  "/games/Jili_AK47.webp",
  "/games/Jili_Bombing_Fishing.webp",
  "/games/aes_dragon_tiger.webp",
  "/games/avt_aviator.webp",
  "/games/baccarat.webp",
  "/games/bingo.webp",
  "/games/chickensubway.webp",
  "/games/colorgame.webp",
  "/games/cqc_lucky_fishing.webp",
  "/games/evo_extrachilliepicspins.webp",
  "/games/extra_sicbo.webp",
  "/games/iog_wheel.webp",
  "/games/mgg_amazingpharoah.webp",
  "/games/plinko.webp",
  "/games/rg_2card_tp.webp",
  "/games/win_agent_spinity.webp",
]

const ROWS = 20
const COLS = 30

const shuffle = (array: string[]) => array.slice().sort(() => Math.random() - 0.5)

export function HeroGrid() {
  const [mounted, setMounted] = useState(false)

  // Generate grid exactly once on the client
  const gridRows = useMemo(() => {
    if (!mounted) return []
    
    const grid: string[][] = []
    for (let r = 0; r < ROWS; r++) {
      const row: string[] = []
      let available = shuffle(GAME_IMAGES)
      for (let c = 0; c < COLS; c++) {
        if (available.length === 0) available = shuffle(GAME_IMAGES)
        // Prevent adjacent duplicates in the same row
        if (c > 0 && available[0] === row[c - 1]) {
          if (available.length > 1) {
            const temp = available[0]
            available[0] = available[1]
            available[1] = temp
          } else {
             // If only one left and it's a duplicate, just use it or reshuffle early
             available = shuffle(GAME_IMAGES)
             if (available[0] === row[c - 1] && available.length > 1) {
                 const temp = available[0]
                 available[0] = available[1]
                 available[1] = temp
             }
          }
        }
        row.push(available.shift()!)
      }
      grid.push(row)
    }
    return grid
  }, [mounted])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return empty static skeleton or just the background to prevent hydration mismatch
    return <div className="absolute inset-0 overflow-hidden pointer-events-none -z-20 bg-background" />
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-20 flex items-start justify-center [perspective:1000px]">
      <style>{`
        .mask-grid {
          mask-image: radial-gradient(ellipse at top, black 20%, transparent 60%);
          -webkit-mask-image: radial-gradient(ellipse at top, black 20%, transparent 60%);
        }
        @keyframes grid-scroll-down {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0%); }
        }
        .animate-grid-scroll {
          animation: grid-scroll-down 100s linear infinite;
          will-change: transform;
        }
      `}</style>

      {/* 
        This wrapper applies the exact same 3D transform that the background had. 
        It scales by 3, rotates by 60deg, and moves Y by -200px.
      */}
      <div 
        className="relative w-full h-[150%] top-0 left-0 origin-top mask-grid flex justify-center"
        style={{ 
            transform: 'rotateX(60deg) translateY(-200px) scale(3)',
            transformStyle: 'preserve-3d'
        }}
      >
        {/* 
          This container scrolls infinitely. It holds two identical blocks to seamlessly loop.
          Moving from -50% to 0% smoothly transitions 20 rows of 60px (1200px) in 100s, 
          which matches the original 60px in 5s.
        */}
        <div className="absolute flex flex-col animate-grid-scroll">
            
          {/* Render the block twice for seamless looping */}
          {[0, 1].map((blockIdx) => (
            <div 
              key={blockIdx}
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${COLS}, 56px)`,
                gridAutoRows: '56px',
                gap: '4px', // 56 + 4 = 60px stride
              }}
            >
              {gridRows.map((row, r) => (
                row.map((src, c) => (
                  <div 
                    key={`${blockIdx}-${r}-${c}`}
                    className="relative w-full h-full rounded-[6px] overflow-hidden border border-purple-500/40 shadow-[0_0_12px_rgba(168,85,247,0.3)] bg-black"
                  >
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/60 z-10 pointer-events-none" />
                    
                    {/* unoptimized is used because these are local public images and we have 600+ of them, avoiding Next.js image optimizer limits */}
                    <Image 
                      src={src} 
                      alt="Game Artwork" 
                      fill 
                      unoptimized
                      className="object-cover filter blur-[0.5px] brightness-75 saturate-[0.85]"
                    />
                  </div>
                ))
              ))}
            </div>
          ))}

        </div>
      </div>
      
      {/* Additional gradient at the bottom/center to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent pointer-events-none" />
    </div>
  )
}
