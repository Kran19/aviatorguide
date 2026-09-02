import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { StatCounter } from "@/components/analytics/StatCounter";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://betsetgo.xyz"),
  title: "betsetgo.xyz - Premium Gaming Blog",
  description: "A premium gaming blog covering eSports, RPGs, and the latest in the gaming world.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "betsetgo.xyz - Premium Gaming Blog",
    description: "A premium gaming blog covering eSports, RPGs, and the latest in the gaming world.",
    url: "/",
    siteName: "betsetgo.xyz",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "betsetgo.xyz - Premium Gaming Blog",
    description: "A premium gaming blog covering eSports, RPGs, and the latest in the gaming world.",
  },
  verification: {
    google: "GwBrIU3Un37BTLPfnQINBwTKAjWjO4zTcVVAqkvt3Dw",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${outfit.variable} antialiased`} style={{ colorScheme: "dark" }}>
      <body className={`${outfit.className} min-h-screen flex flex-col bg-background text-foreground font-sans`}>
        <GoogleAnalytics />
        <StatCounter />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
