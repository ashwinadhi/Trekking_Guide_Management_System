"use client"

import { useState } from "react"
import Link from "next/link"
import { AlertTriangle, Phone, MapPin, Shield, Users, Heart, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function EmergencyPage() {
  const [sosActivated, setSosActivated] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)

  const emergencyContacts = [
    {
      name: "Ashwin Shrestha (Your Guide)",
      phone: "+977-9841234567",
      whatsapp: "+977-9841234567",
      available: "24/7 during trek",
      priority: "primary",
    },
    {
      name: "Nepal Police Emergency",
      phone: "100",
      available: "24/7",
      priority: "emergency",
    },
    {
      name: "Tourist Police Kathmandu",
      phone: "+977-1-4247041",
      available: "24/7",
      priority: "emergency",
    },
    {
      name: "Himalayan Rescue Association",
      phone: "+977-1-4440292",
      available: "24/7",
      priority: "medical",
    },
    {
      name: "CIWEC Clinic (Kathmandu)",
      phone: "+977-1-4424111",
      available: "24/7 Emergency",
      priority: "medical",
    },
  ]

  const handleSOS = () => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setSosActivated(true)
          // In real implementation, this would send emergency alert
          console.log("SOS Activated at:", position.coords.latitude, position.coords.longitude)
        },
        (error) => {
          console.error("Error getting location:", error)
          setSosActivated(true) // Still activate SOS even without location
        },
      )
    } else {
      setSosActivated(true)
    }
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
                <Link href="/treks" className="text-gray-700 hover:text-green-700 px-3 py-2 text-sm font-medium">
                  Treks
                </Link>
                <Link href="/emergency" className="text-gray-900 hover:text-green-700 px-3 py-2 text-sm font-medium">
                  Emergency
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-green-700 px-3 py-2 text-sm font-medium">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* SOS Alert */}
        {sosActivated && (
          <Alert className="mb-8 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>SOS ACTIVATED!</strong> Emergency alert has been sent to your guide and emergency services.
              {location && (
                <span className="block mt-1">
                  Location: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Emergency SOS Button */}
        <Card className="mb-8 border-red-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-red-600 flex items-center justify-center gap-2">
              <AlertTriangle className="h-8 w-8" />
              Emergency SOS
            </CardTitle>
            <p className="text-gray-600">
              Press this button only in case of real emergency. It will immediately alert your guide and emergency
              services.
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <Button
              onClick={handleSOS}
              disabled={sosActivated}
              className="bg-red-600 hover:bg-red-700 text-white text-xl py-6 px-12 rounded-full"
              size="lg"
            >
              {sosActivated ? (
                <>
                  <Zap className="h-6 w-6 mr-2 animate-pulse" />
                  SOS ACTIVATED
                </>
              ) : (
                <>
                  <AlertTriangle className="h-6 w-6 mr-2" />
                  EMERGENCY SOS
                </>
              )}
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              This will share your GPS location and send alerts to all emergency contacts
            </p>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-6 w-6 text-green-600" />
              Emergency Contacts
            </CardTitle>
            <p className="text-gray-600">Important numbers to call in case of emergency</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emergencyContacts.map((contact, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    contact.priority === "primary"
                      ? "border-green-200 bg-green-50"
                      : contact.priority === "emergency"
                        ? "border-red-200 bg-red-50"
                        : "border-blue-200 bg-blue-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{contact.name}</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <a
                          href={`tel:${contact.phone}`}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          <Phone className="h-4 w-4" />
                          {contact.phone}
                        </a>
                        {contact.whatsapp && (
                          <a
                            href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}`}
                            className="text-green-600 hover:text-green-800 text-sm"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            WhatsApp
                          </a>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Available: {contact.available}</p>
                    </div>
                    <Badge
                      variant={
                        contact.priority === "primary"
                          ? "default"
                          : contact.priority === "emergency"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {contact.priority === "primary"
                        ? "Your Guide"
                        : contact.priority === "emergency"
                          ? "Emergency"
                          : "Medical"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Procedures */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Heart className="h-6 w-6" />
                Medical Emergency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm">
                <li>1. Stay calm and assess the situation</li>
                <li>2. Call your guide immediately</li>
                <li>3. If serious, activate SOS button</li>
                <li>4. Provide first aid if trained</li>
                <li>5. Prepare for evacuation if needed</li>
                <li>6. Contact insurance company</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <MapPin className="h-6 w-6" />
                Lost or Separated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm">
                <li>1. Stop and stay where you are</li>
                <li>2. Call your guide immediately</li>
                <li>3. Share your GPS location</li>
                <li>4. Stay warm and conserve energy</li>
                <li>5. Make yourself visible</li>
                <li>6. Don't wander further</li>
              </ol>
            </CardContent>
          </Card>
        </div>

        {/* Safety Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-green-600" />
              Safety Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Before You Trek</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Share your itinerary with family/friends</li>
                  <li>• Get comprehensive travel insurance</li>
                  <li>• Carry emergency cash (USD/NPR)</li>
                  <li>• Download offline maps</li>
                  <li>• Bring satellite communicator if possible</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">During Your Trek</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Stay with your group</li>
                  <li>• Follow your guide's instructions</li>
                  <li>• Inform guide of any health issues</li>
                  <li>• Carry emergency contacts</li>
                  <li>• Keep phone charged with power bank</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Trek Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6 text-blue-600" />
              Your Current Trek Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p>
                  <strong>Trek:</strong> Everest Base Camp
                </p>
                <p>
                  <strong>Guide:</strong> Ashwin Shrestha
                </p>
                <p>
                  <strong>Start Date:</strong> March 15, 2024
                </p>
                <p>
                  <strong>Group Size:</strong> 4 people
                </p>
              </div>
              <div>
                <p>
                  <strong>Current Location:</strong> Namche Bazaar
                </p>
                <p>
                  <strong>Next Stop:</strong> Tengboche
                </p>
                <p>
                  <strong>Emergency Contact:</strong> +977-9841234567
                </p>
                <p>
                  <strong>Insurance:</strong> World Nomads Policy #12345
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
