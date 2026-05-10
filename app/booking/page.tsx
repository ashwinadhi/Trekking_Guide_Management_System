"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar, Users, CreditCard, Shield, CheckCircle, AlertCircle,
  User, Edit, X, ChevronLeft, ChevronRight, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useToast } from "@/hooks/use-toast";
import { getSessionId } from "@/lib/session";

interface Guide {
  _id: string;
  name: string;
  price: number;
  profileImage: string;
  description: string;
  availability: "Available" | "On Trek" | "Busy";
  bookedDates: string[];
  languages: string[];
  yearsExperience: number;
}

interface Trek {
  _id: string;
  title: string;
  price: number;
  duration: string;
}

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedGuideForCalendar, setSelectedGuideForCalendar] = useState<string>("");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [guides, setGuides] = useState<Guide[]>([]);
  const [treks, setTreks] = useState<Trek[]>([]);
  const [loading, setLoading] = useState(true);

  const [bookingData, setBookingData] = useState({
    guide: "",
    serviceType: "",
    trek: "",
    startDate: "",
    groupSize: "",
    name: "",
    email: "",
    phone: "",
    country: "",
    emergencyContact: "",
    dietaryRequirements: "",
    medicalConditions: "",
    experience: "",
    specialRequests: "",
  });

  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDateFromCalendar, setSelectedDateFromCalendar] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [guidesRes, treksRes] = await Promise.all([
          fetch("/api/guides"),
          fetch("/api/treks"),
        ]);
        if (guidesRes.ok) setGuides(await guidesRes.json());
        if (treksRes.ok) setTreks(await treksRes.json());
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const serviceTypes = [
    { id: "trekking-guide", name: "Trekking Guide", description: "Experienced guide for your trek" },
    { id: "porter", name: "Porter", description: "Help carrying your luggage" },
    { id: "city-tour", name: "City Tour Guide", description: "Explore Kathmandu with a local guide" },
  ];

  const selectedGuide = guides.find((g) => g._id === bookingData.guide);
  const selectedTrek = treks.find((t) => t._id === bookingData.trek);

  // Parse duration number from string, e.g. "14 days" -> 14
  const parsedDuration = selectedTrek ? parseInt(selectedTrek.duration.replace(/\D/g, "") || "1") : 1;

  // Total Price: Trek Base Price + (Guide Daily Rate * Duration)
  // If no trek selected, assume 1 day for the guide price logic
  let totalPrice = 0;
  if (selectedTrek) {
    totalPrice = selectedTrek.price * parseInt(bookingData.groupSize || "1");
  }
  if (selectedGuide) {
    totalPrice += selectedGuide.price * parsedDuration;
  }

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
      setTimeout(() => {
        document.getElementById("booking-form-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
      setTimeout(() => {
        document.getElementById("booking-form-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const sessionId = getSessionId();

      const payload = {
        bookingType: "guide",
        sessionId,
        name: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone,
        totalPrice,
        bookingDetails: {
          guide: bookingData.guide,
          guideName: selectedGuide?.name,
          serviceType: bookingData.serviceType,
          trek: bookingData.trek,
          trekName: selectedTrek?.title,
          startDate: bookingData.startDate,
          endDate: "", // You could compute end date here based on duration
          groupSize: bookingData.groupSize,
          country: bookingData.country,
          experience: bookingData.experience,
          dietaryRequirements: bookingData.dietaryRequirements,
          medicalConditions: bookingData.medicalConditions,
          emergencyContact: bookingData.emergencyContact,
          specialRequests: bookingData.specialRequests,
        },
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Booking failed");
      }

      toast({
        title: "Booking Request Submitted! 🎉",
        description: "Your request is pending approval. We will contact you shortly.",
        duration: 5000,
      });
      // Optionally reset form or redirect here
      setStep(1);
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuideChange = (guideId: string) => {
    setBookingData({ ...bookingData, guide: guideId, startDate: "" });
    setSelectedDateFromCalendar("");
  };

  const openCalendar = (guideId: string) => {
    setSelectedGuideForCalendar(guideId);
    setShowCalendar(true);
  };

  const closeCalendar = () => {
    setShowCalendar(false);
    setSelectedGuideForCalendar("");
  };

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const isDateBooked = (date: string, guideId: string) => {
    const guide = guides.find((g) => g._id === guideId);
    if (!guide) return false;
    if (guide.availability === "Busy") return true; // Entirely busy
    return guide.bookedDates?.includes(date) || false;
  };

  const handleDateClick = (dateString: string, guideId: string) => {
    if (!isDateBooked(dateString, guideId)) {
      setSelectedDateFromCalendar(dateString);
      setBookingData({ ...bookingData, startDate: dateString });
      closeCalendar();
    }
  };

  const renderCalendar = () => {
    const guide = guides.find((g) => g._id === selectedGuideForCalendar);
    if (!guide) return null;

    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      // Ensure date is formatted properly without timezone offset issues
      const dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
      const booked = isDateBooked(dateString, selectedGuideForCalendar);
      const isPast = date < new Date(new Date().setHours(0,0,0,0));

      let cellClass = "h-10 flex items-center justify-center text-sm rounded transition-colors ";

      if (isPast) {
        cellClass += "text-gray-300 bg-gray-50 cursor-not-allowed";
      } else if (booked) {
        cellClass += "bg-red-100/50 text-red-400 cursor-not-allowed";
      } else {
        cellClass += "bg-emerald-50 text-emerald-700 hover:bg-emerald-200 cursor-pointer font-medium border border-emerald-100";
      }

      days.push(
        <div
          key={day}
          className={cellClass}
          onClick={() => {
            if (!isPast && !booked) handleDateClick(dateString, selectedGuideForCalendar);
          }}
        >
          {day}
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">{guide.name}&apos;s Availability</h3>
            <Button variant="ghost" size="sm" onClick={closeCalendar} className="h-8 w-8 p-0 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex justify-between items-center mb-6 bg-gray-50 p-2 rounded-xl border border-gray-100">
            <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </Button>
            <h4 className="font-semibold text-gray-800">
              {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h4>
            <Button variant="ghost" size="sm" onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="h-8 flex items-center justify-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 mb-6">{days}</div>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-600 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-100 border border-emerald-200 rounded-full"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-100/50 rounded-full"></div>
              <span>Booked</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <section className="py-16 bg-gradient-to-br from-emerald-900 to-teal-900">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Book Your Trek</h1>
          <p className="text-lg text-emerald-100/80">Secure your spot on an unforgettable Himalayan adventure.</p>
        </div>
      </section>

      {/* Selected Guide Quick View */}
      {selectedGuide && step > 1 && (
        <section className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={selectedGuide.profileImage || "/placeholder.svg"} alt={selectedGuide.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{selectedGuide.name}</p>
                  <p className="text-xs text-gray-500">${selectedGuide.price}/day</p>
                </div>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-sm font-bold text-emerald-600">Total: ${totalPrice}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Progress */}
      <section className="py-6 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {[
              { num: 1, label: "Guide" },
              { num: 2, label: "Service" },
              { num: 3, label: "Details" },
              { num: 4, label: "Confirm" }
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center">
                <div className={`flex items-center gap-2 ${step >= s.num ? "text-emerald-600" : "text-gray-400"}`}>
                  <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${step >= s.num ? "bg-emerald-600 text-white" : "bg-gray-100"}`}>
                    {s.num}
                  </div>
                  <span className="hidden sm:inline font-medium text-sm">{s.label}</span>
                </div>
                {idx < 3 && <div className={`w-8 sm:w-12 h-0.5 mx-2 sm:mx-4 ${step > s.num ? "bg-emerald-600" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="booking-form-section" className="py-12 flex-grow">
        <div className="max-w-4xl mx-auto px-4">
          
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <User className="h-6 w-6 text-emerald-600" /> Select Your Guide
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guides.map((guide) => {
                  const isAvailable = guide.availability === "Available";
                  return (
                    <div
                      key={guide._id}
                      onClick={() => isAvailable && handleGuideChange(guide._id)}
                      className={`relative border-2 rounded-2xl p-4 transition-all duration-200 ${
                        !isAvailable ? "opacity-60 cursor-not-allowed bg-gray-50 border-gray-200" :
                        bookingData.guide === guide._id
                          ? "border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20"
                          : "border-gray-100 bg-white hover:border-emerald-200 hover:shadow-sm cursor-pointer"
                      }`}
                    >
                      <div className="flex gap-4">
                        <img src={guide.profileImage || "/placeholder.svg"} alt={guide.name} className="w-16 h-16 rounded-full object-cover shadow-sm" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 truncate">{guide.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-emerald-600 font-semibold">${guide.price}/day</span>
                            <span className="text-xs text-gray-500">• {guide.yearsExperience} yrs exp</span>
                          </div>
                          {!isAvailable ? (
                            <span className="inline-block mt-2 px-2 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-md">Busy / On Trek</span>
                          ) : (
                            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openCalendar(guide._id); }} className="mt-2 h-7 px-2 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 bg-emerald-50">
                              <Calendar className="h-3 w-3 mr-1" /> View Availability
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-end mt-8">
                <Button onClick={handleNext} disabled={!bookingData.guide} className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-6 rounded-xl font-bold shadow-lg shadow-emerald-700/20">Next Step</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
              <CardHeader className="bg-emerald-900 text-white px-8 py-6">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Calendar className="h-6 w-6 text-emerald-400" /> Trek & Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6 bg-white">
                <div>
                  <Label className="text-gray-700 font-semibold mb-2 block">Choose Service Type *</Label>
                  <Select onValueChange={(val) => setBookingData({ ...bookingData, serviceType: val })}>
                    <SelectTrigger className="bg-gray-50 border-gray-200 rounded-xl h-12"><SelectValue placeholder="Select a service" /></SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-700 font-semibold mb-2 block">Choose Trek Package (Optional)</Label>
                  <Select onValueChange={(val) => setBookingData({ ...bookingData, trek: val })}>
                    <SelectTrigger className="bg-gray-50 border-gray-200 rounded-xl h-12"><SelectValue placeholder="Select a trek" /></SelectTrigger>
                    <SelectContent>
                      {treks.map(t => <SelectItem key={t._id} value={t._id}>{t.title} - {t.duration} - ${t.price}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-gray-700 font-semibold mb-2 block">Start Date *</Label>
                    <Input type="date" className="bg-gray-50 border-gray-200 rounded-xl h-12" value={bookingData.startDate} onChange={e => setBookingData({...bookingData, startDate: e.target.value})} />
                    {selectedDateFromCalendar && bookingData.startDate === selectedDateFromCalendar && (
                      <p className="text-xs font-semibold text-emerald-600 mt-2 flex items-center gap-1"><CheckCircle className="h-3 w-3"/> Verified from calendar</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-700 font-semibold mb-2 block">Group Size *</Label>
                    <Select onValueChange={(val) => setBookingData({ ...bookingData, groupSize: val })}>
                      <SelectTrigger className="bg-gray-50 border-gray-200 rounded-xl h-12"><SelectValue placeholder="Number of trekkers" /></SelectTrigger>
                      <SelectContent>
                        {[1,2,3,4,5,6,7,8].map(n => <SelectItem key={n} value={n.toString()}>{n} Person{n>1?'s':''}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {selectedTrek && (
                  <div className="bg-emerald-50 rounded-xl p-6 mt-6 border border-emerald-100">
                    <h4 className="font-bold text-emerald-800 mb-3 text-lg">Trip Summary</h4>
                    <div className="space-y-2 text-emerald-900/80">
                      <p className="flex justify-between"><span>Trek:</span> <span className="font-semibold text-emerald-900">{selectedTrek.title}</span></p>
                      <p className="flex justify-between"><span>Duration:</span> <span className="font-semibold text-emerald-900">{selectedTrek.duration}</span></p>
                      <p className="flex justify-between"><span>Base Price:</span> <span className="font-semibold text-emerald-900">${selectedTrek.price}</span></p>
                      {bookingData.groupSize && (
                        <p className="flex justify-between pt-2 border-t border-emerald-200 mt-2">
                          <span className="font-bold text-emerald-800">Total Price ({bookingData.groupSize} Trekkers):</span> 
                          <span className="font-bold text-emerald-800">${selectedTrek.price * parseInt(bookingData.groupSize)}</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                  <Button variant="outline" onClick={handlePrevious} className="rounded-xl h-12 px-6">Back</Button>
                  <Button onClick={handleNext} disabled={!bookingData.serviceType || !bookingData.startDate || !bookingData.groupSize} className="bg-emerald-700 hover:bg-emerald-800 rounded-xl h-12 px-8 font-bold text-white">Next Step</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
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
                    <Input className="bg-gray-50 border-gray-200 rounded-xl h-12" value={bookingData.name} onChange={e=>setBookingData({...bookingData, name:e.target.value})} required/>
                  </div>
                  <div>
                    <Label className="text-gray-700 font-semibold mb-2 block">Email Address *</Label>
                    <Input type="email" className="bg-gray-50 border-gray-200 rounded-xl h-12" value={bookingData.email} onChange={e=>setBookingData({...bookingData, email:e.target.value})} required/>
                  </div>
                  <div>
                    <Label className="text-gray-700 font-semibold mb-2 block">Phone Number *</Label>
                    <Input className="bg-gray-50 border-gray-200 rounded-xl h-12" value={bookingData.phone} onChange={e=>setBookingData({...bookingData, phone:e.target.value})} required/>
                  </div>
                  <div>
                    <Label className="text-gray-700 font-semibold mb-2 block">Country *</Label>
                    <Input className="bg-gray-50 border-gray-200 rounded-xl h-12" value={bookingData.country} onChange={e=>setBookingData({...bookingData, country:e.target.value})} required/>
                  </div>
                </div>

                <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                  <Button variant="outline" onClick={handlePrevious} className="rounded-xl h-12 px-6">Back</Button>
                  <Button onClick={handleNext} disabled={!bookingData.name || !bookingData.email || !bookingData.phone} className="bg-emerald-700 hover:bg-emerald-800 rounded-xl h-12 px-8 font-bold text-white">Review & Confirm</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 4 && (
            <Card className="border-0 shadow-xl rounded-2xl overflow-hidden border-t-8 border-t-emerald-600">
              <CardHeader className="bg-white px-8 pt-8 pb-4">
                <CardTitle className="flex items-center gap-2 text-2xl text-gray-800">
                  <Shield className="h-6 w-6 text-emerald-600" /> Confirm Booking
                </CardTitle>
                <p className="text-gray-500 mt-2">Please review your booking details before submitting.</p>
              </CardHeader>
              <CardContent className="p-8 bg-gray-50/50">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-800 text-lg">Total Price</h3>
                    <span className="text-3xl font-extrabold text-emerald-600">${totalPrice}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                    <div>
                      <p className="text-gray-500 font-medium mb-1">Assigned Guide</p>
                      <p className="font-bold text-gray-800">{selectedGuide?.name}</p>
                    </div>
                    {selectedTrek && (
                      <div>
                        <p className="text-gray-500 font-medium mb-1">Trek Route</p>
                        <p className="font-bold text-gray-800">{selectedTrek.title}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-500 font-medium mb-1">Start Date</p>
                      <p className="font-bold text-gray-800">{bookingData.startDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium mb-1">Group Size</p>
                      <p className="font-bold text-gray-800">{bookingData.groupSize} Person(s)</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-blue-50 text-blue-800 rounded-xl mb-8">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <p className="text-sm">
                    No payment is required right now. After submission, our admin will verify the guide&apos;s availability and confirm your booking.
                  </p>
                </div>

                <div className="flex justify-between pt-6">
                  <Button variant="outline" onClick={handlePrevious} className="rounded-xl h-12 px-6 bg-white">Back</Button>
                  <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-emerald-600 hover:bg-emerald-700 rounded-xl h-12 px-8 font-bold text-white shadow-lg shadow-emerald-600/30">
                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <CheckCircle className="h-5 w-5 mr-2" />}
                    Confirm Booking
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </section>

      {showCalendar && renderCalendar()}

      <Footer />
    </div>
  );
}
