import type React from "react"
import type { Metadata } from "next"
import { Cormorant_Garamond, Outfit } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/contexts/cart-context"
import { CartSidebar } from "@/components/cart-sidebar"
import { CartIcon } from "@/components/cart-icon"
import { Providers } from "@/components/Providers"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
})

export const metadata: Metadata = {
  title: "Nirvana Luxury Adventure — Private Himalayan Expeditions",
  description:
    "Bespoke trekking, private licensed guides, mountain lodges, helicopter charter, and concierge arrival in Kathmandu. Luxury Himalayan journeys for international travellers.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${cormorant.variable} font-sans`}>
        <Providers>
          <CartProvider>
            {children}
            <CartIcon />
            <CartSidebar />
            <Toaster />
          </CartProvider>
        </Providers>
      </body>
    </html>
  )
}
