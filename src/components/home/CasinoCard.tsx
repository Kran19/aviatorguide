import Image from "next/image"

interface CasinoCardProps {
  src: string
  alt?: string
}

export function CasinoCard({ src, alt = "Casino Game" }: CasinoCardProps) {
  return (
    <div className="group relative w-full h-full rounded-[28px] overflow-hidden border border-purple-500/35 bg-black/40 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md cursor-pointer transition-transform duration-500 will-change-transform" style={{ transformStyle: "preserve-3d" }}>
      
      {/* 
        This nested wrapper is what scales up and moves toward the camera on hover.
        Using a separate wrapper prevents layout recalculations. 
      */}
      <div className="absolute inset-0 w-full h-full transition-transform duration-500 ease-out group-hover:scale-[1.08] group-hover:translate-z-[30px]" style={{ transformStyle: "preserve-3d" }}>
        
        {/* Glow behind image on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-purple-500/30 blur-2xl transition-opacity duration-500" />
        
        <Image 
          src={src} 
          alt={alt}
          fill
          unoptimized
          className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
        />
        
        {/* Glassmorphism reflection (moves slightly on hover via scale) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-50 pointer-events-none" />
        
        {/* Stronger border and edge light on hover */}
        <div className="absolute inset-0 rounded-[28px] border-2 border-white/0 group-hover:border-purple-400/50 transition-colors duration-500 shadow-[inset_0_0_20px_rgba(168,85,247,0)] group-hover:shadow-[inset_0_0_20px_rgba(168,85,247,0.5)] pointer-events-none" />
        <div className="absolute inset-0 rounded-[28px] border-[1px] border-blue-400/0 group-hover:border-blue-400/50 shadow-[0_0_20px_rgba(59,130,246,0)] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] mix-blend-screen transition-all duration-500 pointer-events-none" />
      </div>
    </div>
  )
}
