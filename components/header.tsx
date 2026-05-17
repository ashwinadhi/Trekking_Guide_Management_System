"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Mountain, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isServicesOpen, setIsServicesOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-green-700">
              <Mountain className="h-8 w-8" />
              Technie Trek
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-green-700 px-3 py-2 text-sm font-medium transition-colors"
              >
                Home
              </Link>

              {/* Our Services Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-green-700 px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1"
                  >
                    Our Services
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/guides" className="w-full cursor-pointer">
                      Find Guides
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/treks" className="w-full cursor-pointer">
                      Treks
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/destinations" className="w-full cursor-pointer">
                      Destinations
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/hotels" className="w-full cursor-pointer">
                      Hotels
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/equipment" className="w-full cursor-pointer">
                      Equipment
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/car-booking" className="w-full cursor-pointer">
                      Car Rental
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/guide-booking" className="w-full cursor-pointer">
                      Book Guide
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link
                href="/about"
                className="text-gray-700 hover:text-green-700 px-3 py-2 text-sm font-medium transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-green-700 px-3 py-2 text-sm font-medium transition-colors"
              >
                Contact
              </Link>
              <Link href="/booking">
                <Button className="bg-green-700 hover:bg-green-800 text-white">Book Now</Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link
              href="/"
              className="text-gray-700 hover:text-green-700 block px-3 py-2 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>

            {/* Mobile Services Section */}
            <div className="px-3 py-2">
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="text-gray-700 hover:text-green-700 text-base font-medium flex items-center gap-1 w-full text-left"
              >
                Our Services
                <ChevronDown className={`h-4 w-4 transition-transform ${isServicesOpen ? "rotate-180" : ""}`} />
              </button>
              {isServicesOpen && (
                <div className="mt-2 ml-4 space-y-1">
                  <Link
                    href="/guides"
                    className="text-gray-600 hover:text-green-700 block px-3 py-2 text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Find Guides
                  </Link>
                  <Link
                    href="/treks"
                    className="text-gray-600 hover:text-green-700 block px-3 py-2 text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Treks
                  </Link>
                  <Link
                    href="/destinations"
                    className="text-gray-600 hover:text-green-700 block px-3 py-2 text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Destinations
                  </Link>
                  <Link
                    href="/hotels"
                    className="text-gray-600 hover:text-green-700 block px-3 py-2 text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Hotels
                  </Link>
                  <Link
                    href="/equipment"
                    className="text-gray-600 hover:text-green-700 block px-3 py-2 text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Equipment
                  </Link>
                  <Link
                    href="/car-booking"
                    className="text-gray-600 hover:text-green-700 block px-3 py-2 text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Car Rental
                  </Link>
                  <Link
                    href="/guide-booking"
                    className="text-gray-600 hover:text-green-700 block px-3 py-2 text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Book Guide
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className="text-gray-700 hover:text-green-700 block px-3 py-2 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-green-700 block px-3 py-2 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="px-3 py-2">
              <Link href="/booking" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-green-700 hover:bg-green-800 text-white">Book Now</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
