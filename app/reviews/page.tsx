import Link from "next/link"
import Image from "next/image"
import { Star, MapPin, Calendar, Users, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ReviewsPage() {
  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      country: "Australia",
      trek: "Everest Base Camp Trek",
      date: "October 2023",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
      review:
        "Ashwin was absolutely incredible! His knowledge of the mountains, local culture, and safety protocols made our Everest Base Camp trek unforgettable. He was always checking on our wellbeing, sharing fascinating stories about Sherpa culture, and ensuring we were properly acclimatized. His English is excellent, and he has such a warm, friendly personality. I felt completely safe under his guidance. Highly recommend!",
      highlights: ["Excellent safety knowledge", "Great cultural insights", "Very professional"],
    },
    {
      id: 2,
      name: "Marco Rossi",
      country: "Italy",
      trek: "Annapurna Circuit Trek",
      date: "September 2023",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
      review:
        "Best trekking experience of my life! Ashwin's passion for the mountains is contagious. He knew every trail, every village, and had connections everywhere we went. The local people clearly respect and trust him. He helped us when one of our group members got altitude sickness, arranging immediate descent and medical care. His care for trekkers goes beyond just guiding - he truly cares about your experience and safety.",
      highlights: ["Local connections", "Emergency response", "Passionate guide"],
    },
    {
      id: 3,
      name: "Emma Thompson",
      country: "United Kingdom",
      trek: "Langtang Valley Trek",
      date: "November 2023",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
      review:
        "Ashwin made our Langtang Valley trek absolutely perfect. As a solo female traveler, I felt completely safe and comfortable. He's incredibly knowledgeable about flora and fauna, pointing out different plants and birds along the way. His photography tips helped me capture amazing shots! The way he interacts with local communities shows his deep respect for the culture. Already planning my next trek with him!",
      highlights: ["Solo female friendly", "Nature knowledge", "Photography guidance"],
    },
    {
      id: 4,
      name: "David Chen",
      country: "Canada",
      trek: "Gokyo Lakes Trek",
      date: "April 2023",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
      review:
        "Ashwin's expertise and professionalism are unmatched. Our Gokyo Lakes trek was challenging, but he managed our pace perfectly, ensuring everyone in our group could complete it successfully. His weather reading skills saved us from a potential storm - he adjusted our itinerary and we avoided dangerous conditions. The sunrise from Gokyo Ri was breathtaking, and his local knowledge made all the difference.",
      highlights: ["Weather expertise", "Pace management", "Local knowledge"],
    },
    {
      id: 5,
      name: "Lisa Mueller",
      country: "Germany",
      trek: "Upper Mustang Trek",
      date: "May 2023",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
      review:
        "The Upper Mustang trek with Ashwin was like traveling back in time. His deep knowledge of Tibetan culture and history brought the ancient kingdom to life. He arranged special permissions and had connections that allowed us to visit places most tourists never see. His storytelling around the campfire each evening was magical. This wasn't just a trek - it was a cultural immersion.",
      highlights: ["Cultural expertise", "Special access", "Great storyteller"],
    },
    {
      id: 6,
      name: "James Wilson",
      country: "United States",
      trek: "Manaslu Circuit Trek",
      date: "March 2023",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
      review:
        "Ashwin guided our group of 6 friends on the Manaslu Circuit, and it exceeded all expectations. His physical fitness and endurance are impressive - he was always energetic and positive, even on the toughest days. He's also an excellent problem solver. When we had gear issues, he quickly found solutions. His first aid knowledge gave us confidence on this remote trek. Absolutely recommend him for challenging treks!",
      highlights: ["Physical fitness", "Problem solving", "First aid certified"],
    },
    {
      id: 7,
      name: "Sophie Dubois",
      country: "France",
      trek: "Everest Base Camp Trek",
      date: "October 2022",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
      review:
        "Ashwin is not just a guide, he's a friend for life! His genuine care for trekkers is evident in everything he does. He remembered everyone's names, dietary preferences, and personal stories. When I was struggling with altitude, he stayed with me, encouraged me, and helped me reach base camp safely. His positive attitude and infectious smile made even the hardest days enjoyable. Merci beaucoup, Ashwin!",
      highlights: ["Personal attention", "Altitude support", "Positive attitude"],
    },
    {
      id: 8,
      name: "Robert Anderson",
      country: "New Zealand",
      trek: "Annapurna Circuit Trek",
      date: "November 2022",
      rating: 5,
      avatar: "/placeholder.svg?height=60&width=60",
      review:
        "At 65, I was worried about keeping up on the Annapurna Circuit, but Ashwin's patient and encouraging approach made it possible. He adjusted our daily distances based on how I was feeling and never made me feel like a burden. His knowledge of high-altitude physiology is impressive. The tea house owners clearly know and respect him - we got the best rooms and meals everywhere we stayed!",
      highlights: ["Patient with seniors", "Altitude physiology", "Great local relationships"],
    },
  ]

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  const totalReviews = reviews.length

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-green-700">
                Technie Trek Ashwin
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className="text-gray-700 hover:text-green-700 px-3 py-2 text-sm font-medium">
                  Home
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-green-700 px-3 py-2 text-sm font-medium">
                  About Me
                </Link>
                <Link href="/treks" className="text-gray-700 hover:text-green-700 px-3 py-2 text-sm font-medium">
                  Trek Packages
                </Link>
                <Link href="/reviews" className="text-gray-900 hover:text-green-700 px-3 py-2 text-sm font-medium">
                  Reviews
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-green-700 px-3 py-2 text-sm font-medium">
                  Contact
                </Link>
                <Link href="/booking">
                  <Button className="bg-green-700 hover:bg-green-800">Book Now</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Client Reviews</h1>
          <p className="text-xl text-gray-600 mb-8">
            Read what international trekkers say about their experiences with me. These authentic reviews reflect my
            commitment to safety, professionalism, and unforgettable adventures.
          </p>

          {/* Rating Summary */}
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-700 mb-2">{averageRating.toFixed(1)}</div>
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600">Based on {totalReviews} verified reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {reviews.map((review) => (
              <Card key={review.id} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      {review.id === 1 ? (
                        <Image
                          src="/images/mountain-sunrise.jpg"
                          alt={review.name}
                          width={60}
                          height={60}
                          className="rounded-full"
                        />
                      ) : review.id === 2 ? (
                        <Image
                          src="/images/prayer-flags.jpg"
                          alt={review.name}
                          width={60}
                          height={60}
                          className="rounded-full"
                        />
                      ) : review.id === 3 ? (
                        <Image
                          src="/images/sherpa-village.jpg"
                          alt={review.name}
                          width={60}
                          height={60}
                          className="rounded-full"
                        />
                      ) : review.id === 4 ? (
                        <Image
                          src="/images/everest-base-camp.jpg"
                          alt={review.name}
                          width={60}
                          height={60}
                          className="rounded-full"
                        />
                      ) : review.id === 5 ? (
                        <Image
                          src="/images/annapurna-circuit.jpg"
                          alt={review.name}
                          width={60}
                          height={60}
                          className="rounded-full"
                        />
                      ) : review.id === 6 ? (
                        <Image
                          src="/images/langtang-valley.jpg"
                          alt={review.name}
                          width={60}
                          height={60}
                          className="rounded-full"
                        />
                      ) : review.id === 7 ? (
                        <Image
                          src="/images/manaslu-circuit.jpg"
                          alt={review.name}
                          width={60}
                          height={60}
                          className="rounded-full"
                        />
                      ) : (
                        <Image
                          src="/images/gokyo-lakes.jpg"
                          alt={review.name}
                          width={60}
                          height={60}
                          className="rounded-full"
                        />
                      )}
                      <div>
                        <h3 className="font-bold text-lg">{review.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{review.country}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>

                  {/* Trek Info */}
                  <Badge variant="outline" className="mb-4">
                    {review.trek}
                  </Badge>

                  {/* Review Text */}
                  <div className="relative mb-4">
                    <Quote className="absolute -top-2 -left-2 h-8 w-8 text-green-200" />
                    <p className="text-gray-700 leading-relaxed pl-6">{review.review}</p>
                  </div>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2">
                    {review.highlights.map((highlight, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Review Stats */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Review Statistics</h2>
            <p className="text-xl text-gray-600">Breakdown of my client feedback across different aspects</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6">
              <div className="text-3xl font-bold text-green-700 mb-2">100%</div>
              <div className="text-gray-600 mb-2">Safety Record</div>
              <div className="text-sm text-gray-500">Zero accidents in 15+ years</div>
            </Card>

            <Card className="text-center p-6">
              <div className="text-3xl font-bold text-green-700 mb-2">4.9★</div>
              <div className="text-gray-600 mb-2">Average Rating</div>
              <div className="text-sm text-gray-500">Across all platforms</div>
            </Card>

            <Card className="text-center p-6">
              <div className="text-3xl font-bold text-green-700 mb-2">95%</div>
              <div className="text-gray-600 mb-2">Repeat Clients</div>
              <div className="text-sm text-gray-500">Book additional treks</div>
            </Card>

            <Card className="text-center p-6">
              <div className="text-3xl font-bold text-green-700 mb-2">30+</div>
              <div className="text-gray-600 mb-2">Countries</div>
              <div className="text-sm text-gray-500">Clients from worldwide</div>
            </Card>
          </div>
        </div>
      </section>

      {/* External Reviews */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Find Me on Review Platforms</h2>
          <p className="text-xl text-gray-600 mb-12">Check out more reviews on popular travel platforms</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-green-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">TripAdvisor</h3>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">4.9/5 from 127 reviews</p>
                <Button variant="outline" size="sm">
                  View on TripAdvisor
                </Button>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-blue-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Google Reviews</h3>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">4.8/5 from 89 reviews</p>
                <Button variant="outline" size="sm">
                  View on Google
                </Button>
              </div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-orange-700" />
                </div>
                <h3 className="text-xl font-bold mb-2">Booking.com</h3>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">9.2/10 from 64 reviews</p>
                <Button variant="outline" size="sm">
                  View on Booking.com
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Create Your Own Amazing Experience?</h2>
          <p className="text-xl mb-8 text-green-100">
            Join hundreds of satisfied trekkers who've discovered the magic of Nepal with me as their guide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking">
              <Button size="lg" className="bg-white text-green-700 hover:bg-gray-100">
                Book Your Trek
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-700 bg-transparent"
              >
                Ask Questions
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
