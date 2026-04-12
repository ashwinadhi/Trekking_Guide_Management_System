import Link from "next/link"
import Image from "next/image"
import { Star, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function DestinationsPage() {
  const destinations = [
    {
      id: "kathmandu",
      name: "Kathmandu Valley",
      description: "UNESCO World Heritage sites, ancient temples, and vibrant culture",
      image: "/images/sherpa-village.jpg",
      guides: 8,
      averageRating: 4.7,
      highlights: ["Durbar Squares", "Swayambhunath Temple", "Boudhanath Stupa", "Local Markets"],
      priceRange: "$25-45",
      duration: "Half day to 3 days",
    },
    {
      id: "pokhara",
      name: "Pokhara",
      description: "Adventure capital with lakes, mountains, and paragliding",
      image: "/images/mountain-sunrise.jpg",
      guides: 12,
      averageRating: 4.8,
      highlights: ["Phewa Lake", "Paragliding", "Sarangkot Sunrise", "Adventure Sports"],
      priceRange: "$30-50",
      duration: "1-5 days",
    },
    {
      id: "chitwan",
      name: "Chitwan National Park",
      description: "Wildlife safari, jungle walks, and elephant encounters",
      image: "/images/prayer-flags.jpg",
      guides: 6,
      averageRating: 4.6,
      highlights: ["Jungle Safari", "Elephant Rides", "Bird Watching", "Tharu Culture"],
      priceRange: "$35-55",
      duration: "2-4 days",
    },
    {
      id: "lumbini",
      name: "Lumbini",
      description: "Buddha's birthplace with monasteries and peaceful gardens",
      image: "/images/everest-base-camp.jpg",
      guides: 4,
      averageRating: 4.9,
      highlights: ["Maya Devi Temple", "Monasteries", "Ashoka Pillar", "Meditation"],
      priceRange: "$25-40",
      duration: "1-2 days",
    },
    {
      id: "everest-region",
      name: "Everest Region",
      description: "High-altitude trekking and Sherpa culture",
      image: "/images/everest-base-camp.jpg",
      guides: 15,
      averageRating: 4.9,
      highlights: ["Everest Base Camp", "Sherpa Villages", "Monasteries", "Mountain Views"],
      priceRange: "$40-60",
      duration: "10-21 days",
    },
    {
      id: "annapurna-region",
      name: "Annapurna Region",
      description: "Diverse landscapes from subtropical to alpine",
      image: "/images/annapurna-circuit.jpg",
      guides: 10,
      averageRating: 4.8,
      highlights: ["Thorong La Pass", "Hot Springs", "Traditional Villages", "Diverse Terrain"],
      priceRange: "$35-55",
      duration: "7-18 days",
    },
  ]

  return (
    <div className="min-h-screen">
      <Header />

      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Explore Nepal's Destinations</h1>
          <p className="text-xl text-gray-600">
            From ancient temples to towering peaks, discover Nepal's incredible diversity with expert local guides
          </p>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination) => (
              <Card key={destination.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-gray-800">{destination.duration}</Badge>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{destination.averageRating}</span>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{destination.name}</h3>
                  <p className="text-gray-600 mb-4">{destination.description}</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Available Guides:</span>
                      <span className="font-medium">{destination.guides} guides</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Price Range:</span>
                      <span className="font-medium">{destination.priceRange}/day</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2">Popular Activities:</h4>
                    <div className="flex flex-wrap gap-1">
                      {destination.highlights.slice(0, 3).map((highlight, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Link href={`/guides?destination=${destination.id}`}>
                    <Button className="w-full bg-green-700 hover:bg-green-800">
                      Find Guides
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Planning Help */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Need Help Planning Your Trip?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Our travel experts can help you create the perfect itinerary combining multiple destinations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-green-700 hover:bg-green-800">
                Get Custom Itinerary
              </Button>
            </Link>
            <Link href="/guides">
              <Button size="lg" variant="outline">
                Browse All Guides
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
