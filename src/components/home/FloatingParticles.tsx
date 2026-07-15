"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

export function FloatingParticles({ count = 30 }: { count?: number }) {
  const particles = useMemo<Particle[]>(() => {
    const p: Particle[] = []
    for (let i = 0; i < count; i++) {
      p.push({
        id: i,
        x: Math.random() * 100, // percentage
        y: Math.random() * 100, // percentage
        size: Math.random() * 4 + 1, // 1 to 5px
        duration: Math.random() * 20 + 10, // 10 to 30s
        delay: Math.random() * 10, // 0 to 10s
      })
    }
    return p
  }, [count])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-20">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/30 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: ["0vh", "-100vh"],
            x: ["0vw", `${(Math.random() - 0.5) * 20}vw`],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}
