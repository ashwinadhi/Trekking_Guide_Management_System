"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { BrandMark } from "@/components/luxury/brand-mark"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const navLink = "px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] text-ivory/80 transition-colors hover:text-gold"

  return (
    <nav
      className={cn(
        "fixed top-0 z-40 w-full transition-all duration-500",
        scrolled || isMenuOpen ? "border-b border-gold/20 bg-ink/90 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="min-w-0">
            <BrandMark imgClassName="h-11" />
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            <Link href="/" className={navLink}>
              Home
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn(navLink, "h-auto hover:bg-transparent")}>
                  Journeys
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52 border-gold/20 bg-card">
                <DropdownMenuItem asChild>
                  <Link href="/guides" className="w-full cursor-pointer">
                    Private Guides
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/treks" className="w-full cursor-pointer">
                    Expeditions
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/destinations" className="w-full cursor-pointer">
                    Destinations
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/hotels" className="w-full cursor-pointer">
                    Mountain Lodges
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/equipment" className="w-full cursor-pointer">
                    Equipment
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/car-booking" className="w-full cursor-pointer">
                    Chauffeur
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/helicopter-booking" className="w-full cursor-pointer">
                    Helicopter
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/about" className={navLink}>
              About
            </Link>
            <Link href="/contact" className={navLink}>
              Contact
            </Link>
            <Link href="/booking" className="ml-3">
              <Button className="border border-gold bg-transparent px-6 text-xs uppercase tracking-[0.2em] text-gold hover:bg-gold hover:text-ink">
                Reserve
              </Button>
            </Link>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="sm" className="text-ivory" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-gold/15 bg-ink md:hidden">
          <div className="space-y-1 px-4 py-4">
            <Link href="/" className="block px-3 py-2 text-ivory" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <button
              onClick={() => setIsServicesOpen(!isServicesOpen)}
              className="flex w-full items-center gap-1 px-3 py-2 text-left text-ivory"
            >
              Journeys
              <ChevronDown className={`h-4 w-4 transition-transform ${isServicesOpen ? "rotate-180" : ""}`} />
            </button>
            {isServicesOpen && (
              <div className="ml-4 space-y-1 text-stone">
                <Link href="/guides" className="block px-3 py-2" onClick={() => setIsMenuOpen(false)}>
                  Private Guides
                </Link>
                <Link href="/treks" className="block px-3 py-2" onClick={() => setIsMenuOpen(false)}>
                  Expeditions
                </Link>
                <Link href="/destinations" className="block px-3 py-2" onClick={() => setIsMenuOpen(false)}>
                  Destinations
                </Link>
                <Link href="/hotels" className="block px-3 py-2" onClick={() => setIsMenuOpen(false)}>
                  Mountain Lodges
                </Link>
                <Link href="/equipment" className="block px-3 py-2" onClick={() => setIsMenuOpen(false)}>
                  Equipment
                </Link>
                <Link href="/car-booking" className="block px-3 py-2" onClick={() => setIsMenuOpen(false)}>
                  Chauffeur
                </Link>
                <Link href="/helicopter-booking" className="block px-3 py-2" onClick={() => setIsMenuOpen(false)}>
                  Helicopter
                </Link>
              </div>
            )}
            <Link href="/about" className="block px-3 py-2 text-ivory" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <Link href="/contact" className="block px-3 py-2 text-ivory" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
            <div className="px-3 py-2">
              <Link href="/booking" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full border border-gold bg-gold text-ink">Reserve</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
