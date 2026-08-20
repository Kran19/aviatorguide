import Link from "next/link";
import { Gamepad2 } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border/50 bg-muted/20 mt-20 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <Gamepad2 className="h-6 w-6 text-primary group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-black text-xl tracking-tight group-hover:text-primary transition-colors duration-300">
                betsetgo.xyz
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              Your premium destination for eSports news, RPG guides, and the latest deep dives into the modern gaming world. Level up your experience with us.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Explore</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/blog" className="hover:text-primary transition-colors duration-300">Latest Drops</Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-primary transition-colors duration-300">Categories</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors duration-300">About Us</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-foreground">Legal</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors duration-300">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors duration-300">Terms of Service</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors duration-300">Contact Us</Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* 18+ Responsible Gambling Notice */}
        <div className="pt-8 pb-4 border-t border-border/50">
          <div className="p-4 rounded-2xl border border-red-500/20 bg-red-500/5 flex flex-col sm:flex-row items-center gap-3 text-xs text-slate-300">
            <span className="shrink-0 px-2.5 py-1 rounded-lg bg-red-500/20 text-red-400 font-extrabold border border-red-500/30 text-xs">
              18+ ONLY
            </span>
            <p className="text-center sm:text-left leading-relaxed">
              18+ | This website contains gambling-related content, casino games analysis, and betting strategies. Please gamble responsibly.
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {currentYear} betsetgo.xyz. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Powered by Next.js & betsetgo</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
