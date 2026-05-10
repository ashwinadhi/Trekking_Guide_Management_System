"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Star, Filter, Mountain, ArrowRight, Loader2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface Trek {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  createdAt: string;
}

export default function TreksPage() {
  const [treks, setTreks] = useState<Trek[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTreks() {
      try {
        const res = await fetch("/api/treks");
        if (res.ok) {
          const data = await res.json();
          setTreks(data);
        }
      } catch (err) {
        console.error("Failed to fetch treks", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTreks();
  }, []);

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Header */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900" />
        <div className="absolute inset-0 bg-[url('/images/mountain-sunrise.jpg')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-emerald-200 text-sm font-medium mb-6 border border-white/10">
              <Mountain className="h-4 w-4" />
              Discover Nepal&apos;s Finest Routes
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Trek{" "}
              <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">
                Packages
              </span>
            </h1>
            <p className="text-xl text-emerald-100/80 max-w-3xl mx-auto leading-relaxed">
              Discover Nepal&apos;s most spectacular trekking routes with expert guidance. Each
              package includes accommodation, meals, permits, and professional guiding services.
            </p>
          </div>
        </div>
      </section>

      {/* Trek Cards */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-emerald-600 mb-4" />
              <p className="text-gray-500 text-lg">Loading trek packages...</p>
            </div>
          ) : treks.length === 0 ? (
            <div className="text-center py-20">
              <Mountain className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No trek packages available yet
              </h3>
              <p className="text-gray-400">Check back soon for exciting new trekking routes!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {treks.map((trek) => (
                <Card
                  key={trek._id}
                  className="group overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-500 rounded-2xl bg-white"
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    {trek.image ? (
                      <img
                        src={trek.image}
                        alt={trek.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                        <Mountain className="h-16 w-16 text-emerald-300" />
                      </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Price badge */}
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                      <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-sm font-bold text-gray-900">
                        {trek.price.toLocaleString()}
                      </span>
                    </div>

                    {/* Duration badge */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                      <Clock className="h-3 w-3" />
                      {trek.duration}
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors line-clamp-1">
                      {trek.title}
                    </h3>

                    <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-3">
                      {trek.description}
                    </p>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-2xl font-bold text-emerald-700">
                          ${trek.price.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">per person</span>
                      </div>
                      <Link href={`/treks/${trek._id}`}>
                        <Button
                          size="sm"
                          className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl px-5 group/btn transition-all duration-300"
                        >
                          View Details
                          <ArrowRight className="ml-1.5 h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Custom Trek CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Don&apos;t See Your Perfect Trek?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            I can create a custom itinerary tailored to your interests, fitness level, and time
            constraints. Let&apos;s design your perfect Himalayan adventure together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-green-700 hover:bg-green-800">
                Request Custom Trek
              </Button>
            </Link>
            <Link href="/booking">
              <Button size="lg" variant="outline">
                Book Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What&apos;s Included in Every Trek Package
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive packages designed for your comfort and safety
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "👨‍🏫",
                title: "Professional Guide",
                desc: "Licensed, experienced guide throughout your trek",
              },
              {
                icon: "🏔️",
                title: "All Permits",
                desc: "TIMS card, National Park permits, and restricted area permits",
              },
              {
                icon: "🏠",
                title: "Accommodation",
                desc: "Tea house lodges or camping as per itinerary",
              },
              {
                icon: "🍽️",
                title: "Meals",
                desc: "Breakfast, lunch, and dinner during the trek",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-emerald-50 p-8 rounded-2xl border border-emerald-100">
            <h3 className="text-xl font-bold text-center mb-4">
              Additional Services Available
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <ul className="space-y-2">
                <li>✓ Airport transfers</li>
                <li>✓ Porter services</li>
                <li>✓ Equipment rental</li>
              </ul>
              <ul className="space-y-2">
                <li>✓ Travel insurance guidance</li>
                <li>✓ Pre-trek briefing</li>
                <li>✓ Emergency evacuation support</li>
              </ul>
              <ul className="space-y-2">
                <li>✓ Cultural site visits</li>
                <li>✓ Photography assistance</li>
                <li>✓ Post-trek celebration dinner</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
