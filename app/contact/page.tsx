"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Phone, Mail, MapPin, MessageCircle, Clock, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    trekInterest: "",
    trekDates: "",
    groupSize: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
    alert("Thank you for your message! I'll get back to you within 24 hours.")
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

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
                <Link href="/reviews" className="text-gray-700 hover:text-green-700 px-3 py-2 text-sm font-medium">
                  Reviews
                </Link>
                <Link href="/contact" className="text-gray-900 hover:text-green-700 px-3 py-2 text-sm font-medium">
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Get in Touch</h1>
          <p className="text-xl text-gray-600">
            Ready to plan your Himalayan adventure? I'm here to help you every step of the way. Contact me for
            personalized trek planning and expert advice.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-green-700" />
              </div>
              <h3 className="text-lg font-bold mb-2">WhatsApp</h3>
              <p className="text-gray-600 mb-4">Quick responses, photos, and voice messages</p>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <MessageCircle className="mr-2 h-4 w-4" />
                +977-9841234567
              </Button>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-blue-700" />
              </div>
              <h3 className="text-lg font-bold mb-2">Email</h3>
              <p className="text-gray-600 mb-4">Detailed itineraries and information</p>
              <Button variant="outline" className="w-full bg-transparent">
                <Mail className="mr-2 h-4 w-4" />
                ashwin@technietrek.com
              </Button>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-orange-700" />
              </div>
              <h3 className="text-lg font-bold mb-2">Phone Call</h3>
              <p className="text-gray-600 mb-4">Direct conversation for urgent matters</p>
              <Button variant="outline" className="w-full bg-transparent">
                <Phone className="mr-2 h-4 w-4" />
                +977-9841234567
              </Button>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-purple-700" />
              </div>
              <h3 className="text-lg font-bold mb-2">Meet in Person</h3>
              <p className="text-gray-600 mb-4">Pre-trek briefing in Kathmandu</p>
              <Button variant="outline" className="w-full bg-transparent">
                <MapPin className="mr-2 h-4 w-4" />
                Kathmandu, Nepal
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Send Me a Message</CardTitle>
                  <p className="text-gray-600">
                    Fill out the form below and I'll get back to you within 24 hours with detailed information about
                    your trek.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleChange("phone", e.target.value)}
                          placeholder="+1-234-567-8900"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={formData.country}
                          onChange={(e) => handleChange("country", e.target.value)}
                          placeholder="Your country"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="trekInterest">Trek of Interest</Label>
                      <Select onValueChange={(value) => handleChange("trekInterest", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a trek package" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="everest-base-camp">Everest Base Camp Trek</SelectItem>
                          <SelectItem value="annapurna-circuit">Annapurna Circuit Trek</SelectItem>
                          <SelectItem value="langtang-valley">Langtang Valley Trek</SelectItem>
                          <SelectItem value="manaslu-circuit">Manaslu Circuit Trek</SelectItem>
                          <SelectItem value="gokyo-lakes">Gokyo Lakes Trek</SelectItem>
                          <SelectItem value="upper-mustang">Upper Mustang Trek</SelectItem>
                          <SelectItem value="custom">Custom Trek</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="trekDates">Preferred Trek Dates</Label>
                        <Input
                          id="trekDates"
                          value={formData.trekDates}
                          onChange={(e) => handleChange("trekDates", e.target.value)}
                          placeholder="e.g., March 2024"
                        />
                      </div>
                      <div>
                        <Label htmlFor="groupSize">Group Size</Label>
                        <Select onValueChange={(value) => handleChange("groupSize", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Number of trekkers" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Solo (1 person)</SelectItem>
                            <SelectItem value="2">Couple (2 people)</SelectItem>
                            <SelectItem value="3-4">Small group (3-4 people)</SelectItem>
                            <SelectItem value="5-8">Medium group (5-8 people)</SelectItem>
                            <SelectItem value="9+">Large group (9+ people)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        placeholder="Tell me about your trekking experience, fitness level, specific interests, or any questions you have..."
                        rows={5}
                      />
                    </div>

                    <Button type="submit" className="w-full bg-green-700 hover:bg-green-800">
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-green-700" />
                    Response Times
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">WhatsApp</span>
                    <span className="text-green-600">Usually within 2 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Email</span>
                    <span className="text-green-600">Within 24 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Contact Form</span>
                    <span className="text-green-600">Within 24 hours</span>
                  </div>
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Best Time to Reach Me:</strong> 6 AM - 10 PM Nepal Time (UTC+5:45)
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">How far in advance should I book?</h4>
                    <p className="text-gray-600 text-sm">
                      I recommend booking at least 2-3 months in advance, especially for peak seasons (March-May,
                      September-November).
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Do you offer group discounts?</h4>
                    <p className="text-gray-600 text-sm">
                      Yes! Groups of 4 or more people receive special pricing. Contact me for custom group rates.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">What if I need to cancel?</h4>
                    <p className="text-gray-600 text-sm">
                      I have flexible cancellation policies. Full details will be provided when you book, but I always
                      try to work with clients on changes.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Can you help with travel insurance?</h4>
                    <p className="text-gray-600 text-sm">
                      I can recommend reliable travel insurance providers and help you understand what coverage you need
                      for trekking.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    During your trek, I'm available 24/7 for any emergencies or concerns.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Emergency Line: +977-9841234567</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">WhatsApp: Available 24/7</span>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-800">
                      <strong>For immediate emergencies during treks:</strong> Call directly or use satellite
                      communication devices provided.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Me in Kathmandu</h2>
            <p className="text-xl text-gray-600">
              I'm based in Kathmandu and available for pre-trek briefings and equipment checks
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-bold mb-4">Pre-Trek Meeting Location</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <p className="font-medium">Thamel, Kathmandu</p>
                      <p className="text-gray-600 text-sm">
                        Tourist district with easy access to hotels and restaurants
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <p className="font-medium">Flexible Meeting Times</p>
                      <p className="text-gray-600 text-sm">Available 7 days a week, morning to evening</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">What We'll Cover in Our Meeting:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Detailed trek itinerary review</li>
                    <li>• Equipment check and rental options</li>
                    <li>• Weather and trail conditions update</li>
                    <li>• Cultural briefing and local customs</li>
                    <li>• Emergency procedures and safety protocols</li>
                    <li>• Final questions and preparations</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Interactive Map</p>
                  <p className="text-sm text-gray-400">Kathmandu, Nepal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
