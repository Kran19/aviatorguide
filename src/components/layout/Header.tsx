"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, Compass, BookOpen, Layers, Info, Mail } from "lucide-react";

export function Header() {
  const pathname = usePathname() || "";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/blog", label: "Blog", icon: BookOpen },
    { href: "/categories", label: "Categories", icon: Layers },
    { href: "/about", label: "About", icon: Info },
    { href: "/contact", label: "Contact", icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 transition-colors">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden border border-emerald-500/30 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Image
                src="/logo.png"
                alt="I Sports Game Guide Logo"
                fill
                sizes="44px"
                priority
                className="object-cover"
              />
            </div>
            <span className="font-black text-lg sm:text-xl tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent group-hover:text-primary transition-colors">
              I Sports Game Guide
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors hover:text-primary ${
                    isActive ? "text-primary font-bold" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Button 
            asChild
            size="sm"
            className="sm:h-10 px-4 sm:px-5 font-bold bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-slate-950 border-0 shadow-md shadow-emerald-500/20 hover:scale-105 hover:shadow-emerald-500/40 transition-all duration-300"
          >
            <a href="https://rocky11.club/?refercode=SEO" target="_blank" rel="noopener noreferrer">
              Join Now
            </a>
          </Button>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-border/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border/50 bg-background/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-1 gap-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                pathname === "/" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Home</span>
            </Link>

            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-border/40">
            <Button
              asChild
              className="w-full rounded-xl font-bold bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-slate-950"
            >
              <a href="https://rocky11.club/?refercode=SEO" target="_blank" rel="noopener noreferrer">
                Play on Gaming Portal
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
