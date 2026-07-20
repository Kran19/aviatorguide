"use client"

import React, { useEffect, useRef } from "react"
import { PortraitColumn } from "./PortraitColumn"

export function HeroColumns() {
  const imagesCol1 = [
    "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1622322300063-e5e80629ec24?q=80&w=800&auto=format&fit=crop"
  ]
  
  const imagesCol2 = [
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1621571439247-41804ff69b2d?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1596041697334-0985da0d859b?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=800&auto=format&fit=crop"
  ]

  const imagesCol3 = [
    "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=800&auto=format&fit=crop"
  ]

  const imagesCol4 = [
    "https://images.unsplash.com/photo-1621571439247-41804ff69b2d?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1622322300063-e5e80629ec24?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1596041697334-0985da0d859b?q=80&w=800&auto=format&fit=crop"
  ]

  return (
    <>
      {/* Desktop Layout (4 Columns) */}
      <div className="hidden md:flex absolute inset-0 z-10 w-full h-full">
        <div className="w-1/4 h-full border-r border-white/5">
          <PortraitColumn images={imagesCol1} direction="up" speed={5} />
        </div>
        <div className="w-1/4 h-full border-r border-white/5">
          <PortraitColumn images={imagesCol2} direction="down" speed={8} />
        </div>
        <div className="w-1/4 h-full border-r border-white/5">
          <PortraitColumn images={imagesCol3} direction="up" speed={6} />
        </div>
        <div className="w-1/4 h-full">
          <PortraitColumn images={imagesCol4} direction="down" speed={9} />
        </div>
      </div>

      {/* Mobile Layout (2 Columns) */}
      <div className="flex md:hidden absolute inset-0 z-10 w-full h-full">
        <div className="w-1/2 h-full border-r border-white/5">
          <PortraitColumn images={[...imagesCol1, ...imagesCol3]} direction="up" speed={6} />
        </div>
        <div className="w-1/2 h-full">
          <PortraitColumn images={[...imagesCol2, ...imagesCol4]} direction="down" speed={8} />
        </div>
      </div>
    </>
  )
}
