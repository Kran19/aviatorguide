import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { StatCounter } from "@/components/analytics/StatCounter";

const outfit = localFont({
  src: "./fonts/Outfit-VariableFont_wght.ttf",
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://aviatorgameguide.com"),
  title: {
    default: "I Sports Game Guide - Premier Esports & Crash Game Guides",
    template: "%s | I Sports Game Guide",
  },
  description: "Your premier destination for i-sports guides, crash game mechanics, sports analytics, and competitive gameplay intelligence.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "I Sports Game Guide - Premier Esports & Crash Game Guides",
    description: "Your premier destination for i-sports guides, crash game mechanics, sports analytics, and competitive gameplay intelligence.",
    url: "/",
    siteName: "I Sports Game Guide",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/icon.png",
        width: 512,
        height: 512,
        alt: "I Sports Game Guide logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "I Sports Game Guide - Premier Esports & Crash Game Guides",
    description: "Your premier destination for i-sports guides, crash game mechanics, sports analytics, and competitive gameplay intelligence.",
    images: ["/icon.png"],
  },
  verification: {
    google: "GwBrIU3Un37BTLPfnQINBwTKAjWjO4zTcVVAqkvt3Dw",
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/android-chrome-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/android-chrome-512x512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: ["/icon.png", "/favicon.ico"],
    apple: [
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
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
