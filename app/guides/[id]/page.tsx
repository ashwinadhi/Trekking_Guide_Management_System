import Link from "next/link"
import Image from "next/image"
import { Star, MapPin, MessageCircle, Languages, Calendar, Users, Award, Shield, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function GuideProfilePage({ params }: { params: { id: string } }) {
  // This would normally come from a database
  const guide = {
    id: "ashwin-trek-guide",
    name: "Ashwin Shrestha",
    location: "Kathmandu & Trekking Regions",
    specialties: ["High Altitude Trekking", "Everest Region", "Annapurna Circuit", "Cultural Tours"],
    languages: ["English", "Hindi", "Nepali", "Basic Japanese"],
    rating: 4.9,
    reviewCount: 127,
    pricePerDay: 45,
    experience: "15+ years",
    image: "/images/mountain-sunrise.jpg",
    verified: true,
    responseTime: "Within 2 hours",
    description: "Licensed trekking guide specializing in high-altitude adventures and cultural experiences.",
    longDescription: `I'm Ashwin, a licensed trekking guide with over 15 years of experience leading international travelers through Nepal's magnificent Himalayas. Born and raised in the shadow of the mountains, I've dedicated my life to sharing the beauty, culture, and adventure that Nepal has to offer.

My passion lies in creating unforgettable experiences that go beyond just reaching destinations. I believe in sustainable tourism that respects local communities and the environment while providing authentic cultural exchanges.`,
    phone: "+977-9841234567",
    email: "ashwin@example.com",
    whatsapp: "+977-9841234567",
    certifications: [
      "Nepal Tourism Board Licensed Guide (#NTB-2024-456)",
      "Wilderness First Aid Certified",
      "High Altitude Training Certified",
      "Cultural Heritage Guide Specialist",
    ],
    services: [
      "Trekking Guide Services",
      "Cultural Tours",
      "Airport Pickup/Drop-off",
      "Equipment Rental",
      "Itinerary Planning",
      "Photography Assistance",
    ],
    availability: [
      { month: "January 2024", available: true },
      { month: "February 2024", available: true },
      { month: "March 2024", available: false },
      { month: "April 2024", available: true },
    ],
    reviews: [
      {
        id: 1,
        name: "Sarah Johnson",
        country: "Australia",
        rating: 5,
        date: "October 2023",
        comment:
          "Ashwin was absolutely incredible! His knowledge of the mountains and safety protocols made our trek unforgettable.",
        avatar: "/images/prayer-flags.jpg",
      },
      {
        id: 2,
        name: "Marco Rossi",
        country: "Italy",
        rating: 5,
        date: "September 2023",
        comment:
          "Best guide ever! Ashwin's passion for the mountains is contagious and his care for trekkers is exceptional.",
        avatar: "/images/mountain-sunrise.jpg",
      },
    ],
    gallery: [
      "/images/everest-base-camp.jpg",
      "/images/annapurna-circuit.jpg",
      "/images/langtang-valley.jpg",
      "/images/manaslu-circuit.jpg",
    ],
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-green-700">
                Nepal Guide Connect
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className="text-gray-700 hover:text-green-700 px-3 py-2 text-sm font-medium">
                  Home
                </Link>
                <Link href="/guides" className="text-gray-700 hover:text-green-700 px-3 py-2 text-sm font-medium">
                  Find Guides
                </Link>
                <Link href="/destinations" className="text-gray-700 hover:text-green-700 px-3 py-2 text-sm font-medium">
                  Destinations
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Guide Header */}
      <section className="py-12 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="relative">
                  <Image
                    src={guide.image || "/placeholder.svg"}
                    alt={guide.name}
                    width={200}
                    height={200}
                    className="rounded-lg shadow-lg"
                  />
                  {guide.verified && (
                    <Badge className="absolute -top-2 -right-2 bg-green-600 text-white">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{guide.name}</h1>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{guide.location}</span>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="font-bold">{guide.rating}</span>
                      <span className="text-gray-600">({guide.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600">{guide.experience} experience</span>
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-4">{guide.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {guide.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <Languages className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-600">{guide.languages.join(", ")}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold text-green-700 mb-1">${guide.pricePerDay}</div>
                    <div className="text-gray-600">per day</div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Responds {guide.responseTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Verified & Licensed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Flexible Scheduling</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Link href={`/booking?guide=${guide.id}`}>
                      <Button className="w-full bg-green-700 hover:bg-green-800">Book This Guide</Button>
                    </Link>
                    <Button variant="outline" className="w-full bg-transparent">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold mb-3">Contact Options</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{guide.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{guide.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">WhatsApp: {guide.whatsapp}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Information */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>About {guide.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-gray-700 leading-relaxed">{guide.longDescription}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5 text-green-600" />
                        Certifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {guide.certifications.map((cert, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-700">{cert}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="services" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Services Offered</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {guide.services.map((service, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-8">
              <div className="space-y-6">
                {guide.reviews.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Image
                          src={review.avatar || "/placeholder.svg"}
                          alt={review.name}
                          width={50}
                          height={50}
                          className="rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">{review.name}</h4>
                              <p className="text-sm text-gray-500">
                                {review.country} • {review.date}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="gallery" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {guide.gallery.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`Gallery image ${index + 1}`}
                      width={300}
                      height={200}
                      className="rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="availability" className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Availability Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {guide.availability.map((period, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${period.available ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{period.month}</span>
                          <Badge variant={period.available ? "default" : "destructive"}>
                            {period.available ? "Available" : "Booked"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <p className="text-sm text-gray-600">
                      For specific dates and custom itineraries, please contact the guide directly.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
