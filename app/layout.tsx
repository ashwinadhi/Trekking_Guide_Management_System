import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/contexts/cart-context"
import { CartSidebar } from "@/components/cart-sidebar"
import { CartIcon } from "@/components/cart-icon"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Technie Trek Ashwin - Nepal Trekking Guide & Adventure Services",
  description:
    "Professional trekking guide services in Nepal. Explore Everest, Annapurna, and other Himalayan peaks with experienced local guides.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          {children}
          <CartIcon />
          <CartSidebar />
          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
}
