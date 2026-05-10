"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, MapPin, Wifi, Utensils, Mountain, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function HotelsPage() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHotels() {
      try {
        const res = await fetch("/api/hotels");
        if (res.ok) {
          setHotels(await res.json());
        }
      } catch (err) {
        console.error("Failed to load hotels", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHotels();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Trek Destination Hotels</h1>
          <p className="text-xl text-gray-600">
            Stay in comfortable accommodations along your trekking routes with authentic mountain hospitality
          </p>
        </div>
      </section>

      {/* Hotels Grid */}
      <section className="py-12 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
            </div>
          ) : hotels.length === 0 ? (
            <div className="text-center py-20 text-gray-500 bg-white rounded-2xl shadow-sm border border-gray-100">
              <Mountain className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-2xl font-bold text-gray-800">No Hotels Available</h2>
              <p>We are currently updating our accommodations. Please check back later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {hotels.map((hotel) => {
                const startingPrice = hotel.rooms?.find((r: any) => r.type === 'Standard')?.price 
                                      || hotel.rooms?.[0]?.price 
                                      || 0;
                
                return (
                  <Card key={hotel._id} className="overflow-hidden hover:shadow-xl transition-shadow border-0 shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                      {/* Hotel Images */}
                      <div className="relative h-64 md:h-full">
                        <img
                          src={hotel.images?.[0] || "/placeholder.svg"}
                          alt={hotel.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg">From ${startingPrice}/night</Badge>
                        </div>
                      </div>

                      {/* Hotel Details */}
                      <CardContent className="p-6 flex flex-col h-full">
                        <div className="flex items-start gap-2 mb-2">
                          <MapPin className="h-4 w-4 text-emerald-600 mt-1 flex-shrink-0" />
                          <span className="text-sm font-semibold text-emerald-800">
                            {hotel.destinationId?.title || "Nepal"}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold mb-3 text-gray-900">{hotel.name}</h3>
                        <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
                          {hotel.description}
                        </p>

                        {/* Amenities */}
                        <div className="mb-6 flex-grow">
                          <h4 className="font-semibold text-sm mb-2 text-gray-800">Amenities:</h4>
                          <div className="flex flex-wrap gap-2">
                            {hotel.amenities.slice(0, 4).map((amenity: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-100">
                                {amenity}
                              </Badge>
                            ))}
                            {hotel.amenities.length > 4 && (
                              <Badge variant="outline" className="text-xs">+{hotel.amenities.length - 4} more</Badge>
                            )}
                          </div>
                        </div>

                        <Link href={`/hotels/${hotel._id}`} className="mt-auto block">
                          <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-emerald-600/20 transition-all">
                            View Details & Book
                          </Button>
                        </Link>
                      </CardContent>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Hotel Features */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Why Choose Our Trek Hotels?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Experience authentic mountain hospitality combined with the modern comforts you need after a long day of trekking.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-2xl bg-emerald-50/50 hover:bg-emerald-50 transition-colors">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-100">
                <Mountain className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">Mountain Views</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Wake up to breathtaking Himalayan vistas right from your bedroom window.</p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-emerald-50/50 hover:bg-emerald-50 transition-colors">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-100">
                <Utensils className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">Local Cuisine</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Enjoy authentic, freshly prepared Nepali dishes to refuel for your journey.</p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-emerald-50/50 hover:bg-emerald-50 transition-colors">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-100">
                <Wifi className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">Modern Amenities</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Stay connected with WiFi, hot showers, and comfortable, clean bedding.</p>
            </div>
            
            <div className="text-center p-6 rounded-2xl bg-emerald-50/50 hover:bg-emerald-50 transition-colors">
              <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-emerald-100">
                <Users className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-900">Local Hospitality</h3>
              <p className="text-sm text-gray-600 leading-relaxed">Experience a warm, genuine welcome from local families and experienced staff.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
