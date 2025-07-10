import type React from "react"
import type { Metadata } from "next/metadata"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@/components/analytics"
import { Suspense } from "react"
import { LiveChat } from "@/components/live-chat"
import { ScrollToTop } from "@/components/scroll-to-top"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tech Review Hub - Your Ultimate Tech Review Destination",
  description:
    "Discover the best tech products with our in-depth reviews, comparisons, and buying guides. Find smartphones, laptops, gadgets and more.",
  keywords: "tech reviews, product reviews, smartphones, laptops, gadgets, buying guides",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <Suspense fallback={null}>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <Toaster />
            <Analytics />
            <LiveChat />
            <ScrollToTop />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  )
}
