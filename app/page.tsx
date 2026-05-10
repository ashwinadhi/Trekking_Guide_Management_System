"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Mountain, Users, Shield, Award, Star, Calendar, Car, Backpack, Clock, DollarSign, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"

interface Trek {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  image: string;
}

export default function HomePage() {
  const [featuredTreks, setFeaturedTreks] = useState<Trek[]>([])
  const [treksLoading, setTreksLoading] = useState(true)

  useEffect(() => {
    async function fetchTreks() {
      try {
        const res = await fetch("/api/treks")
        if (res.ok) {
          const data = await res.json()
          // Show up to 3 treks as featured
          setFeaturedTreks(data.slice(0, 3))
        }
      } catch (err) {
        console.error("Failed to fetch treks", err)
      } finally {
        setTreksLoading(false)
      }
    }
    fetchTreks()
  }, [])

  const stats = [
    { icon: Mountain, label: "Treks Completed", value: "500+" },
    { icon: Users, label: "Happy Trekkers", value: "2,000+" },
    { icon: Shield, label: "Years Experience", value: "15+" },
    { icon: Award, label: "Success Rate", value: "99%" },
  ]

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <Image src="/images/mountain-sunrise.jpg" alt="Nepal Mountains" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Discover Nepal's
            <span className="text-green-400 block">Majestic Peaks</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Embark on life-changing adventures through the world's highest mountains with expert local guides
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/treks">
              <Button size="lg" className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 text-lg">
                <Mountain className="mr-2 h-5 w-5" />
                Explore Treks
              </Button>
            </Link>
            <Link href="/car-booking">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg bg-transparent"
              >
                <Car className="mr-2 h-5 w-5" />
                Book Transportation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-green-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <stat.icon className="h-12 w-12 mx-auto mb-4 text-green-200" />
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-green-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Treks — Dynamic from MongoDB */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Featured Trek Packages</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our carefully curated selection of Nepal's most spectacular trekking routes
            </p>
          </div>

          {treksLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          ) : featuredTreks.length === 0 ? (
            <div className="text-center py-12">
              <Mountain className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Trek packages coming soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredTreks.map((trek) => (
                <Card key={trek._id} className="overflow-hidden hover:shadow-xl transition-all duration-500 group rounded-2xl border-0 shadow-md">
                  <div className="relative h-64 overflow-hidden">
                    {trek.image ? (
                      <img
                        src={trek.image}
                        alt={trek.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                        <Mountain className="h-16 w-16 text-emerald-300" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
                      <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                      {trek.price.toLocaleString()}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2 text-sm text-gray-500">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{trek.duration}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-700 transition-colors">{trek.title}</h3>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{trek.description}</p>
                    <Link href={`/treks/${trek._id}`}>
                      <Button className="w-full bg-green-700 hover:bg-green-800 rounded-xl">
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/treks">
              <Button
                size="lg"
                variant="outline"
                className="border-green-700 text-green-700 hover:bg-green-700 hover:text-white bg-transparent"
              >
                View All Trek Packages
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Complete Adventure Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need for your Nepal adventure, from transportation to equipment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Car className="h-8 w-8 text-green-700" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Car Booking Service</h3>
              <p className="text-gray-600 mb-6">
                Reliable transportation with professional drivers for airport transfers, city tours, and trek starting
                points.
              </p>
              <Link href="/car-booking">
                <Button className="bg-green-700 hover:bg-green-800">
                  Book Vehicle
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mountain className="h-8 w-8 text-blue-700" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Expert Guides</h3>
              <p className="text-gray-600 mb-6">
                Experienced local guides with deep knowledge of trails, culture, and safety protocols.
              </p>
              <Link href="/guides">
                <Button
                  variant="outline"
                  className="border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white bg-transparent"
                >
                  Meet Our Guides
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>

            <Card className="text-center p-8 hover:shadow-lg transition-shadow">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Backpack className="h-8 w-8 text-orange-700" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Equipment Rental</h3>
              <p className="text-gray-600 mb-6">
                High-quality trekking gear and equipment rental to ensure your comfort and safety.
              </p>
              <Link href="/equipment">
                <Button
                  variant="outline"
                  className="border-orange-700 text-orange-700 hover:bg-orange-700 hover:text-white bg-transparent"
                >
                  Rent Equipment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready for Your Adventure?</h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of satisfied trekkers who have experienced the magic of Nepal with us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking">
              <Button size="lg" className="bg-white text-green-700 hover:bg-gray-100 px-8 py-3 text-lg">
                <Calendar className="mr-2 h-5 w-5" />
                Book Your Trek
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-700 px-8 py-3 text-lg bg-transparent"
              >
                Get In Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
