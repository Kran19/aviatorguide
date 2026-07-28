"use client"

import React, { useEffect } from "react"
import { motion, useAnimate } from "framer-motion"
import { SafeImage } from "@/components/ui/SafeImage"
import { cn } from "@/lib/utils"

interface PortraitColumnProps {
  images: string[]
  direction: "up" | "down"
  className?: string
}

export function PortraitColumn({ images, direction, className }: PortraitColumnProps) {
  const [scope, animate] = useAnimate()
  
  // We need plenty of duplicates so we can smoothly "spin" through multiple images.
  // 10 sets of the images = images.length * 10 total.
  const duplicatedImages = Array.from({ length: 10 }).flatMap(() => images)
  const n = images.length

  useEffect(() => {
    let isActive = true
    let currentIndex = direction === "down" ? n * 6 : 0

    const runSlotMachine = async () => {
      // Set initial position immediately (0 duration)
      await animate(scope.current, { y: `-${currentIndex * 100}vh` }, { duration: 0 })

      while (isActive) {
        // 1. Pause randomly between 2s and 4s
        const waitTime = Math.random() * 2000 + 2000
        await new Promise(r => setTimeout(r, waitTime))
        if (!isActive) break

        // 2. Decide how many items to spin (e.g. 15 to 25 items for a long satisfying spin)
        const itemsToSpin = Math.floor(Math.random() * 10) + 15
        
        // 3. Calculate the target index
        const targetIndex = direction === "up" ? currentIndex + itemsToSpin : currentIndex - itemsToSpin

        // 4. Spin to target index
        // Spin speed: e.g. 0.1 seconds per item
        const spinDuration = itemsToSpin * 0.1

        // Add a slight blur during the spin for realism
        animate(scope.current, { filter: "blur(3px)" }, { duration: 0.3 })

        await animate(scope.current, { y: `-${targetIndex * 100}vh` }, {
          duration: spinDuration,
          ease: "easeInOut" // Starts slow, spins fast, stops smooth
        })
        
        if (!isActive) break

        // Remove blur when stopped
        animate(scope.current, { filter: "blur(0px)" }, { duration: 0.3 })

        // 5. Seamlessly reset index to stay within safe bounds without moving visually
        currentIndex = targetIndex
        
        // If moving UP (index increases), and we are past 8 sets (n*8), reset back by 4 sets (n*4)
        if (direction === "up" && currentIndex >= n * 8) {
          currentIndex -= n * 4
          await animate(scope.current, { y: `-${currentIndex * 100}vh` }, { duration: 0 })
        } 
        // If moving DOWN (index decreases), and we are below 2 sets (n*2), reset forward by 4 sets (n*4)
        else if (direction === "down" && currentIndex <= n * 2) {
          currentIndex += n * 4
          await animate(scope.current, { y: `-${currentIndex * 100}vh` }, { duration: 0 })
        }
      }
    }

    runSlotMachine()
    return () => { isActive = false }
  }, [animate, direction, n, scope])

  return (
    <div className={cn("relative h-screen w-full overflow-hidden flex flex-col", className)}>
      <motion.div ref={scope} className="flex flex-col absolute w-full">
        {duplicatedImages.map((src, idx) => (
          <div 
            key={`${src}-${idx}`} 
            className="relative w-full h-screen overflow-hidden group"
          >
            {/* The Image */}
            <SafeImage
              src={src}
              alt={`Slot Image ${idx}`}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover md:object-cover sm:object-cover"
              priority={idx < 10} // Preload first few
            />
            {/* Very Subtle Dark Gradient Overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)'
            }} />
          </div>
        ))}
      </motion.div>
    </div>
  )
}
