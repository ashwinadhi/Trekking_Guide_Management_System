"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { X, CreditCard, Wallet, DollarSign } from "lucide-react"
import { useCart, type CartItem } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"

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
    pickupLocation: "",
    returnLocation: "",
    pickupDate: "",
    returnDate: "",
    paymentMethod: "",
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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Equipment Rental Booked!",
      description: `Your equipment rental has been confirmed. Total: $${total.toFixed(2)}`,
    })

    dispatch({ type: "CLEAR_CART" })
    dispatch({ type: "CLOSE_CART" })
    onClose()
    setIsSubmitting(false)
  }

  if (!isOpen) return null

  const paymentOptions = [
    {
      id: "cash",
      name: "Cash Payment",
      description: "Pay when you pick up the equipment",
      icon: DollarSign,
    },
    {
      id: "card",
      name: "Credit/Debit Card",
      description: "Secure online payment",
      icon: CreditCard,
    },
    {
      id: "esewa",
      name: "eSewa",
      description: "Digital wallet payment",
      icon: Wallet,
    },
    {
      id: "khalti",
      name: "Khalti",
      description: "Digital wallet payment",
      icon: Wallet,
    },
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Complete Your Rental</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Order Summary</h3>
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} (x{item.quantity}, {item.rentalDays} days)
                  </span>
                  <span>${(item.price * item.quantity * item.rentalDays).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total:</span>
                <span className="text-green-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required />
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
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required />
            </div>
          </div>

          {/* Pickup & Return Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pickupLocation">Pickup Location *</Label>
              <Input
                id="pickupLocation"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleInputChange}
                placeholder="e.g., Thamel, Kathmandu"
                required
              />
            </div>
            <div>
              <Label htmlFor="returnLocation">Return Location *</Label>
              <Input
                id="returnLocation"
                name="returnLocation"
                value={formData.returnLocation}
                onChange={handleInputChange}
                placeholder="e.g., Thamel, Kathmandu"
                required
              />
            </div>
            <div>
              <Label htmlFor="pickupDate">Pickup Date *</Label>
              <Input
                id="pickupDate"
                name="pickupDate"
                type="date"
                value={formData.pickupDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="returnDate">Return Date *</Label>
              <Input
                id="returnDate"
                name="returnDate"
                type="date"
                value={formData.returnDate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <Label className="text-base font-medium mb-4 block">Payment Method *</Label>
            <RadioGroup
              value={formData.paymentMethod}
              onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {paymentOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2 border rounded-lg p-3 hover:bg-gray-50">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <div className="flex items-center gap-3 flex-1">
                    <option.icon className="h-5 w-5 text-gray-600" />
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

          {/* Special Requests */}
          <div>
            <Label htmlFor="specialRequests">Special Requests</Label>
            <Textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleInputChange}
              placeholder="Any special requirements or notes..."
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.paymentMethod}
              className="flex-1 bg-green-700 hover:bg-green-800"
            >
              {isSubmitting ? "Processing..." : `Confirm Rental - $${total.toFixed(2)}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
