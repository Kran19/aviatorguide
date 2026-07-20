"use client"

import React, { useEffect, useRef } from "react"
import { PortraitColumn } from "./PortraitColumn"

export function HeroColumns() {
  const imagesCol1 = [
    "/games/aes_dragon_tiger.webp",
    "/games/baccarat.webp",
    "/games/bingo.webp",
    "/games/chickensubway.webp",
  ]
  
  const imagesCol2 = [
    "/games/colorgame.webp",
    "/games/cqc_lucky_fishing.webp",
    "/games/evo_extrachilliepicspins.webp",
    "/games/extra_sicbo.webp",
  ]

  const imagesCol3 = [
    "/games/iog_wheel.webp",
    "/games/mgg_amazingpharoah.webp",
    "/games/plinko.webp",
    "/games/rg_2card_tp.webp",
  ]

  const imagesCol4 = [
    "/games/win_agent_spinity.webp",
    "/games/2_card_teenpatti.webp",
    "/games/Jili_AK47.webp",
    "/games/Jili_Bombing_Fishing.webp",
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
