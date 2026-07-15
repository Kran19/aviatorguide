export function GlowBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-30">
      {/* Base dark background */}
      <div className="absolute inset-0 bg-[#030014]" />
      
      {/* Radial purple glow in the center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-purple-900/30 rounded-full blur-[120px] mix-blend-screen" />
      
      {/* Blue ambient light from the bottom edges */}
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vh] bg-blue-900/20 rounded-full blur-[100px] mix-blend-screen" />
      <div className="absolute bottom-0 right-0 w-[40vw] h-[40vh] bg-blue-900/20 rounded-full blur-[100px] mix-blend-screen" />
      
      {/* Subtle lens flare / bright spot in center */}
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[20vh] bg-fuchsia-500/10 rounded-full blur-[80px]" />
      
      {/* Very soft vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.8)_100%)] z-10" />
    </div>
  )
}
