"use client"

import React, { useEffect, useRef } from "react"
import { PortraitColumn } from "./PortraitColumn"

export function HeroColumns() {
  const baseImages = [
    "https://plus.unsplash.com/premium_photo-1694004710209-d0e769a280a3?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1603378596501-8bbfc7059d5e?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1594316663037-23fffae0d4e7?w=600&auto=format&fit=crop&q=60",
    "https://plus.unsplash.com/premium_photo-1679456904325-19ca215974a7?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1616645004064-aebe96923cbb?w=600&auto=format&fit=crop&q=60",
    "https://plus.unsplash.com/premium_photo-1698525789065-8188a9ac9504?w=600&auto=format&fit=crop&q=60",
    "https://plus.unsplash.com/premium_photo-1698525803937-0ceeedd047cf?w=600&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1627831389670-d20f5a01c536?w=600&auto=format&fit=crop&q=60",
  ]

  const imagesCol1 = [0, 1, 2, 3, 4, 5, 6, 7].map(i => baseImages[i])
  const imagesCol2 = [2, 3, 4, 5, 6, 7, 0, 1].map(i => baseImages[i])
  const imagesCol3 = [4, 5, 6, 7, 0, 1, 2, 3].map(i => baseImages[i])
  const imagesCol4 = [6, 7, 0, 1, 2, 3, 4, 5].map(i => baseImages[i])

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
