"use client"

import React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface PortraitColumnProps {
  images: string[]
  direction: "up" | "down"
  speed?: number
  className?: string
}

export function PortraitColumn({ images, direction, speed = 25, className }: PortraitColumnProps) {
  // We duplicate the images array to create a seamless infinite loop
  const duplicatedImages = [...images, ...images]

  return (
    <div className={cn("relative h-screen w-full overflow-hidden flex flex-col", className)}>
      <motion.div
        className="flex flex-col absolute w-full"
        animate={{
          y: direction === "up" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: speed,
        }}
      >
        {duplicatedImages.map((src, idx) => (
          <div 
            key={`${src}-${idx}`} 
            className="relative w-full h-screen overflow-hidden group"
          >
            {/* The Image */}
            <Image
              src={src}
              alt={`Hero showcase ${idx}`}
              fill
              sizes="25vw"
              className="object-cover"
              priority={idx < 2} // prioritize first few images
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
