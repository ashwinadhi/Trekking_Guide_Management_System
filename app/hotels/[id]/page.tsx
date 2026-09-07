"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { MapPin, CheckCircle, Wifi, Coffee, Loader2, Calendar as CalendarIcon, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useToast } from "@/hooks/use-toast";
import { BookingSuccessDialog } from "@/components/booking-success-dialog";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay } from "date-fns";
import {
  isValidEmail,
  isTenDigitPhone,
  isFullNameNoSpecial,
  sanitizeFullNameInput,
  normalizePhoneDigits,
} from "@/lib/form-validation";

interface Room {
  type: "Standard" | "Deluxe";
  price: number;
  features: string[];
  amenities: string[];
  roomImages: string[];
  totalRooms: number;
  soldOutDates: string[];
}

interface Destination {
  _id: string;
  title: string;
}

interface Hotel {
  _id: string;
  name: string;
  description: string;
  images: string[];
  amenities: string[];
  destinationId: Destination;
  rooms: Room[];
}

export default function HotelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [selectedRoom, setSelectedRoom] = useState<"Standard" | "Deluxe">("Standard");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  useEffect(() => {
    async function fetchHotel() {
      try {
        const res = await fetch(`/api/hotels/${params.id}`);
        if (res.ok) setHotel(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (params.id) fetchHotel();
  }, [params.id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateRange.from || !dateRange.to || !guestName || !guestEmail || !guestPhone) {
      toast({ title: "Please fill all fields and select dates", variant: "destructive" });
      return;
    }
    if (!isFullNameNoSpecial(guestName)) {
      toast({ title: "Invalid name", description: "Use letters and spaces only.", variant: "destructive" });
      return;
    }
    if (!isValidEmail(guestEmail)) {
      toast({ title: "Invalid email", variant: "destructive" });
      return;
    }
    if (!isTenDigitPhone(guestPhone)) {
      toast({ title: "Invalid phone", description: "Enter exactly 10 digits.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/hotel-bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId: hotel?._id,
          roomType: selectedRoom,
          checkIn: format(dateRange.from, 'yyyy-MM-dd'),
          checkOut: format(dateRange.to, 'yyyy-MM-dd'),
          guestName,
          guestEmail,
          guestPhone
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setShowSuccessDialog(true);
      setDateRange({});
      setGuestName("");
      setGuestEmail("");
      setGuestPhone("");
    } catch (error: any) {
      toast({ title: "Booking Failed", description: error.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-gold h-10 w-10" /></div>;
  if (!hotel) return <div className="min-h-screen flex items-center justify-center">Hotel not found.</div>;

  const room = hotel.rooms.find(r => r.type === selectedRoom) || hotel.rooms[0];
  const standardRoom = hotel.rooms.find(r => r.type === "Standard");
  const deluxeRoom = hotel.rooms.find(r => r.type === "Deluxe");
  
  // Calculate disabled dates and modifiers
  const disabledDates = room.soldOutDates.map(d => new Date(d));
  // We add past dates as disabled too
  const isDateDisabled = (date: Date) => {
    if (date < new Date(new Date().setHours(0,0,0,0))) return true;
    return disabledDates.some(d => isSameDay(d, date));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[60vh] w-full">
        <Image src={hotel.images[0] || "/placeholder.svg"} alt={hotel.name} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-7xl mx-auto text-white">
          <Badge className="bg-primary hover:bg-gold/90 mb-4 py-1.5 px-3">
            Part of {hotel.destinationId?.title || "Nepal"}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{hotel.name}</h1>
          <p className="flex items-center gap-2 text-lg text-gray-200">
            <MapPin className="h-5 w-5 text-gold" /> {hotel.destinationId?.title}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-ivory mb-4">About this Hotel</h2>
            <p className="text-stone leading-relaxed text-lg">{hotel.description}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-ivory mb-4">Hotel Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {hotel.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-2 text-ivory bg-card p-3 rounded-xl border border-gold/15 shadow-sm">
                  <CheckCircle className="h-5 w-5 text-ivory0" /> {amenity}
                </div>
              ))}
            </div>
          </div>

          {/* Room Selection Toggle */}
          <div>
            <h2 className="text-2xl font-bold text-ivory mb-6">Select Your Room</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {standardRoom && (
                <div 
                  onClick={() => setSelectedRoom("Standard")}
                  className={`cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 ${
                    selectedRoom === "Standard" ? "border-gold bg-gold/5 ring-2 ring-gold/20" : "border-gold/20 bg-card hover:border-gold"
                  }`}
                >
                  <h3 className="text-xl font-bold text-ivory">Standard Room</h3>
                  <p className="text-3xl font-extrabold text-gold mt-2">${standardRoom.price} <span className="text-sm text-stone font-normal">/ night</span></p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {standardRoom.amenities.map((a, i) => (
                      <Badge key={i} variant="secondary" className="bg-gold/10 text-gold">{a}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {deluxeRoom && (
                <div 
                  onClick={() => setSelectedRoom("Deluxe")}
                  className={`cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 ${
                    selectedRoom === "Deluxe" ? "border-gold bg-gold/5 ring-2 ring-gold/20" : "border-gold/20 bg-card hover:border-gold"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-ivory">Deluxe Room</h3>
                    <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">Premium</Badge>
                  </div>
                  <p className="text-3xl font-extrabold text-gold mt-2">${deluxeRoom.price} <span className="text-sm text-stone font-normal">/ night</span></p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {deluxeRoom.amenities.map((a, i) => (
                      <Badge key={i} variant="secondary" className="bg-yellow-100 text-yellow-800">{a}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Room Deep Dive */}
            <div className="bg-card rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="bg-gray-100 min-h-[300px] relative">
                   {room.roomImages?.[0] ? (
                     <img src={room.roomImages[0]} alt={room.type} className="w-full h-full object-cover" />
                   ) : (
                     <div className="absolute inset-0 flex items-center justify-center text-stone">No Image Available</div>
                   )}
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-ivory mb-6">{room.type} Details</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-bold text-stone uppercase tracking-wider mb-3">Room Features</h4>
                      <ul className="space-y-2">
                        {room.features.map((f, i) => (
                          <li key={i} className="flex items-center text-ivory">
                            <div className="h-1.5 w-1.5 rounded-full bg-gold/50 mr-3" /> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="relative">
          <div className="sticky top-24 bg-card rounded-3xl shadow-2xl p-8 border border-gold/15">
            <div className="mb-6 pb-6 border-b border-gold/15">
              <p className="text-sm text-stone font-medium uppercase tracking-wider mb-1">Price</p>
              <h3 className="text-4xl font-extrabold text-gold">${room?.price || 0} <span className="text-lg text-stone font-normal">/ night</span></h3>
              <p className="text-sm font-semibold text-ivory mt-2">{selectedRoom} Room Selected</p>
            </div>

            <form onSubmit={handleBooking} className="space-y-4">
              <div className="bg-background rounded-xl border border-gray-200 p-4 mb-4">
                 <label className="text-sm font-bold text-ivory mb-2 block flex items-center gap-2">
                   <CalendarIcon className="h-4 w-4 text-gold" /> Select Dates
                 </label>
                 <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => {
                       // Reset if a sold-out date is in range (though disabled dates shouldn't be selectable, doing a range might span across them)
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
                    className="rounded-md border bg-card"
                 />
                 <div className="mt-3 flex items-center gap-2 text-xs text-stone">
                   <div className="w-3 h-3 bg-red-500/20 rounded-full border border-red-500/50" /> = Sold Out
                 </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-ivory mb-1.5 block">Full Name *</label>
                <Input
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(sanitizeFullNameInput(e.target.value))}
                  className="h-12 rounded-xl bg-background border-gray-200"
                  placeholder="John Doe"
                  maxLength={100}
                />
                <p className="text-xs text-stone mt-1">Letters and spaces only.</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-ivory mb-1.5 block">Email *</label>
                <Input
                  type="email"
                  required
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value.trimStart())}
                  className="h-12 rounded-xl bg-background border-gray-200"
                  placeholder="john@example.com"
                  maxLength={254}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-ivory mb-1.5 block">Phone * (10 digits)</label>
                <Input
                  required
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(normalizePhoneDigits(e.target.value))}
                  className="h-12 rounded-xl bg-background border-gray-200"
                  placeholder="9800000000"
                  maxLength={10}
                  inputMode="numeric"
                />
              </div>

              <Button type="submit" disabled={submitting} className="w-full h-14 mt-4">
                {submitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : "Book Now"}
              </Button>
            </form>
            <p className="text-center text-sm text-stone mt-4">You won't be charged yet</p>
          </div>
        </div>
      </section>

      <BookingSuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        title="Booking Request Sent!"
        description="We will confirm your stay shortly."
      />

      <Footer />
    </div>
  );
}
