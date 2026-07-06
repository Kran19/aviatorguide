import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] py-20 px-4 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="space-y-6 max-w-4xl">
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
          Introducing betsetgo.xyz version 1.0
        </div>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-balance">
          Level Up Your <span className="text-primary">Gaming.</span>
        </h1>
        <p className="text-xl text-muted-foreground md:text-2xl text-balance max-w-2xl mx-auto">
          Reviews, guides, eSports news, and deep dives into the modern gaming world.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mt-10">
        <Button size="lg" className="rounded-full px-8 text-md h-12 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1" asChild>
          <Link href="/blog">Read Latest Posts</Link>
        </Button>
        <Button size="lg" variant="outline" className="rounded-full px-8 text-md h-12 transition-all hover:-translate-y-1" asChild>
          <Link href="/about">About Us</Link>
        </Button>
      </div>
    </div>
  )
}
