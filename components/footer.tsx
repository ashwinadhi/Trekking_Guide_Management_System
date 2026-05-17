import Link from "next/link"
import { Mountain, Facebook, Instagram, Twitter, Mail, Phone, MapPin, Car } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Mountain className="h-8 w-8 text-green-400" />
              <span className="text-xl font-bold">Technie Trek</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Your trusted partner for unforgettable trekking adventures in Nepal. Experience the beauty of the
              Himalayas with our expert guides and comprehensive services.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/technietrek" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-green-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/technietrek" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-green-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/technietrek" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-green-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/treks" className="text-gray-300 hover:text-green-400 transition-colors">
                  Trek Packages
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="text-gray-300 hover:text-green-400 transition-colors">
                  Destinations
                </Link>
              </li>
              <li>
                <Link href="/guides" className="text-gray-300 hover:text-green-400 transition-colors">
                  Our Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/car-booking"
                  className="text-gray-300 hover:text-green-400 transition-colors flex items-center gap-1"
                >
                  <Car className="h-4 w-4" />
                  Car Booking
                </Link>
              </li>
              <li>
                <Link href="/equipment" className="text-gray-300 hover:text-green-400 transition-colors">
                  Equipment Rental
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-gray-300 hover:text-green-400 transition-colors">
                  Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-green-400" />
                <a href="tel:+9779841234567" className="text-gray-300 hover:text-green-400 transition-colors">
                  +977-9841234567
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-green-400" />
                <a href="mailto:info@technietrek.com" className="text-gray-300 hover:text-green-400 transition-colors">
                  info@technietrek.com
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-green-400 mt-1" />
                <a 
                  href="https://maps.google.com/?q=Thamel,Kathmandu,Nepal" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-300 hover:text-green-400 transition-colors"
                >
                  Thamel, Kathmandu, Nepal
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © {new Date().getFullYear()} Technie Trek. All rights reserved. | Designed for adventure enthusiasts.
          </p>
        </div>
      </div>
    </footer>
  )
}
