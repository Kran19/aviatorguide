"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function Header() {
  const pathname = usePathname() || "";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl tracking-tight">betsetgo.xyz</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/blog"
              className={`flex items-center text-sm font-medium transition-colors hover:text-foreground ${pathname.startsWith("/blog") ? "text-foreground font-bold" : "text-muted-foreground"}`}
            >
              Blog
            </Link>
            <Link
              href="/categories"
              className={`flex items-center text-sm font-medium transition-colors hover:text-foreground ${pathname.startsWith("/categories") ? "text-foreground font-bold" : "text-muted-foreground"}`}
            >
              Categories
            </Link>
            <Link
              href="/about"
              className={`flex items-center text-sm font-medium transition-colors hover:text-foreground ${pathname === "/about" ? "text-foreground font-bold" : "text-muted-foreground"}`}
            >
              About
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            asChild
            className="font-bold bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 text-white border-0 animate-shimmer hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
          >
            <a href="https://rocky11.club/?refercode=SEO" target="_blank" rel="noopener noreferrer">
              Join
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
