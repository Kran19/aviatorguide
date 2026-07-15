"use client"

import { useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion"
import { GlowBackground } from "./GlowBackground"
import { FloatingParticles } from "./FloatingParticles"
import { CardWall } from "./CardWall"
import { HeroContent } from "./HeroContent"

interface HeroProps {
  siteName?: string
  siteDesc?: string
}

export function Hero({ siteName, siteDesc }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Mouse Parallax values
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  // Spring configurations for smooth parallax
  const springConfig = { damping: 30, stiffness: 100, mass: 1 }
  const smoothMouseX = useSpring(mouseX, springConfig)
  const smoothMouseY = useSpring(mouseY, springConfig)

  // Map mouse position [-1, 1] to slight rotation degrees [-6, 6]
  const rotateY = useTransform(smoothMouseX, [-1, 1], [-6, 6])
  const rotateX = useTransform(smoothMouseY, [-1, 1], [6, -6])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      // Normalize to -1 to 1
      const x = (e.clientX / innerWidth) * 2 - 1
      const y = (e.clientY / innerHeight) * 2 - 1
      mouseX.set(x)
      mouseY.set(y)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  // Scroll effect to slightly move the container down
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 1000], [0, 300])
  const scale = useTransform(scrollY, [0, 1000], [1, 1.1])

  return (
    <section 
      ref={containerRef}
      className="relative w-full h-[100vh] overflow-hidden bg-[#030014] select-none"
    >
      <GlowBackground />
      <FloatingParticles count={40} />
      
      {/* 3D Scene Wrapper with Parallax */}
      <motion.div 
        className="absolute inset-0 w-full h-full"
        style={{
          rotateX,
          rotateY,
          y,
          scale,
          transformStyle: "preserve-3d"
        }}
      >
        <CardWall />
      </motion.div>

      {/* Center Content overlaid flat */}
      <div className="absolute inset-0 pointer-events-none z-50">
        <div className="pointer-events-auto h-full w-full">
          <HeroContent siteName={siteName} siteDesc={siteDesc} />
        </div>
      </div>
      
      {/* Black fade gradient at the very bottom to blend into the rest of the page smoothly */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-40 pointer-events-none" />
    </section>
  )
}
