"use client"

import React, { useEffect, useRef } from "react"

export function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: { x: number; y: number; size: number; speedY: number; speedX: number; opacity: number }[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const initParticles = () => {
      particles = []
      const particleCount = Math.floor(window.innerWidth / 20)
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          speedX: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.1,
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "#3B82F6"

      particles.forEach((p) => {
        ctx.globalAlpha = p.opacity
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        p.x += p.speedX
        p.y += p.speedY

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1
      })

      animationFrameId = requestAnimationFrame(draw)
    }

    window.addEventListener("resize", () => {
      resize()
      initParticles()
    })

    resize()
    initParticles()
    draw()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-screen"
    />
  )
}
