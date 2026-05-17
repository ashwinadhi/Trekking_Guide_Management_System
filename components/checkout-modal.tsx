"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X, Calendar, MapPin, Loader2, Package, MessageSquare, Users, Shield, CheckCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart, type CartItem } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { getSessionId } from "@/lib/session"
import {
  isValidEmail,
  isTenDigitPhone,
  isFullNameNoSpecial,
  isAddressText,
  isSpecialRequestsText,
  sanitizeFullNameInput,
  normalizePhoneDigits,
} from "@/lib/form-validation"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItem[]
  total: number
}

export function CheckoutModal({ isOpen, onClose, cartItems, total }: CheckoutModalProps) {
  const { dispatch } = useCart()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [furthestStepReached, setFurthestStepReached] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    deliveryLocation: "",
    startDate: "",
    endDate: "",
    specialRequests: "",
  })

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setFurthestStepReached(1);
      setFormData(prev => ({
        ...prev,
        deliveryLocation: "",
        startDate: "",
        endDate: "",
        specialRequests: "",
      }))
    }
  }, [isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleNext = () => {
    if (step === 1) {
      if (!formData.startDate || !formData.endDate || !isAddressText(formData.deliveryLocation) || !isSpecialRequestsText(formData.specialRequests)) {
        toast({ title: "Action Required", description: "Please complete all rental details and ensure location/notes meet minimum lengths.", variant: "destructive" });
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
      const sessionId = getSessionId()
      const res = await fetch("/api/rentals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.fullName,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          startDate: formData.startDate,
          endDate: formData.endDate,
          deliveryLocation: formData.deliveryLocation,
          specialRequests: formData.specialRequests,
          items: cartItems.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            dailyPrice: item.price
          })),
          totalPrice: total,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Rental booking failed")
      }

      toast({
        title: "Rental Request Submitted! 🎉",
        description: `Thank you for choosing Technie Trek. Your gear rental request has been successfully submitted.`,
      })

      dispatch({ type: "CLEAR_CART" })
      dispatch({ type: "CLOSE_CART" })
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
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Package className="text-emerald-600"/> Equipment Rental Checkout</h2>
        <Button variant="ghost" onClick={onClose} className="rounded-full h-10 w-10 p-0 text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200">
          <X className="h-5 w-5" />
        </Button>
      </div>

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
                  <Package className="h-6 w-6 text-emerald-400" /> Rental Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6 bg-white">
                
                {/* Order Summary */}
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 mb-6">
                  <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-widest">Order Summary</h3>
                  <div className="space-y-3">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-start pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                        <div>
                          <p className="text-gray-900 font-medium">{item.name}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                            ${item.price}/day × {item.quantity} qty × {item.rentalDays} days
                          </p>
                        </div>
                        <span className="font-bold text-emerald-600">${(item.price * item.quantity * item.rentalDays).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="pt-3 flex justify-between items-center">
                      <span className="font-bold text-gray-900">Estimated Total:</span>
                      <span className="text-2xl font-black text-emerald-600">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Dates */}
                  <div>
                    <Label className="text-gray-700 font-semibold mb-2 block">Rental Start Date *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                      <Input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} required className="bg-gray-50 border-gray-200 rounded-xl h-12 pl-10" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-700 font-semibold mb-2 block">Rental End Date *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                      <Input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} required className="bg-gray-50 border-gray-200 rounded-xl h-12 pl-10" />
                    </div>
                  </div>
                  
                  {/* Location & Notes */}
                  <div className="md:col-span-2">
                    <Label className="text-gray-700 font-semibold mb-2 block">Delivery Location / Hotel *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                      <Input name="deliveryLocation" value={formData.deliveryLocation} onChange={handleInputChange} required minLength={5} className="bg-gray-50 border-gray-200 rounded-xl h-12 pl-10" placeholder="e.g. Radisson Hotel, Thamel" />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-gray-700 font-semibold mb-2 block">Special Requests / Notes *</Label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Textarea name="specialRequests" value={formData.specialRequests} onChange={handleInputChange} required minLength={5} maxLength={2000} className="bg-gray-50 border-gray-200 rounded-xl min-h-[100px] pl-10 pt-3" placeholder="Any specific requirements (required)..." />
                    </div>
                  </div>
                </div>

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
                      <MapPin className="h-3 w-3" /> Delivery Details
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500">Dates</p>
                        <p className="font-bold text-gray-900">{formData.startDate} to {formData.endDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="font-bold text-gray-900">{formData.deliveryLocation}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Package className="h-3 w-3" /> Order Summary
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500">Items</p>
                        <p className="font-bold text-gray-900">{cartItems.length} equipment items</p>
                      </div>
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                        <p className="text-xs text-emerald-600 font-bold uppercase">Total Amount Due</p>
                        <p className="text-2xl font-black text-emerald-900">${total.toFixed(2)}</p>
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
                  Payment will be collected during delivery/pickup. No upfront payment required.
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
