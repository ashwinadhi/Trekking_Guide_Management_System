import { notFound } from "next/navigation"
import Link from "next/link"
import { Star, Clock, Users, MapPin, Calendar, CheckCircle, User, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { allTreks } from "@/data/treks"
import Header from "@/components/header"
import Footer from "@/components/footer"

interface TrekPageProps {
  params: {
    slug: string
  }
}

export default function TrekPage({ params }: TrekPageProps) {
  const trek = allTreks.find((t) => t.slug === params.slug)

  if (!trek) {
    notFound()
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "moderate":
        return "bg-yellow-100 text-yellow-800"
      case "challenging":
        return "bg-orange-100 text-orange-800"
      case "extreme":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case "high":
        return "bg-green-100 text-green-800 border-green-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="relative h-96 bg-gray-900">
        <img
          src={trek.images[0] || "/placeholder.svg"}
          alt={trek.name}
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-white" />
              <span className="text-white text-sm">{trek.location}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{trek.name}</h1>
            <div className="flex items-center gap-4 text-white">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{trek.rating}</span>
                <span className="text-gray-300">({trek.reviews} reviews)</span>
              </div>
              <Badge className={getDifficultyColor(trek.difficulty)}>{trek.difficulty}</Badge>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Trek Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{trek.description}</p>
              </CardContent>
            </Card>

            {/* Route Highlights */}
            <Card>
              <CardHeader>
                <CardTitle>Route Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trek.routeHighlights.map((highlight, index) => (
                    <div key={index} className={`p-4 rounded-lg border-2 ${getImportanceColor(highlight.importance)}`}>
                      <div className="flex items-start gap-3">
                        <img
                          src={highlight.image || "/placeholder.svg"}
                          alt={highlight.name}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm">{highlight.name}</h3>
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                highlight.importance === "high"
                                  ? "border-green-300 text-green-700"
                                  : highlight.importance === "medium"
                                    ? "border-yellow-300 text-yellow-700"
                                    : "border-blue-300 text-blue-700"
                              }`}
                            >
                              {highlight.importance === "high"
                                ? "Must See"
                                : highlight.importance === "medium"
                                  ? "Important"
                                  : "Notable"}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">{highlight.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Detailed Itinerary */}
            <Card>
              <CardHeader>
                <CardTitle>Detailed Itinerary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trek.detailedItinerary.map((day, index) => (
                    <div key={index} className="border-l-4 border-green-500 pl-4 pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                          {day.day}
                        </div>
                        <h3 className="font-semibold text-lg">{day.title}</h3>
                      </div>
                      <p className="text-gray-600 mb-3 leading-relaxed">{day.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-500">Walking Time:</span>
                          <p className="text-gray-700">{day.walkingTime}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Altitude:</span>
                          <p className="text-gray-700">{day.altitude}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Accommodation:</span>
                          <p className="text-gray-700">{day.accommodation}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Meals:</span>
                          <p className="text-gray-700">{day.meals}</p>
                        </div>
                      </div>

                      <div>
                        <span className="font-medium text-gray-500 text-sm">Highlights:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {day.highlights.map((highlight, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {highlight}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trek Gallery */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Trek Gallery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {trek.images.map((image, index) => (
                    <div key={index} className="relative group cursor-pointer">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`${trek.name} - Image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* What's Included */}
            <Card>
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {trek.included.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Guide Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Your Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <img
                    src={trek.guide.image || "/placeholder.svg"}
                    alt={trek.guide.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{trek.guide.name}</h3>
                    <p className="text-green-600 font-medium">{trek.guide.title}</p>
                    <p className="text-gray-600 mt-2 leading-relaxed">{trek.guide.bio}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <span>Experience: {trek.guide.experience}</span>
                      <span>Languages: {trek.guide.languages.join(", ")}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Booking Card */}
            <Card className="sticky top-6 h-fit shadow-lg border-2">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-green-700 mb-2">${trek.price}</div>
                  <div className="text-gray-600">per person</div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>Duration</span>
                    </div>
                    <span className="font-medium">{trek.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>Group Size</span>
                    </div>
                    <span className="font-medium">Max {trek.maxGroupSize}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Next Departure</span>
                    </div>
                    <span className="font-medium">{new Date(trek.startDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <Link href="/booking" className="w-full">
                  <Button className="w-full bg-green-700 hover:bg-green-800 text-white py-3">Book This Trek</Button>
                </Link>

                <div className="mt-4 text-center">
                  <Link href="/contact" className="text-green-600 hover:text-green-700 text-sm">
                    Have questions? Contact me
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Trek Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Trek Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulty</span>
                  <Badge className={getDifficultyColor(trek.difficulty)}>{trek.difficulty}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Min Age</span>
                  <span className="font-medium">{trek.minAge} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Best Season</span>
                  <span className="font-medium">Mar-May, Sep-Nov</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Accommodation</span>
                  <span className="font-medium">Tea Houses</span>
                </div>
              </CardContent>
            </Card>

            {/* Safety Information */}
            <Card>
              <CardHeader>
                <CardTitle>Safety & Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Licensed Professional Guide</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">First Aid Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Emergency Evacuation Insurance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">24/7 Support Available</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
