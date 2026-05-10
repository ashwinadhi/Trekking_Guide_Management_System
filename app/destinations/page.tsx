"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin, Loader2, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import Footer from "@/components/footer";

interface Destination {
  _id: string;
  title: string;
  description: string;
  image: string;
  slug: string;
  trekCount: number;
  availableGuides?: number;
  priceRange?: string;
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const res = await fetch("/api/destinations");
        if (res.ok) {
          setDestinations(await res.json());
        }
      } catch (err) {
        console.error("Failed to load destinations", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDestinations();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Header section with gradient and dynamic text */}
      <section className="relative py-24 bg-gradient-to-br from-emerald-900 via-teal-900 to-green-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-400 via-transparent to-transparent"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <Badge className="mb-6 bg-emerald-500/20 text-emerald-300 border-emerald-500/30 px-4 py-1.5 text-sm font-medium tracking-wide">
            EXPLORE NEPAL
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 drop-shadow-sm tracking-tight">
            Discover Breathtaking Destinations
          </h1>
          <p className="text-xl md:text-2xl text-emerald-100/90 font-light max-w-3xl mx-auto">
            From ancient temples to towering peaks, experience Nepal's incredible diversity with our curated trekking routes.
          </p>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-20 flex-grow relative -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-xl border border-gray-100">
              <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mb-4" />
              <p className="text-xl text-gray-500 font-medium">Mapping destinations...</p>
            </div>
          ) : destinations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-xl border border-gray-100">
              <Compass className="h-16 w-16 text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No Destinations Found</h2>
              <p className="text-gray-500">We are currently updating our trekking routes. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {destinations.map((dest) => (
                <Card 
                  key={dest._id} 
                  className="group overflow-hidden hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-500 border-0 bg-white shadow-xl rounded-2xl flex flex-col"
                >
                  <div className="relative h-64 overflow-hidden bg-gray-200">
                    <Image
                      src={dest.image || "/placeholder.svg"}
                      alt={dest.title}
                      fill
                      priority // Ensures the LCP image loads fast for better Page Speed
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300"></div>
                    
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-emerald-900 font-bold px-3 py-1 rounded-full shadow-lg text-sm flex items-center gap-1.5 border border-white/20">
                      <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                      Region
                    </div>
                    
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="text-2xl font-bold drop-shadow-md">{dest.title}</h3>
                    </div>
                  </div>

                  <CardContent className="p-6 flex flex-col flex-grow">
                    <p className="text-gray-600 line-clamp-3 mb-6 leading-relaxed flex-grow">
                      {dest.description}
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 font-medium">Available Guides:</span>
                        <span className="font-bold text-gray-800">{dest.availableGuides || 0} guides</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 font-medium">Price Range:</span>
                        <span className="font-bold text-gray-800">{dest.priceRange || "Varies"}/day</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Available Treks</span>
                        <span className="text-lg font-bold text-emerald-700 flex items-center gap-1.5">
                          <Compass className="h-5 w-5" />
                          {dest.trekCount} Routes
                        </span>
                      </div>
                    </div>

                    <Link href={`/treks?region=${dest.slug}`} className="block mt-auto">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-6 font-bold shadow-lg shadow-emerald-600/20 group-hover:shadow-emerald-600/40 transition-all duration-300">
                        View Treks in Region
                        <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Planning Help */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">Need Help Planning Your Trip?</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Our travel experts can help you create the perfect custom itinerary combining multiple trekking destinations in Nepal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl h-14 px-8 text-lg font-bold shadow-xl shadow-emerald-700/20">
                Get Custom Itinerary
              </Button>
            </Link>
            <Link href="/guides">
              <Button size="lg" variant="outline" className="rounded-xl h-14 px-8 text-lg font-bold border-2 border-emerald-200 text-emerald-800 hover:bg-emerald-50 hover:border-emerald-300">
                Browse Expert Guides
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
