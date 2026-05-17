"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Calendar, MapPin, Star, Clock, DollarSign, CheckCircle, Loader2, AlertCircle, ChevronRight, Globe, Shield } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface Guide {
  _id: string; name: string; profileImage: string; description: string;
  services: string[]; yearsExperience: number; languages: string[];
  availabilityStatus: string; price: number;
  reviews: { rating: number }[];
}

const SERVICE_CATEGORIES = [
  { id: "city_tour", label: "City Tour Guide", icon: "🏙️", desc: "Explore cities with a local expert" },
  { id: "trekking", label: "Trekking Guide", icon: "🥾", desc: "Expert guidance for treks" },
  { id: "mountaineering", label: "Mountaineering Guide", icon: "🏔️", desc: "Professional climbing guides" },
];

export default function GuideBookingPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [form, setForm] = useState({
    startDate: "", endDate: "", groupSize: "1",
    pickupLocation: "", specialNotes: "",
    customerName: "", customerEmail: "", customerPhone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/guides").then(r => r.json()).then(setGuides).catch(console.error).finally(() => setLoading(false));
  }, []);

  const avgRating = (reviews: Guide["reviews"]) => {
    if (!reviews?.length) return 0;
    return (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
  };

  const filteredGuides = category
    ? guides.filter(g => g.services.some(s => s.toLowerCase().includes(category.replace("_", " ").toLowerCase()) || category === "trekking" && s.toLowerCase().includes("trek")))
    : guides;

  const numberOfDays = form.startDate && form.endDate
    ? Math.max(1, Math.ceil((new Date(form.endDate).getTime() - new Date(form.startDate).getTime()) / 86400000))
    : 0;
  const totalAmount = selectedGuide ? selectedGuide.price * numberOfDays : 0;

  const handleSubmit = async () => {
    if (!selectedGuide || !form.startDate || !form.endDate || !form.customerName || !form.customerEmail || !form.customerPhone) {
      setError("Please fill all required fields"); return;
    }
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/guide-bookings", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guideId: selectedGuide._id, serviceCategory: category || "trekking",
          customerName: form.customerName, customerEmail: form.customerEmail,
          customerPhone: form.customerPhone, startDate: form.startDate,
          endDate: form.endDate, groupSize: form.groupSize,
          pickupLocation: form.pickupLocation, specialNotes: form.specialNotes,
        }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      const booking = await res.json();
      setSuccess(booking);
    } catch (err: any) { setError(err.message); }
    finally { setSubmitting(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col"><Header />
      <div className="flex-grow flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>
    <Footer /></div>
  );

  // Success Screen
  if (success) return (
    <div className="min-h-screen flex flex-col"><Header />
      <div className="flex-grow flex items-center justify-center py-20 px-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle className="h-8 w-8 text-emerald-600" /></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-500 mb-6">Your guide booking request has been submitted successfully.</p>
          <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm"><span className="text-gray-500">Booking ID</span><span className="font-bold text-emerald-600 font-mono">{success.bookingId}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Guide</span><span className="font-semibold">{success.guideName}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Total</span><span className="font-bold text-emerald-600">${success.totalAmount}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Status</span><span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase">{success.status}</span></div>
          </div>
          <Link href="/guides"><button className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors">Back to Guides</button></Link>
        </div>
      </div>
    <Footer /></div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col"><Header />
      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-emerald-900 to-teal-900">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Book Your Guide</h1>
          <p className="text-lg text-emerald-100/80">Hire an expert local guide for your adventure in Nepal.</p>
        </div>
      </section>

      {/* Progress */}
      <section className="py-6 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {[{ n: 1, l: "Category" }, { n: 2, l: "Guide" }, { n: 3, l: "Details" }, { n: 4, l: "Confirm" }].map((s, i) => (
              <div key={s.n} className="flex items-center">
                <div className={`flex items-center gap-2 ${step >= s.n ? "text-emerald-600" : "text-gray-400"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s.n ? "bg-emerald-600 text-white" : "bg-gray-100"}`}>{s.n}</div>
                  <span className="hidden sm:inline font-medium text-sm">{s.l}</span>
                </div>
                {i < 3 && <div className={`w-8 sm:w-12 h-0.5 mx-2 sm:mx-4 ${step > s.n ? "bg-emerald-600" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 flex-grow">
        <div className="max-w-4xl mx-auto px-4">
          {error && <div className="mb-6 flex items-center gap-3 px-5 py-3.5 bg-red-50 border border-red-200 text-red-600 rounded-xl"><AlertCircle className="h-4 w-4" />{error}</div>}

          {/* Step 1: Category */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Choose Service Category</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SERVICE_CATEGORIES.map(cat => (
                  <div key={cat.id} onClick={() => { setCategory(cat.id); setSelectedGuide(null); }}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${category === cat.id ? "border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20" : "border-gray-100 bg-white hover:border-emerald-200"}`}>
                    <div className="text-3xl mb-3">{cat.icon}</div>
                    <h3 className="font-bold text-gray-900 mb-1">{cat.label}</h3>
                    <p className="text-sm text-gray-500">{cat.desc}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-end"><button onClick={() => setStep(2)} disabled={!category} className="px-8 py-3 bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-300 text-white rounded-xl font-bold shadow-lg transition-colors">Next Step <ChevronRight className="inline h-4 w-4" /></button></div>
            </div>
          )}

          {/* Step 2: Select Guide */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><Users className="h-6 w-6 text-emerald-600" /> Select Your Guide</h2>
              {filteredGuides.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border"><Users className="h-12 w-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500">No guides available for this category</p></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredGuides.map(guide => (
                    <div key={guide._id} onClick={() => setSelectedGuide(guide)}
                      className={`relative border-2 rounded-2xl p-4 transition-all cursor-pointer ${selectedGuide?._id === guide._id ? "border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20" : "border-gray-100 bg-white hover:border-emerald-200"}`}>
                      <div className="flex gap-4">
                        <img src={guide.profileImage || "/placeholder.svg"} alt={guide.name} className="w-16 h-16 rounded-full object-cover shadow-sm" />
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{guide.name}</h3>
                          <div className="flex items-center gap-2 mt-1 text-sm">
                            <span className="text-emerald-600 font-semibold">${guide.price}/day</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500">{guide.yearsExperience} yrs</span>
                            {guide.reviews?.length > 0 && <><span className="text-gray-400">•</span><span className="flex items-center gap-0.5"><Star className="h-3 w-3 text-yellow-400 fill-current" />{avgRating(guide.reviews)}</span></>}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {guide.languages.slice(0, 3).map((l, i) => <span key={i} className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded-full border border-blue-200">{l}</span>)}
                          </div>
                        </div>
                      </div>
                      {guide.availabilityStatus !== "available" && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold rounded capitalize">{guide.availabilityStatus.replace("_", " ")}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className="px-6 py-3 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50">Back</button>
                <button onClick={() => setStep(3)} disabled={!selectedGuide} className="px-8 py-3 bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-300 text-white rounded-xl font-bold">Next Step</button>
              </div>
            </div>
          )}

          {/* Step 3: Booking Details */}
          {step === 3 && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-emerald-900 text-white px-8 py-6"><h2 className="text-2xl font-bold flex items-center gap-2"><Calendar className="h-6 w-6 text-emerald-400" /> Booking Details</h2></div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="text-gray-700 font-semibold mb-2 block">Start Date *</label><input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} min={new Date().toISOString().split("T")[0]} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:outline-none" /></div>
                  <div><label className="text-gray-700 font-semibold mb-2 block">End Date *</label><input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} min={form.startDate || new Date().toISOString().split("T")[0]} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:outline-none" /></div>
                  <div><label className="text-gray-700 font-semibold mb-2 block">Group Size *</label><select value={form.groupSize} onChange={e => setForm({...form, groupSize: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:outline-none">{[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} Person{n>1?"s":""}</option>)}</select></div>
                  <div><label className="text-gray-700 font-semibold mb-2 block">Pickup Location</label><input value={form.pickupLocation} onChange={e => setForm({...form, pickupLocation: e.target.value})} placeholder="Hotel name, airport..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:outline-none" /></div>
                </div>
                <div><label className="text-gray-700 font-semibold mb-2 block">Full Name *</label><input value={form.customerName} onChange={e => setForm({...form, customerName: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:outline-none" /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="text-gray-700 font-semibold mb-2 block">Email *</label><input type="email" value={form.customerEmail} onChange={e => setForm({...form, customerEmail: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:outline-none" /></div>
                  <div><label className="text-gray-700 font-semibold mb-2 block">Phone *</label><input value={form.customerPhone} onChange={e => setForm({...form, customerPhone: e.target.value})} placeholder="10 digit number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:outline-none" /></div>
                </div>
                <div><label className="text-gray-700 font-semibold mb-2 block">Special Notes</label><textarea value={form.specialNotes} onChange={e => setForm({...form, specialNotes: e.target.value})} rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-emerald-500/50 focus:outline-none" placeholder="Any special requirements..." /></div>
                <div className="flex justify-between pt-4 border-t">
                  <button onClick={() => setStep(2)} className="px-6 py-3 border border-gray-200 rounded-xl font-medium">Back</button>
                  <button onClick={() => setStep(4)} disabled={!form.startDate || !form.endDate || !form.customerName || !form.customerEmail || !form.customerPhone} className="px-8 py-3 bg-emerald-700 hover:bg-emerald-800 disabled:bg-gray-300 text-white rounded-xl font-bold">Review Booking</button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Summary & Confirm */}
          {step === 4 && selectedGuide && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-emerald-900 text-white px-8 py-6"><h2 className="text-2xl font-bold flex items-center gap-2"><Shield className="h-6 w-6 text-emerald-400" /> Booking Summary</h2></div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Guide Details</h4>
                    <div className="flex items-center gap-4"><img src={selectedGuide.profileImage || "/placeholder.svg"} alt="" className="w-14 h-14 rounded-full object-cover" /><div><p className="font-bold text-gray-900">{selectedGuide.name}</p><p className="text-sm text-gray-500">${selectedGuide.price}/day</p></div></div>
                    <div><p className="text-xs text-gray-500">Service</p><p className="font-semibold capitalize">{category.replace("_", " ")}</p></div>
                    <div className="flex gap-6"><div><p className="text-xs text-gray-500">Start</p><p className="font-semibold">{form.startDate}</p></div><div><p className="text-xs text-gray-500">End</p><p className="font-semibold">{form.endDate}</p></div></div>
                    <div className="flex gap-6"><div><p className="text-xs text-gray-500">Duration</p><p className="font-semibold">{numberOfDays} day(s)</p></div><div><p className="text-xs text-gray-500">Group</p><p className="font-semibold">{form.groupSize} person(s)</p></div></div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Price Breakdown</h4>
                    <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
                      <div className="flex justify-between text-sm"><span className="text-gray-600">Guide Rate</span><span>${selectedGuide.price}/day</span></div>
                      <div className="flex justify-between text-sm"><span className="text-gray-600">Duration</span><span>{numberOfDays} day(s)</span></div>
                      <hr />
                      <div className="flex justify-between"><span className="font-bold text-gray-800">Total Cost</span><span className="text-2xl font-black text-emerald-600">${totalAmount}</span></div>
                    </div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-4">Your Details</h4>
                    <div className="text-sm space-y-1"><p><span className="text-gray-500">Name: </span><span className="font-semibold">{form.customerName}</span></p><p><span className="text-gray-500">Email: </span><span className="font-semibold">{form.customerEmail}</span></p><p><span className="text-gray-500">Phone: </span><span className="font-semibold">{form.customerPhone}</span></p></div>
                  </div>
                </div>
                <div className="flex gap-4 pt-6 border-t">
                  <button onClick={() => setStep(3)} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50">Edit Details</button>
                  <button onClick={handleSubmit} disabled={submitting} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2">
                    {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle className="h-5 w-5" />}{submitting ? "Processing..." : "Confirm Booking"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    <Footer /></div>
  );
}
