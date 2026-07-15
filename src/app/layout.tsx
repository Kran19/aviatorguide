import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
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
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} antialiased`}>
      <body className="min-h-screen flex flex-col bg-background font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
