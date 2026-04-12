"use client"

import type React from "react"

import { useState } from "react"
import { Star, MapPin, Wifi, Utensils, Mountain, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useToast } from "@/hooks/use-toast"

export default function HotelsPage() {
  const { toast } = useToast()
  const [selectedHotel, setSelectedHotel] = useState<any>(null)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: "2",
    roomType: "",
    paymentMethod: "",
    addBreakfast: false,
    addLunch: false,
    specialRequests: "",
  })

  const hotels = [
    {
      id: "1",
      name: "Everest View Lodge",
      location: "Namche Bazaar, Everest Region",
      description: "Traditional lodge with stunning Everest views and authentic Sherpa hospitality",
      image: "/images/hotel-everest-view.jpg",
      rating: 4.8,
      reviews: 156,
      pricePerNight: 45,
      amenities: ["Mountain View", "WiFi", "Restaurant", "Hot Shower", "Heating"],
      roomTypes: [
        { type: "Standard Room", price: 45, description: "Cozy room with mountain views" },
        { type: "Deluxe Room", price: 65, description: "Spacious room with private bathroom" },
        { type: "Suite", price: 85, description: "Premium suite with panoramic views" },
      ],
      images: [
        "/images/hotel-everest-view.jpg",
        "/images/hotel-room-1.jpg",
        "/images/hotel-dining.jpg",
        "/images/hotel-breakfast.jpg",
      ],
      features: ["Best Everest Views", "Traditional Architecture", "Local Cuisine", "Experienced Staff"],
    },
    {
      id: "2",
      name: "Annapurna Mountain Lodge",
      location: "Ghorepani, Annapurna Region",
      description: "Comfortable lodge perfect for Poon Hill sunrise trek with modern amenities",
      image: "/images/hotel-annapurna-lodge.jpg",
      rating: 4.7,
      reviews: 203,
      pricePerNight: 35,
      amenities: ["Sunrise View", "WiFi", "Restaurant", "Hot Shower", "Garden"],
      roomTypes: [
        { type: "Standard Room", price: 35, description: "Clean room with shared bathroom" },
        { type: "Private Room", price: 50, description: "Private room with attached bathroom" },
        { type: "Family Room", price: 70, description: "Large room for families" },
      ],
      images: [
        "/images/hotel-annapurna-lodge.jpg",
        "/images/hotel-room-2.jpg",
        "/images/hotel-dining.jpg",
        "/images/hotel-breakfast.jpg",
      ],
      features: ["Poon Hill Access", "Organic Garden", "Cultural Programs", "Trekking Support"],
    },
    {
      id: "3",
      name: "Langtang Guest House",
      location: "Kyanjin Gompa, Langtang Valley",
      description: "Peaceful guest house in the heart of Langtang Valley with glacier views",
      image: "/images/hotel-langtang-guest.jpg",
      rating: 4.6,
      reviews: 89,
      pricePerNight: 30,
      amenities: ["Glacier View", "Restaurant", "Hot Shower", "Yak Cheese", "Monastery Nearby"],
      roomTypes: [
        { type: "Basic Room", price: 30, description: "Simple room with mountain views" },
        { type: "Standard Room", price: 40, description: "Comfortable room with heating" },
        { type: "Premium Room", price: 55, description: "Best room with panoramic views" },
      ],
      images: [
        "/images/hotel-langtang-guest.jpg",
        "/images/hotel-room-1.jpg",
        "/images/hotel-dining.jpg",
        "/images/hotel-breakfast.jpg",
      ],
      features: ["Glacier Views", "Yak Cheese Factory", "Buddhist Monastery", "Peaceful Environment"],
    },
    {
      id: "4",
      name: "Manaslu Tea House",
      location: "Samagaon, Manaslu Circuit",
      description: "Traditional tea house offering authentic mountain experience and local culture",
      image: "/images/hotel-manaslu-tea.jpg",
      rating: 4.5,
      reviews: 67,
      pricePerNight: 25,
      amenities: ["Cultural Experience", "Local Food", "Hot Tea", "Warm Hospitality", "Mountain Views"],
      roomTypes: [
        { type: "Dormitory", price: 25, description: "Shared room with other trekkers" },
        { type: "Private Room", price: 35, description: "Private room with basic amenities" },
        { type: "Deluxe Room", price: 45, description: "Better room with mountain views" },
      ],
      images: [
        "/images/hotel-manaslu-tea.jpg",
        "/images/hotel-room-2.jpg",
        "/images/hotel-dining.jpg",
        "/images/hotel-breakfast.jpg",
      ],
      features: ["Authentic Experience", "Local Culture", "Traditional Food", "Friendly Hosts"],
    },
  ]

  const paymentOptions = [
    {
      id: "cash",
      name: "Cash Payment",
      description: "Pay at the hotel during check-in",
      icon: "💵",
    },
    {
      id: "card",
      name: "Credit/Debit Card",
      description: "Secure online payment",
      icon: "💳",
    },
    {
      id: "esewa",
      name: "eSewa",
      description: "Digital wallet payment",
      icon: "📱",
    },
    {
      id: "khalti",
      name: "Khalti",
      description: "Digital wallet payment",
      icon: "📱",
    },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleBookNow = (hotel: any) => {
    setSelectedHotel(hotel)
    setShowBookingForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Calculate total price
    const selectedRoom = selectedHotel.roomTypes.find((room: any) => room.type === formData.roomType)
    const checkIn = new Date(formData.checkIn)
    const checkOut = new Date(formData.checkOut)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

    let totalPrice = selectedRoom ? selectedRoom.price * nights * Number.parseInt(formData.guests) : 0
    if (formData.addBreakfast) totalPrice += 10 * nights * Number.parseInt(formData.guests)
    if (formData.addLunch) totalPrice += 15 * nights * Number.parseInt(formData.guests)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Hotel Booking Confirmed!",
      description: `Your booking at ${selectedHotel.name} has been confirmed. Total: $${totalPrice}`,
    })

    setShowBookingForm(false)
    setSelectedHotel(null)
    setIsSubmitting(false)
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      checkIn: "",
      checkOut: "",
      guests: "2",
      roomType: "",
      paymentMethod: "",
      addBreakfast: false,
      addLunch: false,
      specialRequests: "",
    })
  }

  const calculateTotal = () => {
    if (!selectedHotel || !formData.roomType || !formData.checkIn || !formData.checkOut) return 0

    const selectedRoom = selectedHotel.roomTypes.find((room: any) => room.type === formData.roomType)
    const checkIn = new Date(formData.checkIn)
    const checkOut = new Date(formData.checkOut)
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))

    let total = selectedRoom ? selectedRoom.price * nights * Number.parseInt(formData.guests) : 0
    if (formData.addBreakfast) total += 10 * nights * Number.parseInt(formData.guests)
    if (formData.addLunch) total += 15 * nights * Number.parseInt(formData.guests)

    return total
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Trek Destination Hotels</h1>
          <p className="text-xl text-gray-600">
            Stay in comfortable accommodations along your trekking routes with authentic mountain hospitality
          </p>
        </div>
      </section>

      {/* Hotels Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {hotels.map((hotel) => (
              <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Hotel Images */}
                  <div className="relative">
                    <img
                      src={hotel.image || "/placeholder.svg"}
                      alt={hotel.name}
                      className="w-full h-64 md:h-full object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-gray-800">${hotel.pricePerNight}/night</Badge>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{hotel.rating}</span>
                    </div>
                  </div>

                  {/* Hotel Details */}
                  <CardContent className="p-6">
                    <div className="flex items-start gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-1 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{hotel.location}</span>
                    </div>

                    <h3 className="text-xl font-bold mb-3">{hotel.name}</h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">{hotel.description}</p>

                    {/* Amenities */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm mb-2">Amenities:</h4>
                      <div className="flex flex-wrap gap-1">
                        {hotel.amenities.slice(0, 4).map((amenity, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Room Types */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm mb-2">Room Types:</h4>
                      <div className="space-y-1">
                        {hotel.roomTypes.slice(0, 2).map((room, index) => (
                          <div key={index} className="flex justify-between text-xs">
                            <span>{room.type}</span>
                            <span className="font-medium">${room.price}/night</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Rating and Reviews */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{hotel.rating}</span>
                        <span className="text-sm text-gray-500">({hotel.reviews} reviews)</span>
                      </div>
                    </div>

                    <Button onClick={() => handleBookNow(hotel)} className="w-full bg-green-700 hover:bg-green-800">
                      Book This Hotel
                    </Button>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Hotel Features */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Trek Hotels?</h2>
            <p className="text-xl text-gray-600">Experience authentic mountain hospitality with modern comforts</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <Mountain className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Mountain Views</h3>
              <p className="text-sm text-gray-600">Wake up to breathtaking Himalayan vistas</p>
            </div>
            <div className="text-center">
              <Utensils className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Local Cuisine</h3>
              <p className="text-sm text-gray-600">Authentic Nepali and international dishes</p>
            </div>
            <div className="text-center">
              <Wifi className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Modern Amenities</h3>
              <p className="text-sm text-gray-600">WiFi, hot showers, and comfortable beds</p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Local Hospitality</h3>
              <p className="text-sm text-gray-600">Warm welcome from local families</p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {showBookingForm && selectedHotel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold">Book {selectedHotel.name}</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowBookingForm(false)}>
                ✕
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Hotel Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex gap-4">
                  <img
                    src={selectedHotel.image || "/placeholder.svg"}
                    alt={selectedHotel.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{selectedHotel.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{selectedHotel.location}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm">
                        {selectedHotel.rating} ({selectedHotel.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Booking Details */}
                <div className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Guest Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
                      </div>
                    </div>
                  </div>

                  {/* Stay Details */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Stay Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="checkIn">Check-in Date *</Label>
                        <Input
                          id="checkIn"
                          name="checkIn"
                          type="date"
                          value={formData.checkIn}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="checkOut">Check-out Date *</Label>
                        <Input
                          id="checkOut"
                          name="checkOut"
                          type="date"
                          value={formData.checkOut}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="guests">Number of Guests *</Label>
                        <Select
                          value={formData.guests}
                          onValueChange={(value) => setFormData({ ...formData, guests: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? "Guest" : "Guests"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="roomType">Room Type *</Label>
                        <Select
                          value={formData.roomType}
                          onValueChange={(value) => setFormData({ ...formData, roomType: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select room type" />
                          </SelectTrigger>
                          <SelectContent>
                            {selectedHotel.roomTypes.map((room: any) => (
                              <SelectItem key={room.type} value={room.type}>
                                {room.type} - ${room.price}/night
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Meal Add-ons */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Meal Add-ons</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <Checkbox
                          id="breakfast"
                          checked={formData.addBreakfast}
                          onCheckedChange={(checked) => setFormData({ ...formData, addBreakfast: checked as boolean })}
                        />
                        <div className="flex-1">
                          <Label htmlFor="breakfast" className="font-medium cursor-pointer">
                            Add Breakfast (+$10/person/day)
                          </Label>
                          <p className="text-sm text-gray-500">Traditional Nepali breakfast with tea/coffee</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 p-3 border rounded-lg">
                        <Checkbox
                          id="lunch"
                          checked={formData.addLunch}
                          onCheckedChange={(checked) => setFormData({ ...formData, addLunch: checked as boolean })}
                        />
                        <div className="flex-1">
                          <Label htmlFor="lunch" className="font-medium cursor-pointer">
                            Add Lunch (+$15/person/day)
                          </Label>
                          <p className="text-sm text-gray-500">Dal Bhat or international cuisine options</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Payment & Summary */}
                <div className="space-y-6">
                  {/* Payment Method */}
                  <div>
                    <Label className="text-base font-medium mb-4 block">Payment Method *</Label>
                    <RadioGroup
                      value={formData.paymentMethod}
                      onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                      className="space-y-3"
                    >
                      {paymentOptions.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50"
                        >
                          <RadioGroupItem value={option.id} id={option.id} />
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-2xl">{option.icon}</span>
                            <div>
                              <Label htmlFor={option.id} className="font-medium cursor-pointer">
                                {option.name}
                              </Label>
                              <p className="text-sm text-gray-500">{option.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Booking Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Booking Summary</h3>
                    {formData.roomType && formData.checkIn && formData.checkOut && (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Room: {formData.roomType}</span>
                          <span>
                            ${selectedHotel.roomTypes.find((r: any) => r.type === formData.roomType)?.price}/night
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Guests: {formData.guests}</span>
                          <span>
                            Nights:{" "}
                            {Math.ceil(
                              (new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) /
                                (1000 * 60 * 60 * 24),
                            )}
                          </span>
                        </div>
                        {formData.addBreakfast && (
                          <div className="flex justify-between">
                            <span>Breakfast</span>
                            <span>
                              +$
                              {10 *
                                Number.parseInt(formData.guests) *
                                Math.ceil(
                                  (new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) /
                                    (1000 * 60 * 60 * 24),
                                )}
                            </span>
                          </div>
                        )}
                        {formData.addLunch && (
                          <div className="flex justify-between">
                            <span>Lunch</span>
                            <span>
                              +$
                              {15 *
                                Number.parseInt(formData.guests) *
                                Math.ceil(
                                  (new Date(formData.checkOut).getTime() - new Date(formData.checkIn).getTime()) /
                                    (1000 * 60 * 60 * 24),
                                )}
                            </span>
                          </div>
                        )}
                        <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                          <span>Total:</span>
                          <span className="text-green-600">${calculateTotal()}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Special Requests */}
                  <div>
                    <Label htmlFor="specialRequests">Special Requests</Label>
                    <Textarea
                      id="specialRequests"
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      placeholder="Any special requirements, dietary restrictions, or requests..."
                      rows={3}
                    />
                  </div>

                  {/* Hotel Gallery */}
                  <div>
                    <h3 className="font-semibold mb-3">Hotel Gallery</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedHotel.images.slice(0, 4).map((image: string, index: number) => (
                        <img
                          key={index}
                          src={image || "/placeholder.svg"}
                          alt={`${selectedHotel.name} - Image ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6 border-t">
                <Button type="button" variant="outline" onClick={() => setShowBookingForm(false)} className="flex-1">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.paymentMethod || !formData.roomType}
                  className="flex-1 bg-green-700 hover:bg-green-800"
                >
                  {isSubmitting ? "Processing..." : `Confirm Booking - $${calculateTotal()}`}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
