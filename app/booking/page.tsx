"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Calendar,
  Users,
  CreditCard,
  Shield,
  CheckCircle,
  AlertCircle,
  User,
  Edit,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import Header from "@/components/header"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface GuideAvailability {
  date: string
  available: boolean
  booked?: boolean
  price?: number
}

interface Guide {
  id: string
  name: string
  expertise: string
  pricePerDay: number
  image: string
  availability: GuideAvailability[]
  rating: number
  experience: string
  languages: string[]
  bio: string
}

export default function BookingPage() {
  const [step, setStep] = useState(1)
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedGuideForCalendar, setSelectedGuideForCalendar] = useState<string>("")
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [bookingData, setBookingData] = useState({
    guide: "",
    serviceType: "",
    trek: "",
    startDate: "",
    groupSize: "",
    name: "",
    email: "",
    phone: "",
    country: "",
    emergencyContact: "",
    dietaryRequirements: "",
    medicalConditions: "",
    experience: "",
    specialRequests: "",
    agreeTerms: false,
    agreeInsurance: false,
  })
  const [selectedDateFromCalendar, setSelectedDateFromCalendar] = useState("")

  const { toast } = useToast()

  // Generate availability data for the next 3 months
  const generateAvailability = (guideId: string): GuideAvailability[] => {
    const availability: GuideAvailability[] = []
    const today = new Date()

    for (let i = 0; i < 90; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      // Simulate different availability patterns for different guides
      let available = true
      let booked = false

      if (guideId === "ashwin-guide") {
        // Ashwin is busy on weekends and some random days
        available = date.getDay() !== 0 && date.getDay() !== 6 && Math.random() > 0.2
        booked = !available && Math.random() > 0.5
      } else if (guideId === "prakash-guide") {
        // Prakash has different pattern
        available = Math.random() > 0.3
        booked = !available && Math.random() > 0.4
      } else {
        // Sara has another pattern
        available = Math.random() > 0.25
        booked = !available && Math.random() > 0.6
      }

      availability.push({
        date: date.toISOString().split("T")[0],
        available,
        booked,
        price: available ? (guideId === "ashwin-guide" ? 50 : guideId === "prakash-guide" ? 45 : 55) : undefined,
      })
    }

    return availability
  }

  const guides: Guide[] = [
    {
      id: "ashwin-guide",
      name: "Ashwin Sharma",
      expertise: "Everest Region",
      pricePerDay: 50,
      image: "/images/mountain-sunrise.jpg",
      rating: 4.9,
      experience: "12+ years",
      languages: ["English", "Nepali", "Hindi"],
      bio: "Expert Everest region guide with extensive high-altitude experience",
      availability: generateAvailability("ashwin-guide"),
    },
    {
      id: "prakash-guide",
      name: "Prakash Tamang",
      expertise: "Annapurna Region",
      pricePerDay: 45,
      image: "/images/annapurna-circuit.jpg",
      rating: 4.8,
      experience: "10+ years",
      languages: ["English", "Nepali", "Tamang"],
      bio: "Annapurna specialist with deep cultural knowledge",
      availability: generateAvailability("prakash-guide"),
    },
    {
      id: "sara-guide",
      name: "Sara Gurung",
      expertise: "Langtang Region",
      pricePerDay: 55,
      image: "/images/langtang-valley.jpg",
      rating: 4.7,
      experience: "8+ years",
      languages: ["English", "Nepali", "Gurung"],
      bio: "Langtang expert with focus on sustainable trekking",
      availability: generateAvailability("sara-guide"),
    },
  ]

  const serviceTypes = [
    { id: "trekking-guide", name: "Trekking Guide", description: "Experienced guide for your trek" },
    { id: "porter", name: "Porter", description: "Help carrying your luggage" },
    { id: "city-tour", name: "City Tour Guide", description: "Explore Kathmandu with a local guide" },
  ]

  const treks = [
    { id: "everest-base-camp", name: "Everest Base Camp Trek", duration: "14 days", price: 1850 },
    { id: "annapurna-circuit", name: "Annapurna Circuit Trek", duration: "12 days", price: 1450 },
    { id: "langtang-valley", name: "Langtang Valley Trek", duration: "8 days", price: 950 },
    { id: "manaslu-circuit", name: "Manaslu Circuit Trek", duration: "16 days", price: 2100 },
    { id: "gokyo-lakes", name: "Gokyo Lakes Trek", duration: "12 days", price: 1650 },
    { id: "upper-mustang", name: "Upper Mustang Trek", duration: "10 days", price: 1750 },
  ]

  const selectedGuide = guides.find((g) => g.id === bookingData.guide)
  const selectedServiceType = serviceTypes.find((s) => s.id === bookingData.serviceType)
  const selectedTrek = treks.find((t) => t.id === bookingData.trek)
  const totalPrice =
    selectedTrek && bookingData.groupSize
      ? selectedTrek.price * Number.parseInt(bookingData.groupSize || "1")
      : selectedGuide
        ? selectedGuide.pricePerDay * 10
        : 0

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
      // Scroll to the form section smoothly
      setTimeout(() => {
        const formSection = document.getElementById("booking-form-section")
        if (formSection) {
          formSection.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 100)
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
      // Scroll to the form section smoothly
      setTimeout(() => {
        const formSection = document.getElementById("booking-form-section")
        if (formSection) {
          formSection.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 100)
    }
  }

  const handleSubmit = () => {
    toast({
      title: "Booking Request Submitted! 🎉",
      description:
        "Thank you for your booking request. I'll contact you within 24 hours to confirm details and arrange payment.",
      duration: 5000,
    })
  }

  const handleGuideChange = (guideId: string) => {
    setBookingData({ ...bookingData, guide: guideId, startDate: "" })
    setSelectedDateFromCalendar("")
  }

  const handleEditGuide = () => {
    setStep(1)
    setTimeout(() => {
      const formSection = document.getElementById("booking-form-section")
      if (formSection) {
        formSection.scrollIntoView({ behavior: "smooth", block: "start" })
      }
    }, 100)
  }

  const openCalendar = (guideId: string) => {
    setSelectedGuideForCalendar(guideId)
    setShowCalendar(true)
  }

  const closeCalendar = () => {
    setShowCalendar(false)
    setSelectedGuideForCalendar("")
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  const isDateAvailable = (date: string, guideId: string) => {
    const guide = guides.find((g) => g.id === guideId)
    if (!guide) return false
    const availability = guide.availability.find((a) => a.date === date)
    return availability?.available || false
  }

  const isDateBooked = (date: string, guideId: string) => {
    const guide = guides.find((g) => g.id === guideId)
    if (!guide) return false
    const availability = guide.availability.find((a) => a.date === date)
    return availability?.booked || false
  }

  const handleDateClick = (date: string, guideId: string) => {
    if (isDateAvailable(date, guideId) && !isDateBooked(date, guideId)) {
      setSelectedDateFromCalendar(date)
      setBookingData({ ...bookingData, startDate: date })
      closeCalendar()
    }
  }

  const renderCalendar = () => {
    const guide = guides.find((g) => g.id === selectedGuideForCalendar)
    if (!guide) return null

    const daysInMonth = getDaysInMonth(currentMonth)
    const firstDay = getFirstDayOfMonth(currentMonth)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      const dateString = date.toISOString().split("T")[0]
      const isAvailable = isDateAvailable(dateString, selectedGuideForCalendar)
      const isBooked = isDateBooked(dateString, selectedGuideForCalendar)
      const isPast = date < new Date()

      let cellClass = "h-10 flex items-center justify-center text-sm cursor-pointer rounded "

      if (isPast) {
        cellClass += "text-gray-300 cursor-not-allowed"
      } else if (isBooked) {
        cellClass += "bg-red-100 text-red-600 cursor-not-allowed"
      } else if (isAvailable) {
        cellClass += "bg-green-100 text-green-700 hover:bg-green-200"
      } else {
        cellClass += "bg-gray-100 text-gray-400 cursor-not-allowed"
      }

      days.push(
        <div
          key={day}
          className={cellClass}
          onClick={() => {
            if (!isPast && !isBooked && isAvailable) {
              handleDateClick(dateString, selectedGuideForCalendar)
            }
          }}
          title={
            isPast
              ? "Past date"
              : isBooked
                ? "Already booked"
                : isAvailable
                  ? `Available - $${guide.pricePerDay}/day - Click to select`
                  : "Not available"
          }
        >
          {day}
        </div>,
      )
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{guide.name} - Availability</h3>
            <Button variant="ghost" size="sm" onClick={closeCalendar}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h4 className="font-medium">{formatDate(currentMonth)}</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 mb-4">{days}</div>

          {selectedDateFromCalendar && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Selected Date:</strong> {new Date(selectedDateFromCalendar).toLocaleDateString()}
              </p>
            </div>
          )}

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 rounded"></div>
              <span>Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 rounded"></div>
              <span>Not Available</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded">
            <p className="text-sm text-blue-800">
              <strong>Rate:</strong> ${guide.pricePerDay}/day
              <br />
              <strong>Experience:</strong> {guide.experience}
              <br />
              <strong>Rating:</strong> ⭐ {guide.rating}/5
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Book Your Trek</h1>
          <p className="text-xl text-gray-600">
            Secure your spot on an unforgettable Himalayan adventure. Complete the booking process in just a few simple
            steps.
          </p>
        </div>
      </section>

      {/* Selected Guide Display - Fixed at top when guide is selected */}
      {selectedGuide && step > 1 && (
        <section className="py-6 bg-green-50 border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-4">
                <img
                  src={selectedGuide.image || "/placeholder.svg"}
                  alt={selectedGuide.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg text-green-700">Selected Guide</h3>
                  <p className="font-medium">{selectedGuide.name}</p>
                  <p className="text-sm text-gray-600">
                    {selectedGuide.expertise} • ${selectedGuide.pricePerDay}/day
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditGuide}
                className="flex items-center gap-2 bg-transparent"
              >
                <Edit className="h-4 w-4" />
                Change Guide
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Progress Indicator */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-8">
            {/* Guide Selection Step */}
            <div className={`flex items-center ${step >= 1 ? "text-green-600" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-green-600 text-white" : "bg-gray-200"}`}
              >
                1
              </div>
              <span className="ml-2 font-medium">Guide Selection</span>
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? "bg-green-600" : "bg-gray-200"}`}></div>

            {/* Service Selection Step */}
            <div className={`flex items-center ${step >= 2 ? "text-green-600" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-green-600 text-white" : "bg-gray-200"}`}
              >
                2
              </div>
              <span className="ml-2 font-medium">Service Selection</span>
            </div>
            <div className={`w-16 h-1 ${step >= 3 ? "bg-green-600" : "bg-gray-200"}`}></div>

            {/* Personal Details Step */}
            <div className={`flex items-center ${step >= 3 ? "text-green-600" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-green-600 text-white" : "bg-gray-200"}`}
              >
                3
              </div>
              <span className="ml-2 font-medium">Personal Details</span>
            </div>
            <div className={`w-16 h-1 ${step >= 4 ? "bg-green-600" : "bg-gray-200"}`}></div>

            {/* Confirmation Step */}
            <div className={`flex items-center ${step >= 4 ? "text-green-600" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 4 ? "bg-green-600 text-white" : "bg-gray-200"}`}
              >
                4
              </div>
              <span className="ml-2 font-medium">Confirmation</span>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking-form-section" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              {/* Guide Selection Step */}
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-green-600" />
                      Step 1: Select Your Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="guide">Choose a Guide *</Label>
                      <div className="grid grid-cols-1 gap-4 mt-4">
                        {guides.map((guide) => (
                          <div
                            key={guide.id}
                            className={`border rounded-lg p-4 cursor-pointer transition-all ${
                              bookingData.guide === guide.id
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200 hover:border-green-300"
                            }`}
                            onClick={() => handleGuideChange(guide.id)}
                          >
                            <div className="flex items-center gap-4">
                              <img
                                src={guide.image || "/placeholder.svg"}
                                alt={guide.name}
                                className="w-16 h-16 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-lg">{guide.name}</h3>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      openCalendar(guide.id)
                                    }}
                                    className="text-blue-600 hover:text-blue-800 p-1 h-auto"
                                  >
                                    <Calendar className="h-4 w-4 mr-1" />
                                    View Calendar
                                  </Button>
                                </div>
                                <p className="text-gray-600">{guide.expertise}</p>
                                <div className="flex items-center gap-4 mt-1">
                                  <p className="text-green-600 font-medium">${guide.pricePerDay}/day</p>
                                  <p className="text-sm text-gray-500">⭐ {guide.rating}/5</p>
                                  <p className="text-sm text-gray-500">{guide.experience}</p>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{guide.bio}</p>
                                <p className="text-xs text-gray-500 mt-1">Languages: {guide.languages.join(", ")}</p>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  name="guide"
                                  value={guide.id}
                                  checked={bookingData.guide === guide.id}
                                  onChange={() => handleGuideChange(guide.id)}
                                  className="w-4 h-4 text-green-600"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Tip:</strong> Click "View Calendar" next to any guide to see their availability and
                        select your preferred dates directly from their calendar.
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={handleNext}
                        disabled={!bookingData.guide}
                        className="bg-green-700 hover:bg-green-800"
                      >
                        Next Step
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Service Selection Step */}
              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-green-600" />
                      Step 2: Select Your Service
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="serviceType">Choose Service Type *</Label>
                      <Select onValueChange={(value) => setBookingData({ ...bookingData, serviceType: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceTypes.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.name} - {service.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="trek">Choose Trek Package (Optional)</Label>
                      <Select onValueChange={(value) => setBookingData({ ...bookingData, trek: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a trek package" />
                        </SelectTrigger>
                        <SelectContent>
                          {treks.map((trek) => (
                            <SelectItem key={trek.id} value={trek.id}>
                              {trek.name} - {trek.duration} - ${trek.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate">Preferred Start Date *</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={bookingData.startDate}
                          onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
                          required
                        />
                        {selectedDateFromCalendar && bookingData.startDate === selectedDateFromCalendar && (
                          <p className="text-sm text-green-600 mt-1">
                            ✓ Selected from {selectedGuide?.name}'s calendar
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="groupSize">Group Size *</Label>
                        <Select onValueChange={(value) => setBookingData({ ...bookingData, groupSize: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Number of trekkers" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 person</SelectItem>
                            <SelectItem value="2">2 people</SelectItem>
                            <SelectItem value="3">3 people</SelectItem>
                            <SelectItem value="4">4 people</SelectItem>
                            <SelectItem value="5">5 people</SelectItem>
                            <SelectItem value="6">6 people</SelectItem>
                            <SelectItem value="7">7 people</SelectItem>
                            <SelectItem value="8">8 people</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {selectedTrek && (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Selected Trek Details:</h3>
                        <div className="space-y-1 text-sm">
                          <p>
                            <strong>Trek:</strong> {selectedTrek.name}
                          </p>
                          <p>
                            <strong>Duration:</strong> {selectedTrek.duration}
                          </p>
                          <p>
                            <strong>Price per person:</strong> ${selectedTrek.price}
                          </p>
                          {bookingData.groupSize && (
                            <p>
                              <strong>Total for {bookingData.groupSize} people:</strong> ${totalPrice}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={handlePrevious}>
                        Previous
                      </Button>
                      <Button
                        onClick={handleNext}
                        disabled={!bookingData.serviceType || !bookingData.startDate || !bookingData.groupSize}
                        className="bg-green-700 hover:bg-green-800"
                      >
                        Next Step
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Personal Information Step */}
              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-600" />
                      Step 3: Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={bookingData.name}
                          onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={bookingData.email}
                          onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          value={bookingData.phone}
                          onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                          placeholder="+1-234-567-8900"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country *</Label>
                        <Input
                          id="country"
                          value={bookingData.country}
                          onChange={(e) => setBookingData({ ...bookingData, country: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="emergencyContact">Emergency Contact (Name & Phone) *</Label>
                      <Input
                        id="emergencyContact"
                        value={bookingData.emergencyContact}
                        onChange={(e) => setBookingData({ ...bookingData, emergencyContact: e.target.value })}
                        placeholder="John Doe, +1-234-567-8900"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="experience">Trekking Experience</Label>
                      <Select onValueChange={(value) => setBookingData({ ...bookingData, experience: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner (First time trekking)</SelectItem>
                          <SelectItem value="some">Some experience (1-3 treks)</SelectItem>
                          <SelectItem value="experienced">Experienced (4+ treks)</SelectItem>
                          <SelectItem value="expert">Expert (High altitude experience)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="dietaryRequirements">Dietary Requirements</Label>
                      <Input
                        id="dietaryRequirements"
                        value={bookingData.dietaryRequirements}
                        onChange={(e) => setBookingData({ ...bookingData, dietaryRequirements: e.target.value })}
                        placeholder="Vegetarian, allergies, etc."
                      />
                    </div>

                    <div>
                      <Label htmlFor="medicalConditions">Medical Conditions or Medications</Label>
                      <Textarea
                        id="medicalConditions"
                        value={bookingData.medicalConditions}
                        onChange={(e) => setBookingData({ ...bookingData, medicalConditions: e.target.value })}
                        placeholder="Please list any medical conditions, medications, or health concerns..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="specialRequests">Special Requests</Label>
                      <Textarea
                        id="specialRequests"
                        value={bookingData.specialRequests}
                        onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                        placeholder="Any special requests, celebrations, or additional services..."
                        rows={3}
                      />
                    </div>

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={handlePrevious}>
                        Previous
                      </Button>
                      <Button
                        onClick={handleNext}
                        disabled={
                          !bookingData.name ||
                          !bookingData.email ||
                          !bookingData.phone ||
                          !bookingData.country ||
                          !bookingData.emergencyContact
                        }
                        className="bg-green-700 hover:bg-green-800"
                      >
                        Next Step
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Confirmation Step */}
              {step === 4 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Step 4: Review & Confirm
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="font-semibold mb-4">Booking Summary</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          {selectedGuide && (
                            <>
                              <p>
                                <strong>Guide:</strong> {selectedGuide?.name}
                              </p>
                              <p>
                                <strong>Expertise:</strong> {selectedGuide?.expertise}
                              </p>
                            </>
                          )}
                          <p>
                            <strong>Service Type:</strong> {selectedServiceType?.name}
                          </p>
                          {selectedTrek && (
                            <>
                              <p>
                                <strong>Trek:</strong> {selectedTrek?.name}
                              </p>
                              <p>
                                <strong>Duration:</strong> {selectedTrek?.duration}
                              </p>
                            </>
                          )}
                          <p>
                            <strong>Start Date:</strong> {bookingData.startDate}
                          </p>
                          <p>
                            <strong>Group Size:</strong> {bookingData.groupSize} people
                          </p>
                        </div>
                        <div>
                          <p>
                            <strong>Lead Trekker:</strong> {bookingData.name}
                          </p>
                          <p>
                            <strong>Email:</strong> {bookingData.email}
                          </p>
                          <p>
                            <strong>Phone:</strong> {bookingData.phone}
                          </p>
                          <p>
                            <strong>Country:</strong> {bookingData.country}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold">Total Cost:</span>
                          <span className="text-2xl font-bold text-green-700">${totalPrice}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          *Final price may vary based on group size and additional services
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="terms"
                          checked={bookingData.agreeTerms}
                          onCheckedChange={(checked) =>
                            setBookingData({ ...bookingData, agreeTerms: checked as boolean })
                          }
                        />
                        <Label htmlFor="terms" className="text-sm leading-relaxed">
                          I agree to the{" "}
                          <Link href="/terms" className="text-green-600 underline">
                            Terms and Conditions
                          </Link>{" "}
                          and
                          <Link href="/cancellation-policy" className="text-green-600 underline ml-1">
                            Cancellation Policy
                          </Link>
                        </Label>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="insurance"
                          checked={bookingData.agreeInsurance}
                          onCheckedChange={(checked) =>
                            setBookingData({ ...bookingData, agreeInsurance: checked as boolean })
                          }
                        />
                        <Label htmlFor="insurance" className="text-sm leading-relaxed">
                          I understand that travel insurance is mandatory and I will arrange appropriate coverage before
                          the trek
                        </Label>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="text-sm">
                          <p className="font-semibold text-blue-900 mb-1">Next Steps:</p>
                          <ul className="space-y-1 text-blue-800">
                            <li>1. I'll contact you within 24 hours to confirm availability</li>
                            <li>2. We'll arrange a pre-trek briefing (in person or video call)</li>
                            <li>3. Payment can be made via bank transfer or PayPal (50% deposit required)</li>
                            <li>4. I'll provide detailed packing list and preparation guidelines</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={handlePrevious}>
                        Previous
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={!bookingData.agreeTerms || !bookingData.agreeInsurance}
                        className="bg-green-700 hover:bg-green-800"
                      >
                        Submit Booking Request
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    Booking Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Licensed & Insured Guide</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Secure Payment Processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Flexible Cancellation Policy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">24/7 Emergency Support</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-green-600" />
                    Payment Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <p className="font-medium mb-2">Accepted Payment Methods:</p>
                    <ul className="space-y-1">
                      <li>• Bank Transfer (Preferred)</li>
                      <li>• PayPal</li>
                      <li>• Western Union</li>
                      <li>• Cash (in Kathmandu)</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <p className="text-sm text-green-800">
                      <strong>Payment Schedule:</strong>
                      <br />
                      50% deposit to confirm booking
                      <br />
                      50% balance before trek start
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Have questions about booking or need assistance? I'm here to help!
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      WhatsApp: +977-9841234567
                    </Button>
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      Email: ashwin@technietrek.com
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Calendar Modal */}
      {showCalendar && renderCalendar()}

      <Toaster />
    </div>
  )
}
