"use client"

import React, { useEffect, useRef } from "react"
import { PortraitColumn } from "./PortraitColumn"

export function HeroColumns() {
  const baseImages = Array.from({ length: 30 }, (_, i) => `/images/hero/${String(i + 1).padStart(2, '0')}.webp`)

  const imagesCol1 = baseImages.slice(0, 8)
  const imagesCol2 = baseImages.slice(8, 16)
  const imagesCol3 = baseImages.slice(16, 23)
  const imagesCol4 = baseImages.slice(23, 30)

  return (
    <>
      {/* Desktop Layout (4 Columns) */}
      <div className="hidden md:flex absolute inset-0 z-10 w-full h-full">
        <div className="w-1/4 h-full border-r border-white/5">
          <PortraitColumn images={imagesCol1} direction="up" />
        </div>
        <div className="w-1/4 h-full border-r border-white/5">
          <PortraitColumn images={imagesCol2} direction="down" />
        </div>
        <div className="w-1/4 h-full border-r border-white/5">
          <PortraitColumn images={imagesCol3} direction="up" />
        </div>
        <div className="w-1/4 h-full">
          <PortraitColumn images={imagesCol4} direction="down" />
        </div>
      </div>

      {/* Mobile Layout (2 Columns) */}
      <div className="flex md:hidden absolute inset-0 z-10 w-full h-full">
        <div className="w-1/2 h-full border-r border-white/5">
          <PortraitColumn images={[...imagesCol1, ...imagesCol3]} direction="up" />
        </div>
        <div className="w-1/2 h-full">
          <PortraitColumn images={[...imagesCol2, ...imagesCol4]} direction="down" />
        </div>
      </div>
    </>
  )
}
