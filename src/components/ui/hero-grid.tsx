import React from "react"

export function HeroGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-20 flex items-start justify-center [perspective:1000px]">
      <style>{`
        .bg-grid-3d {
          background-size: 60px 60px;
          background-image: 
            linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px);
          transform: rotateX(60deg) translateY(-200px) scale(3);
          animation: grid-move 5s linear infinite;
          mask-image: radial-gradient(ellipse at top, black 20%, transparent 60%);
          -webkit-mask-image: radial-gradient(ellipse at top, black 20%, transparent 60%);
        }
        .dark .bg-grid-3d {
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
        }
        @keyframes grid-move {
          0% { background-position: 0 0; }
          100% { background-position: 0 60px; }
        }
      `}</style>
      <div className="absolute inset-0 w-full h-[150%] top-0 left-0 bg-grid-3d origin-top" />
    </div>
  )
}
