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

    // 2. Scroll Trigger (Scale columns slightly on scroll down)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
      }
    })
    
    tl.to(columnsWrapperRef.current, {
      scale: 1.05,
      ease: "none"
    }, 0)

    return () => {
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
      
      <div ref={columnsWrapperRef} className="absolute inset-0 w-full h-full z-0">
        <HeroColumns />
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-30 pointer-events-none" />
    </section>
  )
}
