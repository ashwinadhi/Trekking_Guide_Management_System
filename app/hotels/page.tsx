"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MapPin, Wifi, Utensils, Mountain, Users, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { PageHero } from "@/components/luxury/page-hero"
import { SectionHeader } from "@/components/luxury/section-header"

export default function HotelsPage() {
  const [hotels, setHotels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchHotels() {
      try {
        const res = await fetch("/api/hotels")
        if (res.ok) setHotels(await res.json())
      } catch (err) {
        console.error("Failed to load hotels", err)
      } finally {
        setLoading(false)
      }
    }
    fetchHotels()
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <PageHero
        eyebrow="Mountain lodges"
        title="Stay along the trail"
        subtitle="Hand-selected lodges and hotels with Himalayan aspect and considered hospitality."
      />

      <section className="flex-grow py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-gold" />
            </div>
          ) : hotels.length === 0 ? (
            <div className="py-20 text-center text-stone">
              <Mountain className="mx-auto mb-4 h-16 w-16 text-gold/30" />
              <h2 className="font-display text-2xl text-ivory">No lodges listed</h2>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {hotels.map((hotel) => {
                const startingPrice =
                  hotel.rooms?.find((r: any) => r.type === "Standard")?.price || hotel.rooms?.[0]?.price || 0
                return (
                  <Card key={hotel._id} className="overflow-hidden border-gold/20">
                    <div className="grid h-full grid-cols-1 md:grid-cols-2">
                      <div className="relative h-64 md:h-full">
                        <img src={hotel.images?.[0] || "/placeholder.svg"} alt={hotel.name} className="h-full w-full object-cover" />
                        <Badge className="absolute left-4 top-4 bg-gold text-ink">From ${startingPrice}/night</Badge>
                      </div>
                      <CardContent className="flex h-full flex-col p-6">
                        <div className="mb-2 flex items-start gap-2">
                          <MapPin className="mt-1 h-4 w-4 shrink-0 text-gold" />
                          <span className="text-sm text-gold">{hotel.destinationId?.title || "Nepal"}</span>
                        </div>
                        <h3 className="font-display text-2xl text-ivory">{hotel.name}</h3>
                        <p className="mb-4 mt-2 line-clamp-3 text-sm text-stone">{hotel.description}</p>
                        <div className="mb-6 flex-grow">
                          <div className="flex flex-wrap gap-2">
                            {hotel.amenities.slice(0, 4).map((amenity: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Link href={`/hotels/${hotel._id}`}>
                          <Button className="w-full">View & reserve</Button>
                        </Link>
                      </CardContent>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-gold/15 bg-card py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeader eyebrow="Hospitality" title="Why these lodges" />
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-4">
            {[
              { icon: Mountain, title: "Aspect", desc: "Himalayan views from considered rooms." },
              { icon: Utensils, title: "Cuisine", desc: "Nepali cooking, prepared with care." },
              { icon: Wifi, title: "Comfort", desc: "Hot water, rest, and connection after the trail." },
              { icon: Users, title: "Welcome", desc: "Local families and seasoned staff." },
            ].map((item) => (
              <div key={item.title} className="border border-gold/15 p-6 text-center">
                <item.icon className="mx-auto mb-4 h-7 w-7 text-gold" strokeWidth={1.25} />
                <h3 className="font-display text-xl text-ivory">{item.title}</h3>
                <p className="mt-2 text-sm text-stone">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
