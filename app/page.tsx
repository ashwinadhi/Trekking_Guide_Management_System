"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Mountain, Users, Shield, Award, Star, Calendar, Car, Backpack } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function HomePage() {
  const featuredTreks = [
    {
      id: "everest-base-camp",
      name: "Everest Base Camp Trek",
      duration: "14 days",
      difficulty: "Challenging",
      price: "$1,299",
      image: "/images/everest-base-camp.jpg",
      rating: 4.9,
    },
    {
      id: "annapurna-circuit",
      name: "Annapurna Circuit Trek",
      duration: "16 days",
      difficulty: "Moderate",
      price: "$899",
      image: "/images/annapurna-circuit.jpg",
      rating: 4.8,
    },
    {
      id: "langtang-valley",
      name: "Langtang Valley Trek",
      duration: "7 days",
      difficulty: "Easy",
      price: "$599",
      image: "/images/langtang-valley.jpg",
      rating: 4.7,
    },
  ]

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

      {/* Featured Treks */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Featured Trek Packages</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our carefully curated selection of Nepal's most spectacular trekking routes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTreks.map((trek) => (
              <Card key={trek.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-64">
                  <Image src={trek.image || "/placeholder.svg"} alt={trek.name} fill className="object-cover" />
                  <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-semibold">
                    {trek.price}
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{trek.rating}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600">{trek.difficulty}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{trek.name}</h3>
                  <p className="text-gray-600 mb-4">{trek.duration}</p>
                  <Link href={`/treks/${trek.id}`}>
                    <Button className="w-full bg-green-700 hover:bg-green-800">
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

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
