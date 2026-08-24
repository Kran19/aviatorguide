import Image from "next/image"
import { CheckCircle2, Play } from "lucide-react"

export function ServiceProviderSection() {
  return (
    <section className="bg-[#050505] text-white py-16 md:py-24 relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
        
        {/* Left side: Image and overlays */}
        <div className="relative w-full aspect-[4/5] md:aspect-square lg:aspect-[4/5] rounded-lg overflow-hidden border border-white/10 group">
          <Image
            src="https://images.unsplash.com/photo-1596484552834-6a58f850d0d1?q=80&w=1000&auto=format&fit=crop"
            alt="Service Provider"
            fill
            className="object-cover"
            unoptimized
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Central Play Button overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
              <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white ml-1" />
            </div>
          </div>

          {/* 10 Years Experience Badge */}
          <div className="absolute top-4 left-4 sm:top-8 sm:left-8 w-24 h-24 sm:w-32 sm:h-32 bg-[#111] rounded-full flex items-center justify-center border-2 border-dashed border-[#FFB800] animate-[spin_10s_linear_infinite]">
            <div className="absolute inset-0 flex items-center justify-center flex-col animate-[spin_10s_linear_infinite_reverse]">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#FFB800]">10</span>
              <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase">Years</span>
            </div>
          </div>
          
          {/* Bottom WhatsApp numbers mock overlay */}
          <div className="absolute bottom-0 left-0 w-full bg-black/80 backdrop-blur-md p-3 flex gap-4 text-xs font-mono text-green-400 overflow-x-auto whitespace-nowrap hide-scrollbar">
            <span>💬 9111191111</span>
            <span>💬 9111191111</span>
            <span>💬 9111191111</span>
            <span>💬 9111191111</span>
            <span>💬 9111191111</span>
          </div>
        </div>

        {/* Right side: Text Content */}
        <div className="flex flex-col justify-center space-y-8">
          <div className="space-y-2">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase leading-tight tracking-tight">
              WE'RE THE BEST<br />
              SERVICE<br />
              <span className="text-[#FFB800]">PROVIDER</span>
            </h2>
            {/* Decorative line/brush stroke representation */}
            <div className="w-32 h-2 bg-[#FFB800] rounded-full mt-4" style={{ filter: "drop-shadow(0 0 8px rgba(255, 184, 0, 0.5))" }}></div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-xl sm:text-2xl italic font-semibold text-white/90">
              KHELO DUM PAR, JEETO BUMPER
            </h3>
            <p className="text-white/70 text-base sm:text-lg leading-relaxed max-w-xl">
              Welcome to Rocky Book - the world's biggest betting exchange. We offer a wide range of options to bet on including sportsbook, live cards & live casino
            </p>
          </div>

          <ul className="space-y-4 pt-4">
            {[
              "Instant Withdrawal & Deposit",
              "24 /7 Customer Service",
              "Referral Bonus"
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#FFB800] shrink-0" />
                <span className="text-base sm:text-lg font-medium text-white/90">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="pt-6">
            <a 
              href="https://rocky11.club/?refercode=SEO"
              rel="nofollow"
              target="_blank"
              className="inline-flex items-center justify-center h-14 px-10 border-2 border-[#FFB800] rounded-xl text-[#FFB800] font-bold text-lg hover:bg-[#FFB800] hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(255,184,0,0.2)] hover:shadow-[0_0_30px_rgba(255,184,0,0.5)]"
            >
              PLAY NOW
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
