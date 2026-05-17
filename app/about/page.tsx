import Image from "next/image"
import Link from "next/link"
import { Award, MapPin, Users, Shield, Heart, Mountain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-green-700">
                Technie Trek
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className="text-gray-700 hover:text-green-700 px-3 py-2 text-sm font-medium">
                  Home
                </Link>
                <Link href="/about" className="text-gray-900 hover:text-green-700 px-3 py-2 text-sm font-medium">
                  About Me
                </Link>
                <Link href="/treks" className="text-gray-700 hover:text-green-700 px-3 py-2 text-sm font-medium">
                  Trek Packages
                </Link>
                <Link href="/reviews" className="text-gray-700 hover:text-green-700 px-3 py-2 text-sm font-medium">
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

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-green-100 text-green-800">Meet Your Guide</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Hi, I'm Ashwin - Your Himalayan Adventure Partner
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Born in the shadow of the Himalayas, I've been sharing the magic of Nepal's mountains with travelers
                from around the world for over 15 years. Let me show you the Nepal that only locals know.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <Button size="lg" className="bg-green-700 hover:bg-green-800">
                    Plan Your Trek
                  </Button>
                </Link>
                <Link href="/treks">
                  <Button size="lg" variant="outline">
                    View My Treks
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/mountain-sunrise.jpg"
                alt="Ashwin - Professional Trekking Guide in Nepal"
                width={500}
                height={600}
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-lg max-w-xs">
                <div className="flex items-center gap-3 mb-2">
                  <Award className="h-6 w-6 text-green-600" />
                  <span className="font-bold text-gray-900">Licensed Guide</span>
                </div>
                <p className="text-sm text-gray-600">Nepal Tourism Board #NTB-2024-456</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* My Story */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">My Journey to Becoming Your Guide</h2>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="bg-gray-50 p-8 rounded-lg mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">From Local Boy to International Guide</h3>
              <p className="text-gray-700 mb-4">
                I was born and raised in a small village near Kathmandu, where the mountains were my playground and the
                trails were my classroom. Growing up, I watched foreign trekkers pass through our village with wonder in
                their eyes, and I knew I wanted to be part of their incredible journeys.
              </p>
              <p className="text-gray-700 mb-4">
                At 18, I started as a porter, carrying heavy loads up steep mountain paths. Those early years taught me
                the value of hard work, the importance of safety, and most importantly, how to read the mountains and
                weather patterns that could mean the difference between a successful trek and a dangerous situation.
              </p>
              <p className="text-gray-700">
                After years of experience and formal training, I became a licensed trekking guide in 2009. Since then,
                I've had the privilege of guiding over 500 trekkers from more than 30 countries, each bringing their own
                stories and dreams to the mountains I call home.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <Card className="p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-3">Languages I Speak</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>🇳🇵 Nepali (Native)</li>
                  <li>🇬🇧 English (Fluent)</li>
                  <li>🇮🇳 Hindi (Fluent)</li>
                  <li>🇹🇧 Tibetan (Conversational)</li>
                </ul>
              </Card>

              <Card className="p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-3">My Specialties</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>🏔️ High Altitude Trekking</li>
                  <li>🏛️ Cultural Heritage Tours</li>
                  <li>📸 Photography Guidance</li>
                  <li>🌿 Flora & Fauna Knowledge</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Credentials & Certifications */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Credentials & Certifications</h2>
            <p className="text-xl text-gray-600">
              Your safety and experience are my top priorities. Here are my professional qualifications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-green-700" />
              </div>
              <h3 className="text-xl font-bold mb-2">Licensed Trekking Guide</h3>
              <p className="text-gray-600 mb-3">Nepal Tourism Board Official License</p>
              <Badge variant="outline">License #NTB-2024-456</Badge>
            </Card>

            <Card className="p-6 text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-red-700" />
              </div>
              <h3 className="text-xl font-bold mb-2">First Aid Certified</h3>
              <p className="text-gray-600 mb-3">Wilderness First Aid & CPR Training</p>
              <Badge variant="outline">Valid until 2025</Badge>
            </Card>

            <Card className="p-6 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mountain className="h-8 w-8 text-blue-700" />
              </div>
              <h3 className="text-xl font-bold mb-2">High Altitude Training</h3>
              <p className="text-gray-600 mb-3">Advanced Mountain Safety Course</p>
              <Badge variant="outline">Nepal Mountaineering Association</Badge>
            </Card>

            <Card className="p-6 text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-700" />
              </div>
              <h3 className="text-xl font-bold mb-2">Cultural Heritage Guide</h3>
              <p className="text-gray-600 mb-3">UNESCO World Heritage Sites Specialist</p>
              <Badge variant="outline">Department of Archaeology</Badge>
            </Card>

            <Card className="p-6 text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-yellow-700" />
              </div>
              <h3 className="text-xl font-bold mb-2">Eco-Tourism Advocate</h3>
              <p className="text-gray-600 mb-3">Sustainable Tourism Practices</p>
              <Badge variant="outline">Nepal Eco-Tourism Society</Badge>
            </Card>

            <Card className="p-6 text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-indigo-700" />
              </div>
              <h3 className="text-xl font-bold mb-2">Route Specialist</h3>
              <p className="text-gray-600 mb-3">Expert in 25+ Trekking Routes</p>
              <Badge variant="outline">15+ Years Experience</Badge>
            </Card>
          </div>
        </div>
      </section>

      {/* My Philosophy */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">My Guiding Philosophy</h2>

          <div className="bg-green-50 p-8 rounded-lg mb-8">
            <blockquote className="text-2xl font-medium text-gray-900 mb-6">
              "Every trek is not just about reaching the destination, but about the journey, the people you meet, the
              stories you share, and the memories you create along the way."
            </blockquote>
            <cite className="text-lg text-green-700 font-semibold">- Ashwin, Your Trekking Guide</cite>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Safety First</h3>
              <p className="text-gray-600">
                Your safety is my absolute priority. I continuously monitor weather conditions, assess risks, and make
                decisions based on current mountain conditions and your wellbeing.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cultural Bridge</h3>
              <p className="text-gray-600">
                I love sharing the rich culture, traditions, and stories of Nepal. You'll not just see the mountains,
                but understand the people and communities that call them home.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Personal Touch</h3>
              <p className="text-gray-600">
                Every trekker is unique. I adapt my guiding style to match your pace, interests, and goals, ensuring you
                have the best possible experience in the Himalayas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-green-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Trek with Me?</h2>
          <p className="text-xl mb-8 text-green-100">
            Let's plan your perfect Himalayan adventure together. I'm here to make your trekking dreams come true.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-green-700 hover:bg-gray-100">
                Get in Touch
              </Button>
            </Link>
            <Link href="/treks">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-700 bg-transparent"
              >
                View Trek Packages
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
