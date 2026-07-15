import React from 'react';
import { Target, TrendingUp, ShieldCheck, Gamepad2 } from 'lucide-react';

export const metadata = {
  title: 'About - betsetgo.xyz',
  description: 'Learn more about betsetgo.xyz and our mission for ethical, strategic gaming.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
          More Than Just A Game
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance">
          We believe that modern gaming and betting, when approached with strategy and discipline, is a test of intellect, risk-management, and skill.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
        <div className="space-y-6 animate-in fade-in slide-in-from-left-8 duration-1000">
          <h2 className="text-3xl font-bold">The Strategy of the Win</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            At betsetgo.xyz, we view online gaming not merely as chance, but as a complex landscape of probability, psychology, and tactical execution. Professional gamers and successful bettors share a common trait: they don't rely on luck. They rely on data, emotional control, and relentless preparation.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Winning is the byproduct of making mathematically sound decisions over a long period. We are here to provide you with the deep dives, the meta-analysis, and the strategic frameworks you need to elevate your game from amateur to professional.
          </p>
        </div>
        <div className="bg-card rounded-3xl p-8 border border-border/50 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-right-8 duration-1000">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="relative z-10 space-y-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">Precision</h3>
                <p className="text-muted-foreground">Every move calculated. Every bet analyzed.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">Growth</h3>
                <p className="text-muted-foreground">Consistent, sustainable account building.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                <Gamepad2 className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1">Mastery</h3>
                <p className="text-muted-foreground">Understanding the meta before it happens.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted/30 rounded-3xl p-8 md:p-12 border border-border text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center mx-auto mb-6 shadow-sm">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl font-bold">Ethical & Responsible Gaming</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
          We champion ethical gaming. This means playing within your limits, understanding the house edge, and recognizing when to walk away. The benefits of gaming—enhanced cognitive function, community building, and financial reward—are only accessible to those who play responsibly. Treat your bankroll like an investment portfolio, not a lottery ticket.
        </p>
      </div>
    </div>
  );
}
