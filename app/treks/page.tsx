import Link from "next/link"
import Image from "next/image"
import { MapPin, Clock, Users, Star, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function TreksPage() {
  const treks = [
    {
      id: "everest-base-camp",
      name: "Everest Base Camp Trek",
      region: "Khumbu Region",
      duration: "14 days",
      difficulty: "Challenging",
      difficultyColor: "bg-red-500",
      price: 1850,
      rating: 4.9,
      reviews: 127,
      image: "/images/everest-base-camp.jpg",
      description:
        "The ultimate Himalayan adventure to the base of the world's highest peak. Experience Sherpa culture, stunning mountain views, and the achievement of a lifetime.",
      highlights: [
        "Everest Base Camp (5,364m)",
        "Kala Patthar viewpoint",
        "Sherpa villages",
        "Sagarmatha National Park",
      ],
    },
    {
      id: "annapurna-circuit",
      name: "Annapurna Circuit Trek",
      region: "Annapurna Region",
      duration: "12 days",
      difficulty: "Moderate",
      difficultyColor: "bg-orange-500",
      price: 1450,
      rating: 4.8,
      reviews: 89,
      image: "/images/annapurna-circuit.jpg",
      description:
        "Classic circuit trek with diverse landscapes from subtropical forests to high alpine terrain. Cross the famous Thorong La Pass at 5,416m.",
      highlights: ["Thorong La Pass (5,416m)", "Muktinath Temple", "Diverse landscapes", "Traditional villages"],
    },
    {
      id: "langtang-valley",
      name: "Langtang Valley Trek",
      region: "Langtang Region",
      duration: "8 days",
      difficulty: "Easy-Moderate",
      difficultyColor: "bg-green-500",
      price: 950,
      rating: 4.7,
      reviews: 64,
      image: "/images/langtang-valley.jpg",
      description:
        "Beautiful valley trek through traditional Tamang villages with stunning mountain scenery. Perfect for those with limited time.",
      highlights: ["Kyanjin Gompa", "Tamang culture", "Langtang Lirung views", "Cheese factory visit"],
    },
    {
      id: "manaslu-circuit",
      name: "Manaslu Circuit Trek",
      region: "Manaslu Region",
      duration: "16 days",
      difficulty: "Challenging",
      difficultyColor: "bg-red-500",
      price: 2100,
      rating: 4.9,
      reviews: 43,
      image: "/images/manaslu-circuit.jpg",
      description:
        "Off-the-beaten-path adventure around the eighth highest mountain in the world. Remote and pristine mountain experience.",
      highlights: ["Larkya La Pass (5,106m)", "Mount Manaslu views", "Remote villages", "Restricted area permit"],
    },
    {
      id: "gokyo-lakes",
      name: "Gokyo Lakes Trek",
      region: "Khumbu Region",
      duration: "12 days",
      difficulty: "Moderate-Challenging",
      difficultyColor: "bg-orange-500",
      price: 1650,
      rating: 4.8,
      reviews: 71,
      image: "/images/gokyo-lakes.jpg",
      description:
        "Alternative route to Everest region featuring pristine glacial lakes and panoramic mountain views from Gokyo Ri.",
      highlights: ["Gokyo Lakes", "Gokyo Ri summit (5,357m)", "Ngozumpa Glacier", "Cho Oyu views"],
    },
    {
      id: "upper-mustang",
      name: "Upper Mustang Trek",
      region: "Mustang Region",
      duration: "10 days",
      difficulty: "Moderate",
      difficultyColor: "bg-orange-500",
      price: 1750,
      rating: 4.6,
      reviews: 38,
      image: "/images/upper-mustang.jpg",
      description:
        "Journey to the forbidden kingdom of Lo Manthang. Experience Tibetan culture and dramatic desert landscapes.",
      highlights: ["Lo Manthang Palace", "Tibetan culture", "Desert landscapes", "Ancient monasteries"],
    },
  ]

  return (
    <div className="min-h-screen">
      <Header />

      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Trek Packages</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover Nepal's most spectacular trekking routes with expert guidance. Each package includes
              accommodation, meals, permits, and professional guiding services.
            </p>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Filter by:</span>
              </div>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Difficulty Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="challenging">Challenging</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">1-7 days</SelectItem>
                  <SelectItem value="medium">8-14 days</SelectItem>
                  <SelectItem value="long">15+ days</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="everest">Everest Region</SelectItem>
                  <SelectItem value="annapurna">Annapurna Region</SelectItem>
                  <SelectItem value="langtang">Langtang Region</SelectItem>
                  <SelectItem value="manaslu">Manaslu Region</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Trek Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {treks.map((trek) => (
              <Card key={trek.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-64">
                  <Image src={trek.image || "/placeholder.svg"} alt={trek.name} fill className="object-cover" />
                  <Badge className={`absolute top-4 left-4 ${trek.difficultyColor} text-white`}>
                    {trek.difficulty}
                  </Badge>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{trek.rating}</span>
                    <span className="text-xs text-gray-500">({trek.reviews})</span>
                  </div>
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{trek.name}</h3>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{trek.region}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{trek.duration}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{trek.description}</p>

                  <div className="mb-4">
                    <h4 className="font-semibold text-sm mb-2">Highlights:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {trek.highlights.slice(0, 3).map((highlight, index) => (
                        <li key={index} className="flex items-center gap-1">
                          <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-bold text-green-700">${trek.price}</span>
                      <span className="text-sm text-gray-500 ml-1">per person</span>
                    </div>
                    <Link href={`/treks/${trek.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Trek CTA */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Don't See Your Perfect Trek?</h2>
          <p className="text-xl text-gray-600 mb-8">
            I can create a custom itinerary tailored to your interests, fitness level, and time constraints. Let's
            design your perfect Himalayan adventure together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-green-700 hover:bg-green-800">
                Request Custom Trek
              </Button>
            </Link>
            <Link href="/booking">
              <Button size="lg" variant="outline">
                Book Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What's Included in Every Trek Package</h2>
            <p className="text-xl text-gray-600">Comprehensive packages designed for your comfort and safety</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-700" />
              </div>
              <h3 className="text-lg font-bold mb-2">Professional Guide</h3>
              <p className="text-gray-600 text-sm">Licensed, experienced guide (me!) throughout your trek</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-green-700" />
              </div>
              <h3 className="text-lg font-bold mb-2">All Permits</h3>
              <p className="text-gray-600 text-sm">TIMS card, National Park permits, and restricted area permits</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-green-700" />
              </div>
              <h3 className="text-lg font-bold mb-2">Accommodation</h3>
              <p className="text-gray-600 text-sm">Tea house lodges or camping as per itinerary</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-green-700" />
              </div>
              <h3 className="text-lg font-bold mb-2">Meals</h3>
              <p className="text-gray-600 text-sm">Breakfast, lunch, and dinner during the trek</p>
            </div>
          </div>

          <div className="mt-12 bg-blue-50 p-8 rounded-lg">
            <h3 className="text-xl font-bold text-center mb-4">Additional Services Available</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <ul className="space-y-2">
                <li>✓ Airport transfers</li>
                <li>✓ Porter services</li>
                <li>✓ Equipment rental</li>
              </ul>
              <ul className="space-y-2">
                <li>✓ Travel insurance guidance</li>
                <li>✓ Pre-trek briefing</li>
                <li>✓ Emergency evacuation support</li>
              </ul>
              <ul className="space-y-2">
                <li>✓ Cultural site visits</li>
                <li>✓ Photography assistance</li>
                <li>✓ Post-trek celebration dinner</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
