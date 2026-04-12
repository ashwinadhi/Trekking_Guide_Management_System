import Link from "next/link"
import Image from "next/image"
import { Star, MapPin, MessageCircle, Languages, Calendar, Filter, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function GuidesPage() {
  const guides = [
    {
      id: "ashwin-trek-guide",
      name: "Ashwin Shrestha",
      location: "Kathmandu & Trekking Regions",
      specialties: ["High Altitude Trekking", "Everest Region", "Annapurna Circuit"],
      languages: ["English", "Hindi", "Nepali"],
      rating: 4.9,
      reviewCount: 127,
      pricePerDay: 45,
      experience: "15+ years",
      image: "/images/mountain-sunrise.jpg",
      verified: true,
      responseTime: "Within 2 hours",
      description: "Licensed trekking guide specializing in high-altitude adventures and cultural experiences.",
    },
    {
      id: "maya-pokhara-guide",
      name: "Maya Gurung",
      location: "Pokhara",
      specialties: ["Lake Tours", "Paragliding", "Temple Visits", "Hiking"],
      languages: ["English", "German", "Nepali"],
      rating: 4.8,
      reviewCount: 89,
      pricePerDay: 35,
      experience: "8+ years",
      image: "/images/prayer-flags.jpg",
      verified: true,
      responseTime: "Within 4 hours",
      description: "Pokhara specialist offering adventure activities and cultural tours around the lake city.",
    },
    {
      id: "ram-chitwan-guide",
      name: "Ram Thapa",
      location: "Chitwan National Park",
      specialties: ["Wildlife Safari", "Jungle Walks", "Elephant Rides", "Bird Watching"],
      languages: ["English", "Hindi", "Nepali"],
      rating: 4.7,
      reviewCount: 64,
      pricePerDay: 40,
      experience: "12+ years",
      image: "/images/sherpa-village.jpg",
      verified: true,
      responseTime: "Within 6 hours",
      description: "Wildlife expert with deep knowledge of Chitwan's flora and fauna.",
    },
    {
      id: "sita-lumbini-guide",
      name: "Sita Rai",
      location: "Lumbini",
      specialties: ["Buddhist Heritage", "Monastery Tours", "Meditation Sessions", "Cultural History"],
      languages: ["English", "Japanese", "Nepali"],
      rating: 4.9,
      reviewCount: 43,
      pricePerDay: 30,
      experience: "10+ years",
      image: "/images/everest-base-camp.jpg",
      verified: true,
      responseTime: "Within 3 hours",
      description: "Buddhist heritage specialist offering spiritual and cultural tours in Buddha's birthplace.",
    },
    {
      id: "kumar-kathmandu-guide",
      name: "Kumar Maharjan",
      location: "Kathmandu Valley",
      specialties: ["Heritage Sites", "Temple Tours", "City Walking", "Food Tours"],
      languages: ["English", "French", "Nepali", "Newari"],
      rating: 4.6,
      reviewCount: 78,
      pricePerDay: 38,
      experience: "6+ years",
      image: "/images/annapurna-circuit.jpg",
      verified: true,
      responseTime: "Within 1 hour",
      description: "Kathmandu Valley expert specializing in UNESCO World Heritage sites and local culture.",
    },
    {
      id: "pemba-everest-guide",
      name: "Pemba Sherpa",
      location: "Everest Region",
      specialties: ["Everest Base Camp", "Island Peak", "Sherpa Culture", "High Altitude"],
      languages: ["English", "Tibetan", "Nepali"],
      rating: 4.9,
      reviewCount: 156,
      pricePerDay: 50,
      experience: "18+ years",
      image: "/images/langtang-valley.jpg",
      verified: true,
      responseTime: "Within 3 hours",
      description: "Experienced Sherpa guide with multiple Everest summits and cultural expertise.",
    },
  ]

  const destinations = [
    "All Destinations",
    "Kathmandu Valley",
    "Pokhara",
    "Chitwan National Park",
    "Lumbini",
    "Everest Region",
    "Annapurna Region",
    "Langtang Region",
  ]

  return (
    <div className="min-h-screen">
      <Header />

      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Find Your Perfect Local Guide</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with verified, experienced local guides across Nepal. From trekking adventures to cultural tours,
              find the perfect guide for your journey.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center gap-2 flex-1">
                <MapPin className="h-5 w-5 text-gray-400" />
                <Input placeholder="Search by location or specialty..." className="border-0 focus:ring-0" />
              </div>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Destination" />
                  </SelectTrigger>
                  <SelectContent>
                    {destinations.map((dest) => (
                      <SelectItem key={dest} value={dest.toLowerCase().replace(/\s+/g, "-")}>
                        {dest}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">$20-40</SelectItem>
                    <SelectItem value="medium">$40-60</SelectItem>
                    <SelectItem value="high">$60+</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-green-700 hover:bg-green-800">
                  <Filter className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Available Guides</h2>
              <p className="text-gray-600">{guides.length} verified guides found</p>
            </div>
            <Select>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="experience">Most Experienced</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {guides.map((guide) => (
              <Card key={guide.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <Image
                    src={guide.image || "/placeholder.svg"}
                    alt={guide.name}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  {guide.verified && <Badge className="absolute top-3 left-3 bg-green-600 text-white">Verified</Badge>}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{guide.rating}</span>
                    <span className="text-xs text-gray-500">({guide.reviewCount})</span>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{guide.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{guide.location}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-700">${guide.pricePerDay}</div>
                      <div className="text-xs text-gray-500">per day</div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{guide.description}</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{guide.experience} experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Languages className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{guide.languages.join(", ")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Responds {guide.responseTime}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {guide.specialties.slice(0, 3).map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/guides/${guide.id}`} className="flex-1">
                      <Button variant="outline" className="w-full bg-transparent">
                        View Profile
                      </Button>
                    </Link>
                    <Link href={`/booking?guide=${guide.id}`} className="flex-1">
                      <Button className="w-full bg-green-700 hover:bg-green-800">Book Now</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-700" />
              </div>
              <h3 className="text-xl font-bold mb-2">Verified Guides</h3>
              <p className="text-gray-600">All guides are licensed and background-checked</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-green-700" />
              </div>
              <h3 className="text-xl font-bold mb-2">Rated & Reviewed</h3>
              <p className="text-gray-600">Real reviews from verified travelers</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-green-700" />
              </div>
              <h3 className="text-xl font-bold mb-2">Direct Contact</h3>
              <p className="text-gray-600">Chat directly with guides before booking</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-green-700" />
              </div>
              <h3 className="text-xl font-bold mb-2">Flexible Booking</h3>
              <p className="text-gray-600">Easy booking with flexible cancellation</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
