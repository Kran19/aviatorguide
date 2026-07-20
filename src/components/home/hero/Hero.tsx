"use client"

import React, { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis"

import { GradientBackground } from "./GradientBackground"
import { FloatingParticles } from "./FloatingParticles"
import { HeroColumns } from "./HeroColumns"
import { HeroContent } from "./HeroContent"

gsap.registerPlugin(ScrollTrigger)

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const columnsWrapperRef = useRef<HTMLDivElement>(null)
  const contentWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 1. Initialize Lenis for Smooth Scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // 2. Mouse Parallax & Gyroscope
    const handleMove = (x: number, y: number) => {
      if (!columnsWrapperRef.current || !contentWrapperRef.current) return
      
      const xPercent = (x / window.innerWidth - 0.5) * 2
      const yPercent = (y / window.innerHeight - 0.5) * 2

      // Columns move slightly opposite to mouse
      gsap.to(columnsWrapperRef.current, {
        x: xPercent * -15,
        y: yPercent * -15,
        duration: 1,
        ease: "power2.out"
      })

      // Content moves slightly with mouse (creates depth)
      gsap.to(contentWrapperRef.current, {
        x: xPercent * 5,
        y: yPercent * 5,
        duration: 1,
        ease: "power2.out"
      })
    }

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY)
    }

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma === null || e.beta === null) return
      // gamma is left/right (-90 to 90)
      // beta is front/back (-180 to 180)
      const x = (Math.max(-45, Math.min(45, e.gamma)) + 45) / 90 * window.innerWidth
      const y = (Math.max(-45, Math.min(45, e.beta - 45)) + 45) / 90 * window.innerHeight
      handleMove(x, y)
    }

    window.addEventListener("mousemove", handleMouseMove)
    if (typeof DeviceOrientationEvent !== "undefined") {
      window.addEventListener("deviceorientation", handleDeviceOrientation)
    }

    // 3. Scroll Trigger (Fade out content, scale columns)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      }
    })

    tl.to(contentWrapperRef.current, {
      opacity: 0,
      y: -100,
      ease: "none"
    }, 0)
    
    tl.to(columnsWrapperRef.current, {
      scale: 1.05,
      ease: "none"
    }, 0)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("deviceorientation", handleDeviceOrientation)
      lenis.destroy()
      tl.kill()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-[100vh] overflow-hidden bg-[#060606]"
    >
      <GradientBackground />
      <FloatingParticles />
      
      <div ref={columnsWrapperRef} className="absolute inset-0 w-full h-full">
        <HeroColumns />
      </div>

      <div ref={contentWrapperRef} className="absolute inset-0 w-full h-full pointer-events-none z-30">
        <HeroContent />
      </div>
    </section>
  )
}
