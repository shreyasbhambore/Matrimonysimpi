import { Inter, Playfair_Display } from "next/font/google"
import type { Metadata, Viewport } from "next"

import "./globals.css"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" })

// Namdevsimpi Matrimony - Premium Community Matrimonial Platform
export const metadata: Metadata = {
  title: {
    default: "Namdevsimpi Matrimony - Find Your Perfect Life Partner",
    template: "%s | Namdevsimpi Matrimony",
  },
  description: "Namdevsimpi Matrimony - Trusted premium community matrimony platform for meaningful connections. Find your perfect life partner with verified profiles and secure matching.",
  keywords: ["namdevsimpi", "matrimony", "marriage", "matchmaking", "Indian matrimony", "community matrimony", "namdevsimpi matrimony"],
  openGraph: {
    title: "Namdevsimpi Matrimony - Find Your Perfect Life Partner",
    description: "Namdevsimpi Matrimony - Trusted community matrimony platform for meaningful connections.",
    type: "website",
    locale: "en_IN",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: "#1a5c3a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn("antialiased bg-background", inter.variable, playfair.variable)}
    >
      <body className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  )
}
