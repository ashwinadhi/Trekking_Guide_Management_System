"use client";

import { useState, useEffect } from "react";
import { Car, Check, Loader2, ArrowRight, Shield, User, Clock, DollarSign, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { VehicleBookingModal } from "@/components/vehicle-booking-modal";
import { PageHero } from "@/components/luxury/page-hero";

interface Vehicle {
  _id: string;
  name: string;
  type: string;
  image: string;
  description: string;
  driverName: string;
  pricePerDay: number;
  features: string[];
  soldOutDates: string[];
  pickupLocation: string;
  dropOffLocation: string;
}

export default function CarBookingPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter and Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const res = await fetch("/api/vehicles");
        if (res.ok) setVehicles(await res.json());
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetchVehicles();
  }, []);

  const types = ["all", ...new Set(vehicles.map(v => v.type).filter(Boolean))];

  const filteredVehicles = vehicles
    .filter(
      (v) =>
        (selectedType === "all" || v.type === selectedType) &&
        v.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "price-low") return a.pricePerDay - b.pricePerDay;
      if (sortBy === "price-high") return b.pricePerDay - a.pricePerDay;
      return a.name.localeCompare(b.name);
    });

  const openBooking = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <PageHero
        eyebrow="Chauffeur"
        title="Airport arrival & private fleet"
        subtitle="Professional drivers for TIA transfers, city touring, and trailhead logistics."
      />

      {/* Search and Filters Section */}
      <section className="py-12 bg-card border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gold mb-2">Choose Your Vehicle</h2>
            <p className="text-stone">Select from our fleet of well-maintained vehicles with experienced drivers</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-center justify-center">
            {/* Search */}
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone h-4 w-4" />
              <Input
                placeholder="Search by vehicle name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-gold/20 focus:ring-gold"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-full sm:w-44 h-12 rounded-xl border-gray-200 bg-card shadow-sm">
                  <Filter className="h-4 w-4 mr-2 text-gold" />
                  <SelectValue placeholder="Vehicle Type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "all" ? "All Types" : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-44 h-12 rounded-xl border-gray-200 bg-card shadow-sm">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="price-low">Price (Low to High)</SelectItem>
                  <SelectItem value="price-high">Price (High to Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Grid */}
      <section className="py-20 flex-grow bg-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-gold mb-4" />
              <p className="text-stone text-lg">Loading fleet options...</p>
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-gray-200">
              <Search size={64} className="mx-auto text-gray-200 mb-4" />
              <h3 className="text-xl font-semibold text-stone mb-2">No vehicles found</h3>
              <p className="text-stone">Try adjusting your search or filters to find what you're looking for.</p>
              <Button 
                variant="outline" 
                onClick={() => { setSearchTerm(""); setSelectedType("all"); }}
                className="mt-6 rounded-xl border-gold/30 text-gold hover:bg-gold/5"
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredVehicles.map((v) => (
                <div key={v._id} className="group bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gold/15 flex flex-col">
                  {/* Image Section */}
                  <div className="relative h-64 overflow-hidden">
                    <img src={v.image} alt={v.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Type Badge */}
                    <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                      {v.type}
                    </div>

                    {/* Price Badge */}
                    <div className="absolute bottom-4 right-4 bg-card/95 backdrop-blur-sm border border-gold/15 px-4 py-2 rounded-2xl shadow-xl">
                      <p className="text-[10px] text-stone font-bold uppercase tracking-tight leading-none mb-1">Daily Rate</p>
                      <p className="text-xl font-black text-gold leading-none">${v.pricePerDay}</p>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-ivory mb-2 group-hover:text-gold transition-colors">{v.name}</h3>
                      
                      <div className="flex items-center gap-2 mb-4 p-2 bg-background rounded-xl border border-gold/15">
                        <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center border border-gold/30">
                          <Check size={14} className="text-gold" />
                        </div>
                        <div>
                          <p className="text-[9px] text-stone font-black uppercase tracking-tight">Driver</p>
                          <p className="text-xs font-bold text-ivory">{v.driverName}</p>
                        </div>
                      </div>

                      <p className="text-stone text-sm mb-6 line-clamp-3 leading-relaxed italic">
                        "{v.description}"
                      </p>

                      <div className="flex flex-wrap gap-2 mb-8">
                        {v.features?.map((f, i) => (
                          <span key={i} className="flex items-center gap-1.5 text-[10px] text-stone bg-background px-2.5 py-1 rounded-full border border-gray-200 font-medium">
                            <Check size={10} className="text-ivory0" /> {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Button 
                      onClick={() => openBooking(v)}
                      className="w-full bg-gold hover:bg-gold/90 text-white rounded-2xl h-12 font-bold transition-all"
                    >
                      Book this Vehicle <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-ivory mb-4">
              Why Choose our <span className="text-gold">Car Service?</span>
            </h2>
            <p className="text-xl text-stone">
              Reliable, safe, and professional transportation tailored for Himalayan terrain
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="h-8 w-8 text-gold" />,
                title: "Safety First",
                desc: "All vehicles undergo rigorous safety checks and regular maintenance for mountain roads.",
              },
              {
                icon: <User className="h-8 w-8 text-gold" />,
                title: "Expert Drivers",
                desc: "Our drivers are mountain-trained professionals with years of experience on Himalayan routes.",
              },
              {
                icon: <Clock className="h-8 w-8 text-gold" />,
                title: "24/7 Support",
                desc: "Real-time tracking and round-the-clock logistics support for all active rentals.",
              },
              {
                icon: <DollarSign className="h-8 w-8 text-gold" />,
                title: "Transparent Pricing",
                desc: "No hidden costs. Clear daily rates with fuel and driver allowances included.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="text-center p-8 bg-background rounded-3xl border border-gold/15 hover:border-gold/30 hover:shadow-xl transition-all duration-300"
              >
                <div className="inline-flex p-4 bg-card rounded-2xl shadow-sm mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-ivory">{feature.title}</h3>
                <p className="text-stone text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {selectedVehicle && (
        <VehicleBookingModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          vehicle={selectedVehicle} 
        />
      )}
    </div>
  );
}
