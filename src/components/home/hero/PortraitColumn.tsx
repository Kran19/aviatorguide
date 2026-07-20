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
    <div className={cn("relative h-[150vh] w-full overflow-hidden flex flex-col gap-[10px]", className)}>
      <motion.div
        className="flex flex-col gap-[10px] absolute w-full"
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
            className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden group cursor-pointer"
          >
            {/* The Image */}
            <Image
              src={src}
              alt={`Hero showcase ${idx}`}
              fill
              sizes="25vw"
              className="object-cover scale-110 brightness-80 contrast-110 blur-[1px] transition-all duration-700 ease-out group-hover:scale-[1.15] group-hover:brightness-100 group-hover:blur-none"
            />
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.75) 100%)'
            }} />
          </div>
        ))}
      </motion.div>
    </div>
  )
}
