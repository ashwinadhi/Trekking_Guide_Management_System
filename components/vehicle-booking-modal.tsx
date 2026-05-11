"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Calendar, MapPin, Loader2, Car, User, CheckCircle2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
      setFormData(prev => ({
        ...prev,
        pickupLocation: "",
        dropOffLocation: "",
      }))
    }
  }, [isOpen, vehicle])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Helper to calculate total days and price
  const calculateTotal = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate).getTime();
    const end = new Date(formData.endDate).getTime();
    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    return days * vehicle.pricePerDay;
  }

  const isDateDisabled = (dateStr: string) => {
    if (!vehicle.soldOutDates) return false;
    return vehicle.soldOutDates.some(d => d.split('T')[0] === dateStr);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if dates are blocked
    if (isDateDisabled(formData.startDate) || isDateDisabled(formData.endDate)) {
      toast({ title: "Date Unavailable", description: "One of the selected dates is blocked for this vehicle.", variant: "destructive" });
      return;
    }

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
        toast({ title: "Booking Confirmed!", description: "Your vehicle request has been sent to our logistics team." })
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

  if (!isOpen) return null

  const totalAmount = calculateTotal();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-gray-950 border border-gray-800 rounded-[2.5rem] max-w-3xl w-full max-h-[95vh] overflow-y-auto shadow-[0_0_50px_-12px_rgba(16,185,129,0.25)] relative">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-gray-900 border border-gray-800 text-gray-500 hover:text-white rounded-2xl transition-all z-10">
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Left Side: Vehicle Summary */}
          <div className="md:w-72 bg-emerald-500/5 border-r border-gray-800 p-8 space-y-6">
            <div className="space-y-4">
              <div className="aspect-square rounded-3xl overflow-hidden border border-emerald-500/20">
                <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{vehicle.name}</h3>
                <p className="text-xs text-emerald-500 font-black uppercase tracking-widest">{vehicle.type}</p>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-800">
              <div className="flex items-center gap-3">
                <User size={18} className="text-gray-500" />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Assigned Driver</p>
                  <p className="text-sm font-semibold text-white">{vehicle.driverName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Car size={18} className="text-gray-500" />
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Daily Rate</p>
                  <p className="text-sm font-semibold text-white">${vehicle.pricePerDay}</p>
                </div>
              </div>
            </div>

            {totalAmount > 0 && (
              <div className="pt-8 border-t border-gray-800">
                <p className="text-xs text-gray-500 uppercase font-black tracking-widest mb-1">Estimated Total</p>
                <p className="text-4xl font-black text-emerald-500">${totalAmount}</p>
              </div>
            )}
          </div>

          {/* Right Side: Form */}
          <div className="flex-1 p-8">
            <h2 className="text-2xl font-bold text-white mb-8">Booking Details</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-black text-gray-500 tracking-widest">Full Name</Label>
                  <Input name="fullName" value={formData.fullName} onChange={handleInputChange} required className="bg-gray-900 border-gray-800 rounded-2xl h-12 text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-black text-gray-500 tracking-widest">Email Address</Label>
                  <Input name="email" type="email" value={formData.email} onChange={handleInputChange} required className="bg-gray-900 border-gray-800 rounded-2xl h-12 text-white" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-xs uppercase font-black text-gray-500 tracking-widest">Phone Number</Label>
                  <Input name="phone" value={formData.phone} onChange={handleInputChange} required className="bg-gray-900 border-gray-800 rounded-2xl h-12 text-white" />
                </div>

                {/* Pickup & Drop-off Selects (Parsed from comma-separated string) */}
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-black text-gray-500 tracking-widest">Pickup Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                    <select 
                      name="pickupLocation" 
                      value={formData.pickupLocation} 
                      onChange={handleInputChange} 
                      required 
                      className="w-full bg-gray-900 border border-gray-800 rounded-2xl h-12 pl-10 text-white outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none"
                    >
                      <option value="">Select Pickup</option>
                      {vehicle.pickupLocation?.split(",").map((loc, i) => (
                        <option key={i} value={loc.trim()}>{loc.trim()}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-black text-gray-500 tracking-widest">Drop-off Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                    <select 
                      name="dropOffLocation" 
                      value={formData.dropOffLocation} 
                      onChange={handleInputChange} 
                      required 
                      className="w-full bg-gray-900 border border-gray-800 rounded-2xl h-12 pl-10 text-white outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none"
                    >
                      <option value="">Select Drop-off</option>
                      {vehicle.dropOffLocation?.split(",").map((loc, i) => (
                        <option key={i} value={loc.trim()}>{loc.trim()}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Dates with soldOut check */}
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-black text-gray-500 tracking-widest">Start Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                    <Input 
                      name="startDate" 
                      type="date" 
                      value={formData.startDate} 
                      onChange={handleInputChange} 
                      required 
                      className={`bg-gray-900 border-gray-800 rounded-2xl h-12 pl-10 text-white ${isDateDisabled(formData.startDate) ? 'border-red-500 text-red-500' : ''}`} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase font-black text-gray-500 tracking-widest">End Date</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500" />
                    <Input 
                      name="endDate" 
                      type="date" 
                      value={formData.endDate} 
                      onChange={handleInputChange} 
                      required 
                      className={`bg-gray-900 border-gray-800 rounded-2xl h-12 pl-10 text-white ${isDateDisabled(formData.endDate) ? 'border-red-500 text-red-500' : ''}`} 
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-14 font-black uppercase tracking-widest shadow-xl shadow-emerald-900/20"
                >
                  {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : (
                    <span className="flex items-center gap-2">Confirm Booking <CheckCircle2 size={18} /></span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
