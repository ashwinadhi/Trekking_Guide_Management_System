"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Calendar, MapPin, Loader2, User, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { BookingSuccessDialog } from "@/components/booking-success-dialog"
import {
  isValidEmail,
  isTenDigitPhone,
  isFullNameNoSpecial,
  sanitizeFullNameInput,
  normalizePhoneDigits,
} from "@/lib/form-validation"

export interface HelicopterOption {
  _id: string
  name: string
  type: string
  pilotName: string
  pricePerFlight: number
  capacity: number
  image: string
  soldOutDates: string[]
  departureHelipad: string
  landingHelipad: string
}

interface HelicopterBookingModalProps {
  isOpen: boolean
  onClose: () => void
  helicopter: HelicopterOption
}

export function HelicopterBookingModal({ isOpen, onClose, helicopter }: HelicopterBookingModalProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    departureHelipad: "",
    landingHelipad: "",
    startDate: "",
    endDate: "",
    passengers: "1",
  })

  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        departureHelipad: "",
        landingHelipad: "",
        passengers: "1",
      }))
    }
  }, [isOpen, helicopter])

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

  const formValid =
    isFullNameNoSpecial(formData.fullName) &&
    isValidEmail(formData.email) &&
    isTenDigitPhone(formData.phone) &&
    !!formData.departureHelipad &&
    !!formData.landingHelipad &&
    !!formData.startDate &&
    !!formData.endDate

  const calculateTotal = () => {
    if (!formData.startDate || !formData.endDate) return 0
    const start = new Date(formData.startDate).getTime()
    const end = new Date(formData.endDate).getTime()
    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)))
    return days * helicopter.pricePerFlight
  }

  const isDateDisabled = (dateStr: string) => {
    if (!helicopter.soldOutDates) return false
    return helicopter.soldOutDates.some((d) => d.split("T")[0] === dateStr)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formValid) {
      toast({
        title: "Check your details",
        description: "Use letters only for name, valid email, 10-digit phone, and complete all fields.",
        variant: "destructive",
      })
      return
    }
    if (isDateDisabled(formData.startDate) || isDateDisabled(formData.endDate)) {
      toast({
        title: "Date unavailable",
        description: "One of the selected dates is blocked for this aircraft.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/helicopter-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          helicopterId: helicopter._id,
          customerName: formData.fullName,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          departureHelipad: formData.departureHelipad,
          landingHelipad: formData.landingHelipad,
          startDate: formData.startDate,
          endDate: formData.endDate,
          passengers: Number(formData.passengers),
        }),
      })

      if (res.ok) {
        setShowSuccessDialog(true)
        onClose()
      } else {
        const err = await res.json()
        throw new Error(err.error)
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen && !showSuccessDialog) return null

  const totalAmount = calculateTotal()

  return (
    <>
      <BookingSuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        title="Charter requested"
        description="Your helicopter request has been sent to our flight desk."
      />
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative max-h-[95vh] w-full max-w-3xl overflow-y-auto border border-gold/25 bg-card">
            <button
              onClick={onClose}
              className="absolute right-6 top-6 z-10 border border-gold/20 p-2 text-stone hover:text-ivory"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col md:flex-row">
              <div className="space-y-6 border-r border-gold/20 bg-gold/5 p-8 md:w-72">
                <div className="aspect-square overflow-hidden border border-gold/20">
                  <img src={helicopter.image} alt={helicopter.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <h3 className="font-display text-xl text-ivory">{helicopter.name}</h3>
                  <p className="luxury-label mt-1">{helicopter.type}</p>
                </div>
                <div className="space-y-4 border-t border-gold/20 pt-6">
                  <div className="flex items-center gap-3">
                    <User size={18} className="text-gold" />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-stone">Pilot</p>
                      <p className="text-sm text-ivory">{helicopter.pilotName}</p>
                    </div>
                  </div>
                  <p className="text-sm text-stone">Up to {helicopter.capacity} passengers</p>
                </div>
                {totalAmount > 0 && (
                  <div className="border-t border-gold/20 pt-6">
                    <p className="luxury-label mb-1">Estimated total</p>
                    <p className="font-display text-4xl text-gold">${totalAmount}</p>
                  </div>
                )}
              </div>

              <div className="flex-1 p-8">
                <h2 className="mb-8 font-display text-2xl text-ivory">Flight details</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="luxury-label">Full name *</Label>
                      <Input name="fullName" value={formData.fullName} onChange={handleInputChange} required maxLength={100} />
                    </div>
                    <div className="space-y-2">
                      <Label className="luxury-label">Email *</Label>
                      <Input name="email" type="email" value={formData.email} onChange={handleInputChange} required maxLength={254} />
                    </div>
                    <div className="space-y-2">
                      <Label className="luxury-label">Phone * (10 digits)</Label>
                      <Input name="phone" value={formData.phone} onChange={handleInputChange} required maxLength={10} inputMode="numeric" />
                    </div>
                    <div className="space-y-2">
                      <Label className="luxury-label">Passengers</Label>
                      <Input
                        name="passengers"
                        type="number"
                        min={1}
                        max={helicopter.capacity}
                        value={formData.passengers}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="luxury-label">Departure helipad</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
                        <select
                          name="departureHelipad"
                          value={formData.departureHelipad}
                          onChange={handleInputChange}
                          required
                          className="h-12 w-full appearance-none border border-gold/20 bg-secondary pl-10 text-ivory outline-none focus:ring-2 focus:ring-gold/50"
                        >
                          <option value="">Select departure</option>
                          {helicopter.departureHelipad?.split(",").map((loc, i) => (
                            <option key={i} value={loc.trim()}>
                              {loc.trim()}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="luxury-label">Landing helipad</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
                        <select
                          name="landingHelipad"
                          value={formData.landingHelipad}
                          onChange={handleInputChange}
                          required
                          className="h-12 w-full appearance-none border border-gold/20 bg-secondary pl-10 text-ivory outline-none focus:ring-2 focus:ring-gold/50"
                        >
                          <option value="">Select landing</option>
                          {helicopter.landingHelipad?.split(",").map((loc, i) => (
                            <option key={i} value={loc.trim()}>
                              {loc.trim()}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="luxury-label">Start date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
                        <Input name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} required className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="luxury-label">End date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gold" />
                        <Input name="endDate" type="date" value={formData.endDate} onChange={handleInputChange} required className="pl-10" />
                      </div>
                    </div>
                  </div>
                  <Button type="submit" disabled={isSubmitting || !formValid} className="h-14 w-full uppercase tracking-[0.2em]">
                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                      <span className="flex items-center gap-2">
                        Confirm charter <CheckCircle2 size={18} />
                      </span>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
