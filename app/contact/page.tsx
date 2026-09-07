"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, Loader2 } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { PageHero } from "@/components/luxury/page-hero"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  isValidEmail,
  isTenDigitPhone,
  isFullNameNoSpecial,
  isSubjectLine,
  isMessageBody,
  sanitizeFullNameInput,
  normalizePhoneDigits,
} from "@/lib/form-validation"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFullNameNoSpecial(formData.name)) {
      alert("Full name may only contain letters and spaces (at least 2 characters).")
      return
    }
    if (!isValidEmail(formData.email)) {
      alert("Please enter a valid email address.")
      return
    }
    if (!isTenDigitPhone(formData.phone)) {
      alert("Phone must be exactly 10 digits.")
      return
    }
    if (!isSubjectLine(formData.subject)) {
      alert("Subject must be at least 3 characters and use only allowed characters.")
      return
    }
    if (!isMessageBody(formData.message)) {
      alert("Message must be at least 10 characters.")
      return
    }
    setStatus("loading")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to send message")
      setStatus("success")
      alert("Message Sent Successfully!")
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" })
      setTimeout(() => setStatus("idle"), 3000)
    } catch (err: any) {
      console.error(err)
      setStatus("error")
      alert(err.message)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageHero
        eyebrow="Concierge"
        title="Speak with a planner"
        subtitle="Kathmandu-based specialists for private itineraries, lodge stays, and arrival logistics."
        compact
      />

      {/* Contact Methods */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="bg-gold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-gold" />
              </div>
              <h3 className="text-lg font-bold mb-2">WhatsApp</h3>
              <p className="text-stone mb-4">Quick responses, photos, and voice messages</p>
              <Button 
                className="w-full bg-gold hover:bg-gold/90"
                onClick={() => window.open("https://wa.me/9779841234567", "_blank")}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                +977-9841234567
              </Button>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="bg-gold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-gold" />
              </div>
              <h3 className="text-lg font-bold mb-2">Email</h3>
              <p className="text-stone mb-4">Detailed itineraries and information</p>
              <Button 
                variant="outline" 
                className="w-full bg-transparent border-gold/30"
                onClick={() => window.location.href = "mailto:ashwin@technietrek.com"}
              >
                <Mail className="mr-2 h-4 w-4" />
                ashwin@technietrek.com
              </Button>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="bg-gold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-gold" />
              </div>
              <h3 className="text-lg font-bold mb-2">Phone Call</h3>
              <p className="text-stone mb-4">Direct conversation for urgent matters</p>
              <Button 
                variant="outline" 
                className="w-full bg-transparent border-gold/30"
                onClick={() => window.location.href = "tel:+9779841234567"}
              >
                <Phone className="mr-2 h-4 w-4" />
                +977-9841234567
              </Button>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="bg-gold/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-gold" />
              </div>
              <h3 className="text-lg font-bold mb-2">Meet in Person</h3>
              <p className="text-stone mb-4">Pre-trek briefing in Kathmandu</p>
              <Button 
                variant="outline" 
                className="w-full bg-transparent border-gold/30"
                onClick={() => window.open("https://maps.google.com/?q=Thamel,Kathmandu", "_blank")}
              >
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
                  <p className="text-stone">
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
                          onChange={(e) =>
                            handleChange("name", sanitizeFullNameInput(e.target.value))
                          }
                          maxLength={100}
                          required
                        />
                        <p className="text-xs text-stone mt-1">Letters and spaces only.</p>
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value.trimStart())}
                          maxLength={254}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone * (10 digits)</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", normalizePhoneDigits(e.target.value))}
                        maxLength={10}
                        inputMode="numeric"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => handleChange("subject", e.target.value)}
                        placeholder="What is this regarding?"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        placeholder="Tell me about your trekking experience, fitness level, specific interests, or any questions you have..."
                        rows={5}
                        required
                        minLength={10}
                        maxLength={5000}
                      />
                      <p className="text-xs text-stone mt-1">Minimum 10 characters.</p>
                    </div>

                    <Button type="submit" disabled={status === "loading"} className="w-full bg-gold hover:bg-gold/90">
                      {status === "loading" ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                      ) : (
                        <><Send className="mr-2 h-4 w-4" /> Send Message</>
                      )}
                    </Button>
                    {status === "success" && (
                      <div className="text-center text-gold font-medium mt-2">
                        Message Sent Successfully!
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gold" />
                    Response Times
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">WhatsApp</span>
                    <span className="text-gold">Usually within 2 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Email</span>
                    <span className="text-gold">Within 24 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Contact Form</span>
                    <span className="text-gold">Within 24 hours</span>
                  </div>
                  <div className="mt-4 p-4 bg-gold/5 rounded-lg">
                    <p className="text-sm text-gold">
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
                    <p className="text-stone text-sm">
                      I recommend booking at least 2-3 months in advance, especially for peak seasons (March-May,
                      September-November).
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Do you offer group discounts?</h4>
                    <p className="text-stone text-sm">
                      Yes! Groups of 4 or more people receive special pricing. Contact me for custom group rates.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">What if I need to cancel?</h4>
                    <p className="text-stone text-sm">
                      I have flexible cancellation policies. Full details will be provided when you book, but I always
                      try to work with clients on changes.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Can you help with travel insurance?</h4>
                    <p className="text-stone text-sm">
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
                  <p className="text-stone mb-4">
                    During your trek, I'm available 24/7 for any emergencies or concerns.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gold" />
                      <span className="font-medium">Emergency Line: +977-9841234567</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-gold" />
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
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-ivory mb-4">Meet Me in Kathmandu</h2>
            <p className="text-xl text-stone">
              I'm based in Kathmandu and available for pre-trek briefings and equipment checks
            </p>
          </div>

          <div className="bg-card rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-bold mb-4">Pre-Trek Meeting Location</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gold mt-1" />
                    <div>
                      <p className="font-medium">Thamel, Kathmandu</p>
                      <p className="text-stone text-sm">
                        Tourist district with easy access to hotels and restaurants
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-gold mt-1" />
                    <div>
                      <p className="font-medium">Flexible Meeting Times</p>
                      <p className="text-stone text-sm">Available 7 days a week, morning to evening</p>
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

              <div className="rounded-2xl overflow-hidden h-80 shadow-inner border border-gold/15">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56516.31625951665!2d85.291113!3d27.708955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb198a307baabf%3A0xb5137c1bf18db1ea!2sKathmandu%2044600!5e0!3m2!1sen!2snp!4v1715420000000!5m2!1sen!2snp" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Nirvana Luxury Adventure Meeting Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
