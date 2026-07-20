import { WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata = {
  title: 'Offline - BetSetGo',
  description: 'You are currently offline.',
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
      <div className="max-w-md w-full glass-card p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center">
        <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mb-6">
          <WifiOff className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-4">You're Offline</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          It seems you've lost your internet connection. You can still browse pages you've previously visited, or check back here when your connection is restored.
        </p>
        <Button asChild className="w-full rounded-full" size="lg">
          <Link href="/">
            Go to Home Page
          </Link>
        </Button>
      </div>
    </div>
  );
}
