"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Star, MapPin, Languages, Filter, Users, Loader2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { PageHero } from "@/components/luxury/page-hero"
import { SectionHeader } from "@/components/luxury/section-header"

interface Guide {
  _id: string
  name: string
  profileImage: string
  description: string
  services: string[]
  yearsExperience: number
  languages: string[]
  availabilityStatus: "available" | "on_trek" | "busy"
  unavailableFrom: string | null
  unavailableTo: string | null
  price: number
  reviews: { user: string; comment: string; rating: number }[]
}

export default function GuidesPage() {
  const [guides, setGuides] = useState<Guide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchGuides() {
      try {
        const res = await fetch("/api/guides")
        if (res.ok) setGuides(await res.json())
      } catch (err) {
        console.error("Failed to fetch guides", err)
      } finally {
        setLoading(false)
      }
    }
    fetchGuides()
  }, [])

  const avgRating = (reviews: Guide["reviews"]) => {
    if (!reviews.length) return 0
    return (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
  }

  const availabilityColor = (s: string) =>
    s === "available" ? "bg-gold text-ink" : s === "on_trek" ? "bg-amber-700 text-ivory" : "bg-destructive text-ivory"

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageHero
        eyebrow="Private guides"
        title="Licensed Himalayan specialists"
        subtitle="Verified local guides for trekking, culture, and private touring — selected for discretion and trail mastery."
      />

      <section className="border-b border-gold/15 py-10">
        <div className="mx-auto max-w-4xl px-4">
          <div className="flex flex-col items-center gap-4 border border-gold/20 bg-card p-6 md:flex-row">
            <div className="flex flex-1 items-center gap-2">
              <MapPin className="h-5 w-5 text-gold" />
              <Input placeholder="Search by specialty…" className="border-0 bg-transparent focus-visible:ring-0" />
            </div>
            <Select>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Destination" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Destinations</SelectItem>
                <SelectItem value="kathmandu">Kathmandu Valley</SelectItem>
                <SelectItem value="pokhara">Pokhara</SelectItem>
                <SelectItem value="everest">Everest Region</SelectItem>
                <SelectItem value="annapurna">Annapurna Region</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Filter className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="font-display text-3xl text-ivory">Available guides</h2>
              <p className="text-stone">{guides.length} specialists</p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center py-20">
              <Loader2 className="mb-4 h-10 w-10 animate-spin text-gold" />
              <p className="text-stone">Loading guides…</p>
            </div>
          ) : guides.length === 0 ? (
            <div className="py-20 text-center">
              <Users className="mx-auto mb-4 h-16 w-16 text-gold/30" />
              <h3 className="font-display text-2xl text-ivory">No guides listed yet</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {guides.map((guide) => (
                <Card key={guide._id} className="overflow-hidden border-gold/20">
                  <div className="relative">
                    {guide.profileImage ? (
                      <img
                        src={guide.profileImage}
                        alt={guide.name}
                        className="h-52 w-full object-cover"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                        }}
                      />
                    ) : (
                      <div className="flex h-52 w-full items-center justify-center bg-secondary">
                        <Users className="h-16 w-16 text-gold/40" />
                      </div>
                    )}
                    <Badge className={`absolute left-3 top-3 capitalize ${availabilityColor(guide.availabilityStatus)}`}>
                      {guide.availabilityStatus.replace("_", " ")}
                    </Badge>
                    {guide.reviews.length > 0 && (
                      <div className="absolute right-3 top-3 flex items-center gap-1 border border-gold/30 bg-ink/80 px-2 py-1">
                        <Star className="h-4 w-4 fill-current text-gold" />
                        <span className="text-sm text-ivory">{avgRating(guide.reviews)}</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h3 className="font-display text-2xl text-ivory">{guide.name}</h3>
                        <div className="flex items-center gap-1 text-sm text-stone">
                          <Clock className="h-4 w-4" />
                          {guide.yearsExperience} years
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-2xl text-gold">${guide.price}</div>
                        <div className="text-xs text-stone">per day</div>
                      </div>
                    </div>
                    <p className="mb-4 line-clamp-2 text-sm text-stone">{guide.description}</p>
                    <div className="mb-4 flex flex-wrap gap-1">
                      {guide.languages.map((lang, i) => (
                        <span key={i} className="border border-gold/20 px-2 py-0.5 text-xs text-stone">
                          {lang}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/guides/${guide._id}`} className="flex-1">
                        <Button variant="outline" className="w-full bg-transparent">
                          Profile
                        </Button>
                      </Link>
                      <Link href={`/booking?guide=${guide._id}`} className="flex-1">
                        <Button className="w-full">Reserve</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-gold/15 bg-card py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeader eyebrow="Assurance" title="Why travellers choose our guides" />
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-4">
            {[
              { title: "Licensed", desc: "Government-licensed and background-checked." },
              { title: "Reviewed", desc: "Notes from verified international guests." },
              { title: "Direct", desc: "Speak with your guide before you fly." },
              { title: "Flexible", desc: "Dates arranged around your arrival." },
            ].map((item) => (
              <div key={item.title} className="text-center">
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
