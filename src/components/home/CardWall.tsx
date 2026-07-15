"use client"

import { useRef } from "react"
import { useAnimationFrame } from "framer-motion"
import { CasinoCard } from "./CasinoCard"

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

interface CardWallProps {
  cardWidth?: number
  cardHeight?: number
  radius?: number
  totalCards?: number
  durationMs?: number // 35000 to 45000 ms per cycle
}

export function CardWall({ 
  cardWidth = 200, 
  cardHeight = 250, 
  radius = 900, 
  totalCards = 48,
  durationMs = 40000 
}: CardWallProps) {
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  // Math for cylinder mapping:
  // We distribute `totalCards` evenly around a circle (2*PI).
  // The cylinder is rotated along the X-axis so it loops vertically.
  
  const generateCards = (offsetY: number, sideOffset: number, rotationZ: number) => {
    return Array.from({ length: totalCards }).map((_, i) => {
      const angle = (i / totalCards) * Math.PI * 2
      
      // Calculate depth (Z) and vertical position (Y) based on angle
      const z = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      
      // Randomize slightly for a scattered, natural feel
      const randomRotX = (Math.random() - 0.5) * 15
      const randomRotY = (Math.random() - 0.5) * 15
      const randomRotZ = (Math.random() - 0.5) * 20
      const randomScale = 0.9 + Math.random() * 0.2
      const x = sideOffset + (Math.random() - 0.5) * 150 // Scatter horizontally

      const src = GAME_IMAGES[i % GAME_IMAGES.length]

      return (
        <div 
          key={i}
          className="absolute left-1/2 top-1/2"
          style={{
            width: cardWidth,
            height: cardHeight,
            // Centering offset
            marginLeft: -cardWidth / 2,
            marginTop: -cardHeight / 2,
            // 3D placement
            transform: `translate3d(${x}px, ${y + offsetY}px, ${z}px) rotateX(${randomRotX}deg) rotateY(${randomRotY}deg) rotateZ(${randomRotZ + rotationZ}deg) scale(${randomScale})`,
            transformStyle: "preserve-3d",
            willChange: "transform",
            backfaceVisibility: "hidden"
          }}
        >
          <CasinoCard src={src} alt={`Casino Game ${i}`} />
        </div>
      )
    })
  }

  useAnimationFrame((time) => {
    // time is continuous milliseconds
    // calculate a 0 to 1 progress based on duration
    const progress = (time % durationMs) / durationMs
    const angleOffset = progress * 360

    if (leftRef.current) {
      // Left wall moves down (or up, depending on the angle)
      leftRef.current.style.transform = `rotateX(${angleOffset}deg)`
    }
    if (rightRef.current) {
      // Right wall can move same direction or opposite. We'll do same direction, slightly offset.
      rightRef.current.style.transform = `rotateX(${angleOffset}deg)`
    }
  })

  // We rotate the entire scene by 58deg X and -18deg Y to look at the side/bottom of the cylinder, creating the tunnel effect.
  return (
    <div 
      className="absolute inset-0 w-full h-full pointer-events-none flex items-center justify-center" 
      style={{ 
        perspective: "1600px",
        transformStyle: "preserve-3d",
        overflow: "hidden"
      }}
    >
      {/* 
        This global wrapper handles the camera angle. 
        It is wrapped in a container that allows pointer events to pass through to the cards.
      */}
      <div 
        className="relative w-full h-full flex items-center justify-center pointer-events-auto"
        style={{ 
          transform: "rotateX(58deg) rotateY(-18deg)", 
          transformStyle: "preserve-3d",
          willChange: "transform"
        }}
      >
        {/* Left Wall */}
        <div 
          ref={leftRef} 
          className="absolute inset-0 w-full h-full flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {generateCards(0, -600, 15)}
        </div>

        {/* Right Wall */}
        <div 
          ref={rightRef} 
          className="absolute inset-0 w-full h-full flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* We rotate the right wall slightly so the cards interleave visually, and tilt them inward */}
          {generateCards(0, 600, -15)}
        </div>
      </div>
    </div>
  )
}
