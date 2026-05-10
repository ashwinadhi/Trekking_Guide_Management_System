"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, MessageCircle, Languages, Calendar, Filter, Users, Loader2, DollarSign, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface Guide {
  _id: string;
  name: string;
  profileImage: string;
  description: string;
  services: string[];
  yearsExperience: number;
  languages: string[];
  availability: string;
  price: number;
  reviews: { user: string; comment: string; rating: number }[];
}

export default function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGuides() {
      try {
        const res = await fetch("/api/guides");
        if (res.ok) setGuides(await res.json());
      } catch (err) { console.error("Failed to fetch guides", err); }
      finally { setLoading(false); }
    }
    fetchGuides();
  }, []);

  const avgRating = (reviews: Guide["reviews"]) => {
    if (!reviews.length) return 0;
    return (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
  };

  const availabilityColor = (s: string) =>
    s === "Available" ? "bg-green-600" : s === "On Trek" ? "bg-amber-600" : "bg-red-600";

  return (
    <div className="min-h-screen">
      <Header />

      {/* Header */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Find Your Perfect Local Guide</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with verified, experienced local guides across Nepal. From trekking adventures to cultural tours,
              find the perfect guide for your journey.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center gap-2 flex-1">
                <MapPin className="h-5 w-5 text-gray-400" />
                <Input placeholder="Search by location or specialty..." className="border-0 focus:ring-0" />
              </div>
              <div className="flex gap-2">
                <Select>
                  <SelectTrigger className="w-[160px]"><SelectValue placeholder="Destination" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Destinations</SelectItem>
                    <SelectItem value="kathmandu">Kathmandu Valley</SelectItem>
                    <SelectItem value="pokhara">Pokhara</SelectItem>
                    <SelectItem value="everest">Everest Region</SelectItem>
                    <SelectItem value="annapurna">Annapurna Region</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[120px]"><SelectValue placeholder="Price" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">$20-40</SelectItem>
                    <SelectItem value="medium">$40-60</SelectItem>
                    <SelectItem value="high">$60+</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="bg-green-700 hover:bg-green-800"><Filter className="h-4 w-4 mr-2" />Search</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guides Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Available Guides</h2>
              <p className="text-gray-600">{guides.length} guides found</p>
            </div>
            <Select>
              <SelectTrigger className="w-[200px]"><SelectValue placeholder="Sort by" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="experience">Most Experienced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-emerald-600 mb-4" />
              <p className="text-gray-500 text-lg">Loading guides...</p>
            </div>
          ) : guides.length === 0 ? (
            <div className="text-center py-20">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No guides available yet</h3>
              <p className="text-gray-400">Check back soon for expert trekking guides!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {guides.map((guide) => (
                <Card key={guide._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    {guide.profileImage ? (
                      <img src={guide.profileImage} alt={guide.name} className="w-full h-48 object-cover"
                        onError={e => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                        <Users className="h-16 w-16 text-emerald-300" />
                      </div>
                    )}
                    <Badge className={`absolute top-3 left-3 ${availabilityColor(guide.availability)} text-white`}>
                      {guide.availability}
                    </Badge>
                    {guide.reviews.length > 0 && (
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{avgRating(guide.reviews)}</span>
                        <span className="text-xs text-gray-500">({guide.reviews.length})</span>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{guide.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{guide.yearsExperience} years experience</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-700">${guide.price}</div>
                        <div className="text-xs text-gray-500">per day</div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{guide.description}</p>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Languages className="h-4 w-4 text-gray-400" />
                        <div className="flex flex-wrap gap-1">
                          {guide.languages.map((lang, i) => (
                            <span key={i} className="px-2 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-200">{lang}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {guide.services.slice(0, 3).map((s, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{s}</Badge>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/guides/${guide._id}`} className="flex-1">
                        <Button variant="outline" className="w-full bg-transparent">View Profile</Button>
                      </Link>
                      <Link href={`/booking?guide=${guide._id}`} className="flex-1">
                        <Button className="w-full bg-green-700 hover:bg-green-800">Book Now</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><Users className="h-8 w-8 text-green-700" /></div>
              <h3 className="text-xl font-bold mb-2">Verified Guides</h3>
              <p className="text-gray-600">All guides are licensed and background-checked</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><Star className="h-8 w-8 text-green-700" /></div>
              <h3 className="text-xl font-bold mb-2">Rated & Reviewed</h3>
              <p className="text-gray-600">Real reviews from verified travelers</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><MessageCircle className="h-8 w-8 text-green-700" /></div>
              <h3 className="text-xl font-bold mb-2">Direct Contact</h3>
              <p className="text-gray-600">Chat directly with guides before booking</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><Calendar className="h-8 w-8 text-green-700" /></div>
              <h3 className="text-xl font-bold mb-2">Flexible Booking</h3>
              <p className="text-gray-600">Easy booking with flexible cancellation</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
