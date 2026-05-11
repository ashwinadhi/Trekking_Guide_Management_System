"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X, Calendar, MapPin, Loader2, Package, MessageSquare, Users } from "lucide-react"
import { useCart, type CartItem } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { getSessionId } from "@/lib/session"

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItem[]
  total: number
}

export function CheckoutModal({ isOpen, onClose, cartItems, total }: CheckoutModalProps) {
  const { dispatch } = useCart()
  const { toast } = useToast()
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
        title: "Rental Request Submitted!",
        description: `Your gear rental request has been received. Total: $${total.toFixed(2)}`,
      })

      dispatch({ type: "CLEAR_CART" })
      dispatch({ type: "CLOSE_CART" })
      onClose()
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">Complete Your Rental</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-gray-300">
          {/* Order Summary */}
          <div className="bg-gray-800/50 rounded-2xl p-5 border border-gray-700/50">
            <h3 className="font-bold text-emerald-400 mb-4 flex items-center gap-2">
              <Package size={18} /> Order Summary Breakdown
            </h3>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-gray-900/40 p-3 rounded-xl border border-gray-800">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-white font-medium">{item.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                        ${item.price}/day × {item.quantity} qty × {item.rentalDays} days
                      </p>
                    </div>
                    <span className="font-bold text-white">${(item.price * item.quantity * item.rentalDays).toFixed(2)}</span>
                  </div>
                </div>
              ))}
              <div className="border-t border-gray-700 mt-4 pt-4 flex justify-between items-center px-2">
                <span className="font-bold text-white text-lg">Estimated Total:</span>
                <span className="text-3xl font-black text-emerald-400">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-white flex items-center gap-2"><Users size={18} className="text-gray-400" /> Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-xs uppercase tracking-wider text-gray-500">Full Name *</Label>
                <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required className="bg-gray-800 border-gray-700 text-white rounded-xl h-12" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-wider text-gray-500">Email Address *</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required className="bg-gray-800 border-gray-700 text-white rounded-xl h-12" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="phone" className="text-xs uppercase tracking-wider text-gray-500">Phone Number *</Label>
                <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required className="bg-gray-800 border-gray-700 text-white rounded-xl h-12" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-white">Delivery & Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-xs uppercase tracking-wider text-gray-500">Rental Start Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                  <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleInputChange} required className="bg-gray-800 border-gray-700 text-white rounded-xl h-12 pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-xs uppercase tracking-wider text-gray-500">Rental End Date *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                  <Input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleInputChange} required className="bg-gray-800 border-gray-700 text-white rounded-xl h-12 pl-10" />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="deliveryLocation" className="text-xs uppercase tracking-wider text-gray-500">Delivery Location / Hotel *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                  <Input id="deliveryLocation" name="deliveryLocation" value={formData.deliveryLocation} onChange={handleInputChange} required className="bg-gray-800 border-gray-700 text-white rounded-xl h-12 pl-10" placeholder="e.g. Radisson Hotel, Thamel" />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="specialRequests" className="text-xs uppercase tracking-wider text-gray-500">Special Requests / Notes</Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Textarea id="specialRequests" name="specialRequests" value={formData.specialRequests} onChange={handleInputChange} className="bg-gray-800 border-gray-700 text-white rounded-xl min-h-[100px] pl-10 pt-2.5" placeholder="Any specific requirements or notes for your rental..." />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 text-sm text-emerald-400">
            Payment will be collected during delivery/pickup. No upfront payment required.
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent border-gray-700 text-gray-400 hover:text-white rounded-xl h-12">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 font-bold"
            >
              {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : `Confirm Rental`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
