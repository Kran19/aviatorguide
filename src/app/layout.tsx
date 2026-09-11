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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/android-chrome-192x192.png", type: "image/png", sizes: "192x192" },
      { url: "/android-chrome-512x512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: [
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
