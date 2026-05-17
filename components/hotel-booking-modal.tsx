"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Calendar, MapPin, Loader2, Home, Users, Shield, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format, isSameDay } from "date-fns"
import {
  isValidEmail,
  isTenDigitPhone,
  isFullNameNoSpecial,
  sanitizeFullNameInput,
  normalizePhoneDigits,
} from "@/lib/form-validation"
import { DateRange } from "react-day-picker"

interface Room {
  type: "Standard" | "Deluxe";
  price: number;
  features: string[];
  amenities: string[];
  roomImages: string[];
  totalRooms: number;
  soldOutDates: string[];
}

interface Hotel {
  _id: string;
  name: string;
  rooms: Room[];
}

interface HotelBookingModalProps {
  isOpen: boolean
  onClose: () => void
  hotel: Hotel
  selectedRoomType: "Standard" | "Deluxe"
}

export function HotelBookingModal({ isOpen, onClose, hotel, selectedRoomType }: HotelBookingModalProps) {
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [furthestStepReached, setFurthestStepReached] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  })

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setFurthestStepReached(1);
      setDateRange(undefined);
    }
  }, [isOpen])

  const room = hotel?.rooms?.find(r => r.type === selectedRoomType) || hotel?.rooms?.[0];
  const disabledDates = room?.soldOutDates?.map(d => new Date(d)) || [];
  
  const isDateDisabled = (date: Date) => {
    if (date < new Date(new Date().setHours(0,0,0,0))) return true;
    return disabledDates.some(d => isSameDay(d, date));
  };

  const calculateTotal = () => {
    if (!dateRange?.from || !dateRange?.to) return 0;
    const start = dateRange.from.getTime();
    const end = dateRange.to.getTime();
    const nights = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    return nights * (room?.price || 0);
  }
  
  const totalAmount = calculateTotal();
  const nights = (dateRange?.from && dateRange?.to) ? Math.max(1, Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))) : 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  }

  const handleNext = () => {
    if (step === 1) {
      if (!dateRange?.from || !dateRange?.to) {
        toast({ title: "Action Required", description: "Please complete all booking details before proceeding.", variant: "destructive" });
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
      const res = await fetch("/api/hotel-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId: hotel._id,
          roomType: selectedRoomType,
          checkIn: dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : "",
          checkOut: dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : "",
          guestName: formData.fullName,
          guestEmail: formData.email,
          guestPhone: formData.phone
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast({
        title: "Booking Confirmed! 🎉",
        description: `Thank you for choosing Technie Trek. Your reservation for ${hotel.name} has been successfully submitted.`,
      })

      onClose()
    } catch (error: any) {
      toast({
        title: "Booking Unavailable",
        description: error.message || "We couldn't process your request at this time. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-50 z-[100] overflow-y-auto flex flex-col">
      {/* Header bar */}
      <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Home className="text-emerald-600"/> Hotel Booking</h2>
        <Button variant="ghost" onClick={onClose} className="rounded-full h-10 w-10 p-0 text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200">
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Selected Room Quick View */}
      <section className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <Home className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{hotel?.name}</p>
                <p className="text-xs text-gray-500 uppercase tracking-widest">{selectedRoomType} Room</p>
              </div>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-lg font-black text-emerald-600">${totalAmount || room?.price}</span>
              <span className="text-xs text-gray-500">{totalAmount ? "Estimated Total" : "Per Night"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Progress */}
      <section className="py-6 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {[
              { num: 1, label: "Stay Dates" },
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
                  <Calendar className="h-6 w-6 text-emerald-400" /> Select Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6 bg-white">
                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
                  <label className="text-sm font-bold text-gray-800 mb-4 block flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-emerald-600" /> Check-in & Check-out Dates *
                  </label>
                  <div className="flex justify-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                    <CalendarComponent
                      mode="range"
                      selected={dateRange}
                      onSelect={(range) => {
                        if (range?.from && range?.to) {
                          let current = new Date(range.from);
                          let hasSoldOut = false;
                          while (current <= range.to) {
                            if (isDateDisabled(current)) hasSoldOut = true;
                            current.setDate(current.getDate() + 1);
                          }
                          if (hasSoldOut) {
                            toast({ title: "Range includes sold out dates", variant: "destructive" });
                            setDateRange({ from: range.from });
                            return;
                          }
                        }
                        setDateRange(range as any);
                      }}
                      disabled={isDateDisabled}
                      modifiers={{ soldOut: disabledDates }}
                      modifiersClassNames={{ soldOut: "bg-red-500/10 text-red-600 font-bold line-through" }}
                      className="rounded-md"
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-gray-500">
                    <div className="w-3 h-3 bg-red-500/20 rounded-full border border-red-500/50" /> = Sold Out
                  </div>
                </div>
                
                {totalAmount > 0 && (
                  <div className="bg-emerald-50 rounded-xl p-6 mt-6 border border-emerald-100">
                    <h4 className="font-bold text-emerald-800 mb-3 text-lg">Stay Summary</h4>
                    <div className="space-y-2 text-emerald-900/80">
                      <p className="flex justify-between"><span>Room Type:</span> <span className="font-semibold text-emerald-900">{selectedRoomType} Room</span></p>
                      <p className="flex justify-between"><span>Duration:</span> <span className="font-semibold text-emerald-900">{nights} Night(s)</span></p>
                      <p className="flex justify-between"><span>Rate per night:</span> <span className="font-semibold text-emerald-900">${room?.price}</span></p>
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
                      <MapPin className="h-3 w-3" /> Stay Details
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500">Dates</p>
                        <p className="font-bold text-gray-900">{dateRange?.from && format(dateRange.from, 'MMM dd, yyyy')} to {dateRange?.to && format(dateRange.to, 'MMM dd, yyyy')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="font-bold text-gray-900">{nights} Night(s)</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Home className="h-3 w-3" /> Order Summary
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500">Hotel & Room</p>
                        <p className="font-bold text-gray-900">{hotel.name} - {selectedRoomType}</p>
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

                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-700 font-medium">
                  Payment will be collected at the hotel during check-in. No upfront payment required.
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
