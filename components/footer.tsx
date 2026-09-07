import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"
import { BrandMark } from "@/components/luxury/brand-mark"

export default function Footer() {
  return (
    <footer className="border-t border-gold/20 bg-ink text-ivory">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <BrandMark imgClassName="h-14" />
            <div className="luxury-hairline ml-0" />
            <p className="mt-5 max-w-md text-stone">
              Licensed specialists in Kathmandu arranging private guides, mountain lodges, chauffeur transfers, and
              concierge arrival for international travellers.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="https://facebook.com/technietrek" target="_blank" rel="noopener noreferrer" className="text-stone hover:text-gold">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/technietrek" target="_blank" rel="noopener noreferrer" className="text-stone hover:text-gold">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/technietrek" target="_blank" rel="noopener noreferrer" className="text-stone hover:text-gold">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="luxury-label mb-4">Explore</h3>
            <ul className="space-y-3 text-stone">
              <li>
                <Link href="/treks" className="hover:text-gold">
                  Expeditions
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="hover:text-gold">
                  Destinations
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-gold">
                  Private Guides
                </Link>
              </li>
              <li>
                <Link href="/car-booking" className="hover:text-gold">
                  Chauffeur
                </Link>
              </li>
              <li>
                <Link href="/helicopter-booking" className="hover:text-gold">
                  Helicopter
                </Link>
              </li>
              <li>
                <Link href="/equipment" className="hover:text-gold">
                  Equipment
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-gold">
                  Guest notes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="luxury-label mb-4">Concierge</h3>
            <ul className="space-y-3 text-stone">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gold" />
                <a href="https://wa.me/9779841234567" className="hover:text-gold">
                  +977-9841234567
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gold" />
                <a href="mailto:ashwin@technietrek.com" className="hover:text-gold">
                  ashwin@technietrek.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-1 h-4 w-4 text-gold" />
                <a href="https://maps.google.com/?q=Thamel,Kathmandu,Nepal" target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                  Thamel, Kathmandu, Nepal
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gold/15 pt-8 text-center text-sm text-stone">
          © {new Date().getFullYear()} Nirvana Luxury Adventure. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
