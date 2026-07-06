"use client"

import React, { useEffect, useState } from "react"

export function FallingAlphabets() {
  const [scrollY, setScrollY] = useState(0)
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*".split("")
  const [items, setItems] = useState<{id: number, char: string, left: number, top: number, speed: number, opacity: number, fontSize: number, rotate: number}[]>([])

  useEffect(() => {
    // Generate random positions once on mount to avoid hydration mismatch
    const newItems = Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      char: letters[Math.floor(Math.random() * letters.length)],
      left: Math.random() * 100,
      top: -10 + Math.random() * 110, // scattered across height
      speed: 0.15 + Math.random() * 0.6, // parallax speed multiplier
      opacity: 0.05 + Math.random() * 0.25,
      fontSize: 1 + Math.random() * 4, // size in rem
      rotate: -30 + Math.random() * 60 // slight random rotation
    }))
    setItems(newItems)
  }, [])

  if (items.length === 0) return null

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-15]">
      {items.map((item) => (
        <span 
          key={item.id}
          className="absolute font-mono font-black text-primary transition-transform duration-75 ease-out will-change-transform drop-shadow-[0_0_10px_rgba(var(--primary),0.5)]"
          style={{
            left: `${item.left}%`,
            top: `${item.top}%`,
            opacity: item.opacity,
            fontSize: `${item.fontSize}rem`,
            transform: `translateY(${scrollY * item.speed}px) rotate(${item.rotate}deg)`
          }}
        >
          {item.char}
        </span>
      ))}
    </div>
  )
}
