"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Calendar, MapPin, Loader2, Car, User, CheckCircle, Shield, Users, CreditCard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import {
  isValidEmail,
  isTenDigitPhone,
  isFullNameNoSpecial,
  sanitizeFullNameInput,
  normalizePhoneDigits,
} from "@/lib/form-validation"

interface Vehicle {
  _id: string;
  name: string;
  type: string;
  driverName: string;
  pricePerDay: number;
  image: string;
  soldOutDates: string[];
  pickupLocation: string;
  dropOffLocation: string;
}

interface VehicleBookingModalProps {
  isOpen: boolean
  onClose: () => void
  vehicle: Vehicle
}

export function VehicleBookingModal({ isOpen, onClose, vehicle }: VehicleBookingModalProps) {
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [furthestStepReached, setFurthestStepReached] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    pickupLocation: "",
    dropOffLocation: "",
    startDate: "",
    endDate: "",
  })

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setFurthestStepReached(1);
      setFormData(prev => ({
        ...prev,
        pickupLocation: "",
        dropOffLocation: "",
        startDate: "",
        endDate: "",
      }))
    }
  }, [isOpen, vehicle])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === "fullName") {
      setFormData({ ...formData, fullName: sanitizeFullNameInput(value) })
      return
    }
    if (name === "phone") {
      setFormData({ ...formData, phone: normalizePhoneDigits(value) })
      return
    }
    if (name === "email") {
      setFormData({ ...formData, email: value.trimStart() })
      return
    }
    setFormData({ ...formData, [name]: value })
  }

  const isDateDisabled = (dateStr: string) => {
    if (!vehicle.soldOutDates) return false;
    return vehicle.soldOutDates.some(d => d.split('T')[0] === dateStr);
  }

  const calculateTotal = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate).getTime();
    const end = new Date(formData.endDate).getTime();
    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    return days * vehicle.pricePerDay;
  }

  const totalAmount = calculateTotal();

  const handleNext = () => {
    if (step === 1) {
      if (!formData.startDate || !formData.endDate || !formData.pickupLocation || !formData.dropOffLocation) {
        toast({ title: "Action Required", description: "Please complete all booking details before proceeding.", variant: "destructive" });
        return;
      }
      if (isDateDisabled(formData.startDate) || isDateDisabled(formData.endDate)) {
        toast({ title: "Dates Unavailable", description: "Selected dates are fully booked. Please choose alternative dates.", variant: "destructive" });
        return;
      }
    } else if (step === 2) {
      const personalDetailsValid =
        isFullNameNoSpecial(formData.fullName) &&
        isValidEmail(formData.email) &&
        isTenDigitPhone(formData.phone);
      
      if (!personalDetailsValid) {
        toast({ title: "Action Required", description: "Please ensure your personal details are formatted correctly.", variant: "destructive" });
        return;
      }
    }

    if (step < 3) {
      setFurthestStepReached(Math.max(furthestStepReached, step + 1));
      setStep(step + 1);
    }
  }

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/vehicle-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: vehicle._id,
          vehicleName: vehicle.name,
          customerName: formData.fullName,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          pickupLocation: formData.pickupLocation,
          dropOffLocation: formData.dropOffLocation,
          startDate: formData.startDate,
          endDate: formData.endDate,
          pricePerDay: vehicle.pricePerDay,
        }),
      })

      if (res.ok) {
        toast({ title: "Booking Confirmed! 🎉", description: "Thank you for choosing Technie Trek. Your vehicle request has been successfully submitted." })
        onClose()
      } else {
        const err = await res.json()
        throw new Error(err.error)
      }
    } catch (error: any) {
      toast({ title: "Booking Unavailable", description: error.message || "We couldn't process your request at this time. Please try again.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-50 z-[100] overflow-y-auto flex flex-col">
      {/* Header bar for full-screen modal */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Car className="text-emerald-600"/> Vehicle Booking</h2>
        <Button variant="ghost" onClick={onClose} className="rounded-full h-10 w-10 p-0 text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200">
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Selected Vehicle Quick View */}
      <section className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={vehicle.image || "/placeholder.svg"} alt={vehicle.name} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
              <div>
                <p className="font-bold text-gray-900 text-sm">{vehicle.name}</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest">{vehicle.type}</p>
              </div>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-lg font-black text-emerald-600">${totalAmount || vehicle.pricePerDay}</span>
              <span className="text-xs text-gray-500">{totalAmount ? "Estimated Total" : "Per Day"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Progress */}
      <section className="py-6 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {[
              { num: 1, label: "Details" },
              { num: 2, label: "Personal" },
              { num: 3, label: "Confirm" }
            ].map((s, idx) => {
              const headingClickable = s.num < step && s.num <= furthestStepReached;
              return (
              <div key={s.num} className="flex items-center">
                <div
                  onClick={() => headingClickable && setStep(s.num)}
                  className={`flex items-center gap-2 transition-opacity select-none ${headingClickable ? "cursor-pointer hover:opacity-80" : "cursor-default"} ${step >= s.num ? "text-emerald-600" : "text-gray-400"}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s.num ? "bg-emerald-600 text-white" : "bg-gray-100"}`}>
                    {s.num}
                  </div>
                  <span className="hidden sm:inline font-medium text-sm">{s.label}</span>
                </div>
                {idx < 2 && <div className={`w-12 h-0.5 mx-4 ${step > s.num ? "bg-emerald-600" : "bg-gray-200"}`} />}
              </div>
            )})}
          </div>
        </div>
      </section>

      <section className="py-12 flex-grow bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          
          {step === 1 && (
            <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-emerald-900 text-white px-8 py-6">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Calendar className="h-6 w-6 text-emerald-400" /> Booking Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Pickups */}
                  <div>
                    <Label className="text-gray-700 font-semibold mb-2 block">Pickup Location *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                      <select name="pickupLocation" value={formData.pickupLocation} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl h-12 pl-10 text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none">
                        <option value="">Select Pickup</option>
                        {vehicle.pickupLocation?.split(",").map((loc, i) => <option key={i} value={loc.trim()}>{loc.trim()}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-700 font-semibold mb-2 block">Drop-off Location *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                      <select name="dropOffLocation" value={formData.dropOffLocation} onChange={handleInputChange} className="w-full bg-gray-50 border border-gray-200 rounded-xl h-12 pl-10 text-gray-900 outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none">
                        <option value="">Select Drop-off</option>
                        {vehicle.dropOffLocation?.split(",").map((loc, i) => <option key={i} value={loc.trim()}>{loc.trim()}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Dates */}
                  <div>
                    <Label className="text-gray-700 font-semibold mb-2 block">Start Date *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                      <Input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className={`bg-gray-50 border-gray-200 rounded-xl h-12 pl-10 ${isDateDisabled(formData.startDate) ? 'border-red-500 text-red-500' : ''}`} />
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-700 font-semibold mb-2 block">End Date *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                      <Input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} className={`bg-gray-50 border-gray-200 rounded-xl h-12 pl-10 ${isDateDisabled(formData.endDate) ? 'border-red-500 text-red-500' : ''}`} />
                    </div>
                  </div>
                </div>
                
                {totalAmount > 0 && (
                  <div className="bg-emerald-50 rounded-xl p-6 mt-6 border border-emerald-100">
                    <h4 className="font-bold text-emerald-800 mb-3 text-lg">Trip Summary</h4>
                    <div className="space-y-2 text-emerald-900/80">
                      <p className="flex justify-between"><span>Vehicle:</span> <span className="font-semibold text-emerald-900">{vehicle.name}</span></p>
                      <p className="flex justify-between"><span>Daily Rate:</span> <span className="font-semibold text-emerald-900">${vehicle.pricePerDay}</span></p>
                      <p className="flex justify-between pt-2 border-t border-emerald-200 mt-2">
                        <span className="font-bold text-emerald-800">Total Price:</span> 
                        <span className="font-bold text-emerald-800">${totalAmount}</span>
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end mt-8 pt-6 border-t border-gray-100">
                  <Button onClick={handleNext} className="bg-emerald-700 hover:bg-emerald-800 rounded-xl h-12 px-8 font-bold text-white shadow-lg shadow-emerald-700/20">Next Step</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-emerald-900 text-white px-8 py-6">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Users className="h-6 w-6 text-emerald-400" /> Personal Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-gray-700 font-semibold mb-2 block">Full Name *</Label>
                    <Input name="fullName" value={formData.fullName} onChange={handleInputChange} maxLength={100} required className="bg-gray-50 border-gray-200 rounded-xl h-12" />
                  </div>
                  <div>
                    <Label className="text-gray-700 font-semibold mb-2 block">Email Address *</Label>
                    <Input name="email" type="email" value={formData.email} onChange={handleInputChange} maxLength={254} required className="bg-gray-50 border-gray-200 rounded-xl h-12" />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-gray-700 font-semibold mb-2 block">Phone Number * (10 digits)</Label>
                    <Input name="phone" value={formData.phone} onChange={handleInputChange} maxLength={10} inputMode="numeric" required className="bg-gray-50 border-gray-200 rounded-xl h-12" />
                  </div>
                </div>

                <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                  <Button variant="outline" onClick={handlePrevious} className="rounded-xl h-12 px-6">Back</Button>
                  <Button onClick={handleNext} className="bg-emerald-700 hover:bg-emerald-800 rounded-xl h-12 px-8 font-bold text-white shadow-lg shadow-emerald-700/20">Review Booking</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-emerald-900 text-white px-8 py-6">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Shield className="h-6 w-6 text-emerald-400" /> Review & Confirm
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <MapPin className="h-3 w-3" /> Trip Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                          <Car className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Vehicle</p>
                          <p className="font-bold text-gray-900">{vehicle.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Dates</p>
                          <p className="font-bold text-gray-900">{formData.startDate} to {formData.endDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <CreditCard className="h-3 w-3" /> Summary
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500">Locations</p>
                        <p className="font-bold text-gray-900">{formData.pickupLocation} to {formData.dropOffLocation}</p>
                      </div>
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                        <p className="text-xs text-emerald-600 font-bold uppercase">Total Amount Due</p>
                        <p className="text-2xl font-black text-emerald-900">${totalAmount}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Users className="h-3 w-3" /> Personal Information
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    <div>
                      <p className="text-xs text-gray-500">Full Name</p>
                      <p className="font-semibold text-gray-900">{formData.fullName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-semibold text-gray-900 truncate">{formData.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-semibold text-gray-900">{formData.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t border-gray-100">
                  <Button variant="outline" onClick={handlePrevious} className="flex-1 h-14 rounded-2xl font-bold border-gray-200">
                    Back to Edit
                  </Button>
                  <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 h-14 rounded-2xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-600/20">
                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <CheckCircle className="h-5 w-5 mr-2" />}
                    Confirm Booking
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}
