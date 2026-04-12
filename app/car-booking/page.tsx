"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Calendar,
  Clock,
  User,
  Car,
  Phone,
  Star,
  CheckCircle,
  AlertCircle,
  X,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Banknote,
  Smartphone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface CarAvailability {
  date: string
  timeSlots: {
    time: string
    available: boolean
    booked?: boolean
  }[]
}

interface Driver {
  id: string
  name: string
  experience: string
  rating: number
  languages: string[]
  image: string
  phone: string
  bio: string
}

interface CarModel {
  id: string
  name: string
  type: string
  capacity: string
  features: string[]
  pricePerKm: number
  image: string
  plateNumber: string
  driver: Driver
  availability: CarAvailability[]
}

export default function CarBookingPage() {
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [selectedCarForBooking, setSelectedCarForBooking] = useState<string>("")
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedCarForCalendar, setSelectedCarForCalendar] = useState<string>("")
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDateForTimeSlots, setSelectedDateForTimeSlots] = useState("")
  const [bookingData, setBookingData] = useState({
    car: "",
    pickupDate: "",
    pickupTime: "",
    pickupLocation: "",
    dropoffLocation: "",
    name: "",
    email: "",
    phone: "",
    specialRequests: "",
    paymentMethod: "",
  })

  const { toast } = useToast()

  // Generate availability data for cars
  const generateCarAvailability = (): CarAvailability[] => {
    const availability: CarAvailability[] = []
    const today = new Date()

    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      const timeSlots = [
        "06:00",
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
      ].map((time) => ({
        time,
        available: Math.random() > 0.3,
        booked: Math.random() > 0.7,
      }))

      availability.push({
        date: date.toISOString().split("T")[0],
        timeSlots,
      })
    }

    return availability
  }

  const drivers: Driver[] = [
    {
      id: "ram-driver",
      name: "Ram Bahadur Thapa",
      experience: "15+ years",
      rating: 4.9,
      languages: ["English", "Nepali", "Hindi"],
      image: "/images/driver-ram.jpg",
      phone: "+977-9841234567",
      bio: "Experienced driver with excellent knowledge of Nepal's roads and tourist destinations.",
    },
    {
      id: "shyam-driver",
      name: "Shyam Kumar Gurung",
      experience: "12+ years",
      rating: 4.8,
      languages: ["English", "Nepali", "Gurung"],
      image: "/images/driver-shyam.jpg",
      phone: "+977-9841234568",
      bio: "Professional driver specializing in mountain routes and long-distance travel.",
    },
    {
      id: "hari-driver",
      name: "Hari Prasad Sharma",
      experience: "10+ years",
      rating: 4.7,
      languages: ["English", "Nepali"],
      image: "/images/driver-hari.jpg",
      phone: "+977-9841234569",
      bio: "Reliable and friendly driver with expertise in city and highway driving.",
    },
  ]

  const carModels: CarModel[] = [
    {
      id: "toyota-hiace",
      name: "Toyota Hiace",
      type: "Van",
      capacity: "12-15 passengers",
      features: ["Air Conditioning", "Comfortable Seating", "Large Luggage Space", "Mountain Ready"],
      pricePerKm: 25,
      image: "/images/toyota-hiace.jpg",
      plateNumber: "BA 1 CHA 1234",
      driver: drivers[0],
      availability: generateCarAvailability(),
    },
    {
      id: "mahindra-scorpio",
      name: "Mahindra Scorpio",
      type: "SUV",
      capacity: "7 passengers",
      features: ["4WD", "Air Conditioning", "Powerful Engine", "Off-road Capable"],
      pricePerKm: 20,
      image: "/images/mahindra-scorpio.jpg",
      plateNumber: "BA 2 CHA 5678",
      driver: drivers[1],
      availability: generateCarAvailability(),
    },
    {
      id: "tata-sumo",
      name: "Tata Sumo",
      type: "SUV",
      capacity: "9 passengers",
      features: ["Spacious Interior", "Air Conditioning", "Reliable", "Good for Groups"],
      pricePerKm: 18,
      image: "/images/tata-sumo.jpg",
      plateNumber: "BA 3 CHA 9012",
      driver: drivers[2],
      availability: generateCarAvailability(),
    },
    {
      id: "suzuki-swift",
      name: "Suzuki Swift",
      type: "Hatchback",
      capacity: "4 passengers",
      features: ["Fuel Efficient", "Air Conditioning", "City Friendly", "Compact"],
      pricePerKm: 12,
      image: "/images/suzuki-swift.jpg",
      plateNumber: "BA 4 CHA 3456",
      driver: drivers[0],
      availability: generateCarAvailability(),
    },
    {
      id: "hyundai-creta",
      name: "Hyundai Creta",
      type: "SUV",
      capacity: "5 passengers",
      features: ["Modern Interior", "Air Conditioning", "Comfortable Ride", "Bluetooth"],
      pricePerKm: 22,
      image: "/images/hyundai-creta.jpg",
      plateNumber: "BA 5 CHA 7890",
      driver: drivers[1],
      availability: generateCarAvailability(),
    },
  ]

  const selectedCarModel = carModels.find((car) => car.id === bookingData.car)

  // Calculate estimated fare based on distance (mock calculation)
  const calculateEstimatedFare = (pickup: string, dropoff: string, pricePerKm: number) => {
    if (!pickup || !dropoff) return 0

    // Mock distance calculation - in real app, you'd use Google Maps API
    const mockDistances: { [key: string]: number } = {
      "kathmandu-pokhara": 200,
      "kathmandu-chitwan": 150,
      "kathmandu-airport": 8,
      "pokhara-chitwan": 120,
      "kathmandu-bhaktapur": 15,
      "kathmandu-patan": 10,
      default: 50,
    }

    const routeKey = `${pickup.toLowerCase()}-${dropoff.toLowerCase()}`
    const reverseRouteKey = `${dropoff.toLowerCase()}-${pickup.toLowerCase()}`

    const distance = mockDistances[routeKey] || mockDistances[reverseRouteKey] || mockDistances.default
    return distance * pricePerKm
  }

  const estimatedFare = selectedCarModel
    ? calculateEstimatedFare(bookingData.pickupLocation, bookingData.dropoffLocation, selectedCarModel.pricePerKm)
    : 0

  const handleCarSelect = (carId: string) => {
    setSelectedCarForBooking(carId)
    setBookingData({ ...bookingData, car: carId })
    setShowBookingForm(true)
  }

  const closeBookingForm = () => {
    setShowBookingForm(false)
    setSelectedCarForBooking("")
    setBookingData({
      car: "",
      pickupDate: "",
      pickupTime: "",
      pickupLocation: "",
      dropoffLocation: "",
      name: "",
      email: "",
      phone: "",
      specialRequests: "",
      paymentMethod: "",
    })
  }

  const openCalendar = (carId: string) => {
    setSelectedCarForCalendar(carId)
    setShowCalendar(true)
  }

  const closeCalendar = () => {
    setShowCalendar(false)
    setSelectedCarForCalendar("")
    setSelectedDateForTimeSlots("")
  }

  const handleDateTimeSelect = (date: string, time: string) => {
    setBookingData({ ...bookingData, pickupDate: date, pickupTime: time })
    closeCalendar()
  }

  const handleSubmit = () => {
    if (
      !bookingData.car ||
      !bookingData.pickupDate ||
      !bookingData.pickupTime ||
      !bookingData.pickupLocation ||
      !bookingData.dropoffLocation ||
      !bookingData.name ||
      !bookingData.email ||
      !bookingData.phone ||
      !bookingData.paymentMethod
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including payment method before submitting.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Car Booking Request Submitted! 🚗",
      description: `Your booking for ${selectedCarModel?.name} has been submitted. We'll contact you within 30 minutes to confirm availability and payment details.`,
      duration: 5000,
    })

    closeBookingForm()
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

  const renderCalendar = () => {
    const car = carModels.find((c) => c.id === selectedCarForCalendar)
    if (!car) return null

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
      const isPast = date < new Date()
      const dayAvailability = car.availability.find((a) => a.date === dateString)
      const hasAvailableSlots = dayAvailability?.timeSlots.some((slot) => slot.available && !slot.booked)

      let cellClass = "h-10 flex items-center justify-center text-sm cursor-pointer rounded "

      if (isPast) {
        cellClass += "text-gray-300 cursor-not-allowed"
      } else if (hasAvailableSlots) {
        cellClass += "bg-green-100 text-green-700 hover:bg-green-200"
      } else {
        cellClass += "bg-gray-100 text-gray-400 cursor-not-allowed"
      }

      days.push(
        <div
          key={day}
          className={cellClass}
          onClick={() => {
            if (!isPast && hasAvailableSlots) {
              setSelectedDateForTimeSlots(dateString)
            }
          }}
          title={
            isPast ? "Past date" : hasAvailableSlots ? "Available - Click to select time" : "No available time slots"
          }
        >
          {day}
        </div>,
      )
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{car.name} - Availability</h3>
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

          {selectedDateForTimeSlots && (
            <TimeSlotSelector car={car} selectedDate={selectedDateForTimeSlots} onTimeSelect={handleDateTimeSelect} />
          )}

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 rounded"></div>
              <span>Not Available</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded">
            <p className="text-sm text-blue-800">
              <strong>Rate:</strong> NPR {car.pricePerKm}/km
              <br />
              <strong>Driver:</strong> {car.driver.name}
              <br />
              <strong>Contact:</strong> {car.driver.phone}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const TimeSlotSelector = ({
    car,
    selectedDate,
    onTimeSelect,
  }: {
    car: CarModel
    selectedDate: string
    onTimeSelect: (date: string, time: string) => void
  }) => {
    const dayAvailability = car.availability.find((a) => a.date === selectedDate)
    if (!dayAvailability) return null

    return (
      <div className="mb-4">
        <h4 className="font-medium mb-2">Available Time Slots for {new Date(selectedDate).toLocaleDateString()}</h4>
        <div className="grid grid-cols-3 gap-2">
          {dayAvailability.timeSlots.map((slot) => (
            <Button
              key={slot.time}
              variant={slot.available && !slot.booked ? "outline" : "ghost"}
              size="sm"
              disabled={!slot.available || slot.booked}
              onClick={() => onTimeSelect(selectedDate, slot.time)}
              className={`text-xs ${
                slot.available && !slot.booked
                  ? "hover:bg-green-50 hover:border-green-300"
                  : "cursor-not-allowed opacity-50"
              }`}
            >
              {slot.time}
            </Button>
          ))}
        </div>
      </div>
    )
  }

  const renderBookingForm = () => {
    const car = carModels.find((c) => c.id === selectedCarForBooking)
    if (!car) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Car className="h-6 w-6 text-blue-600" />
              Book {car.name}
            </h2>
            <Button variant="ghost" size="sm" onClick={closeBookingForm}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-6 space-y-6">
            {/* Selected Vehicle Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Selected Vehicle:</h3>
              <div className="flex items-center gap-4">
                <Image
                  src={car.image || "/placeholder.svg"}
                  alt={car.name}
                  width={120}
                  height={80}
                  className="rounded object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-lg">{car.name}</h4>
                  <p className="text-gray-600">
                    {car.capacity} • NPR {car.pricePerKm}/km
                  </p>
                  <p className="text-gray-600">Plate: {car.plateNumber}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Image
                      src={car.driver.image || "/placeholder.svg"}
                      alt={car.driver.name}
                      width={24}
                      height={24}
                      className="rounded-full object-cover"
                    />
                    <span className="text-sm text-gray-600">
                      Driver: {car.driver.name} ({car.driver.phone})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Date and Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pickupDate">Pickup Date *</Label>
                <div className="flex gap-2">
                  <Input
                    id="pickupDate"
                    type="date"
                    value={bookingData.pickupDate}
                    onChange={(e) => setBookingData({ ...bookingData, pickupDate: e.target.value })}
                    required
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openCalendar(car.id)}
                    className="px-3"
                    title="Check availability calendar"
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="pickupTime">Pickup Time *</Label>
                <Select onValueChange={(value) => setBookingData({ ...bookingData, pickupTime: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pickup time" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "06:00",
                      "07:00",
                      "08:00",
                      "09:00",
                      "10:00",
                      "11:00",
                      "12:00",
                      "13:00",
                      "14:00",
                      "15:00",
                      "16:00",
                      "17:00",
                      "18:00",
                    ].map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {bookingData.pickupDate && bookingData.pickupTime && (
                  <p className="text-sm text-green-600 mt-1">✓ Date and time selected</p>
                )}
              </div>
            </div>

            {/* Location Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pickupLocation">Pickup Location *</Label>
                <Select onValueChange={(value) => setBookingData({ ...bookingData, pickupLocation: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pickup location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kathmandu">Kathmandu</SelectItem>
                    <SelectItem value="pokhara">Pokhara</SelectItem>
                    <SelectItem value="chitwan">Chitwan</SelectItem>
                    <SelectItem value="airport">Tribhuvan Airport</SelectItem>
                    <SelectItem value="bhaktapur">Bhaktapur</SelectItem>
                    <SelectItem value="patan">Patan</SelectItem>
                    <SelectItem value="nagarkot">Nagarkot</SelectItem>
                    <SelectItem value="dhulikhel">Dhulikhel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dropoffLocation">Drop-off Location *</Label>
                <Select onValueChange={(value) => setBookingData({ ...bookingData, dropoffLocation: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select drop-off location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kathmandu">Kathmandu</SelectItem>
                    <SelectItem value="pokhara">Pokhara</SelectItem>
                    <SelectItem value="chitwan">Chitwan</SelectItem>
                    <SelectItem value="airport">Tribhuvan Airport</SelectItem>
                    <SelectItem value="bhaktapur">Bhaktapur</SelectItem>
                    <SelectItem value="patan">Patan</SelectItem>
                    <SelectItem value="nagarkot">Nagarkot</SelectItem>
                    <SelectItem value="dhulikhel">Dhulikhel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Estimated Fare */}
            {estimatedFare > 0 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Estimated Fare:</h3>
                <div className="text-2xl font-bold text-green-700">NPR {estimatedFare}</div>
                <p className="text-sm text-gray-600 mt-1">
                  *Final fare may vary based on actual distance and route conditions
                </p>
              </div>
            )}

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={bookingData.phone}
                  onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                  placeholder="+977-9841234567"
                  required
                />
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <Label className="text-base font-semibold">Payment Method *</Label>
              <RadioGroup
                value={bookingData.paymentMethod}
                onValueChange={(value) => setBookingData({ ...bookingData, paymentMethod: value })}
                className="mt-3"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Banknote className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">Cash Payment</div>
                        <div className="text-sm text-gray-500">Pay directly to driver</div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">Credit/Debit Card</div>
                        <div className="text-sm text-gray-500">Secure online payment</div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50">
                    <RadioGroupItem value="esewa" id="esewa" />
                    <Label htmlFor="esewa" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Smartphone className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">eSewa</div>
                        <div className="text-sm text-gray-500">Digital wallet payment</div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-gray-50">
                    <RadioGroupItem value="khalti" id="khalti" />
                    <Label htmlFor="khalti" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Smartphone className="h-5 w-5 text-purple-600" />
                      <div>
                        <div className="font-medium">Khalti</div>
                        <div className="text-sm text-gray-500">Digital wallet payment</div>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Special Requests */}
            <div>
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Textarea
                id="specialRequests"
                value={bookingData.specialRequests}
                onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                placeholder="Any special requests, stops, or additional services..."
                rows={3}
              />
            </div>

            {/* Terms and Conditions */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-blue-900 mb-1">Booking Terms:</p>
                  <ul className="space-y-1 text-blue-800">
                    <li>• 50% advance payment required to confirm booking</li>
                    <li>• Free cancellation up to 24 hours before pickup</li>
                    <li>• Driver will contact you 30 minutes before pickup</li>
                    <li>• Fuel and toll charges included in the fare</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={closeBookingForm}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="bg-green-700 hover:bg-green-800 text-white px-8" size="lg">
                <Car className="mr-2 h-4 w-4" />
                Submit Booking Request
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Car Booking Service</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Book reliable and comfortable transportation for your Nepal journey. Professional drivers, well-maintained
            vehicles, and competitive rates.
          </p>
        </div>
      </section>

      {/* Car Selection */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Choose Your Vehicle</h2>
            <p className="text-xl text-gray-600">
              Select from our fleet of well-maintained vehicles with experienced drivers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {carModels.map((car) => (
              <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-all">
                <div className="relative h-48">
                  <Image src={car.image || "/placeholder.svg"} alt={car.name} fill className="object-cover" />
                  <Badge className="absolute top-4 left-4 bg-blue-500">{car.type}</Badge>
                  <Badge className="absolute top-4 right-4 bg-green-500">NPR {car.pricePerKm}/km</Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{car.name}</h3>
                      <p className="text-gray-600 text-sm">Plate: {car.plateNumber}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openCalendar(car.id)}
                      className="text-blue-600 hover:text-blue-800 border-blue-200 hover:border-blue-300"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Check Availability
                    </Button>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <User className="h-4 w-4" />
                    <span>{car.capacity}</span>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {car.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Image
                        src={car.driver.image || "/placeholder.svg"}
                        alt={car.driver.name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-sm">{car.driver.name}</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600">{car.driver.rating}/5</span>
                          <span className="text-xs text-gray-400">• {car.driver.experience}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">{car.driver.bio}</p>
                    <p className="text-xs text-gray-500 mt-1">Languages: {car.driver.languages.join(", ")}</p>
                  </div>

                  <div className="mt-4">
                    <Button
                      className="w-full bg-green-700 hover:bg-green-800 text-white"
                      onClick={() => handleCarSelect(car.id)}
                    >
                      <Car className="mr-2 h-4 w-4" />
                      Book This Vehicle
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Our Car Service?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Licensed Drivers</h3>
              <p className="text-gray-600">All our drivers are licensed, experienced, and background-verified</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Well-Maintained Fleet</h3>
              <p className="text-gray-600">Regular maintenance and safety checks ensure reliable transportation</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">24/7 Availability</h3>
              <p className="text-gray-600">Book anytime, anywhere with our round-the-clock service</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Customer Support</h3>
              <p className="text-gray-600">Dedicated support team available for assistance during your journey</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      {showBookingForm && renderBookingForm()}
      {showCalendar && renderCalendar()}

      <Footer />
      <Toaster />
    </div>
  )
}
