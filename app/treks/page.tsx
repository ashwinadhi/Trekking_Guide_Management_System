"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Mountain, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { PageHero } from "@/components/luxury/page-hero"
import { SectionHeader } from "@/components/luxury/section-header"
import { LuxuryCard } from "@/components/luxury/luxury-card"

interface Trek {
  _id: string
  title: string
  description: string
  price: number
  duration: string
  image: string
}

export default function TreksPage() {
  const [treks, setTreks] = useState<Trek[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTreks() {
      try {
        const res = await fetch("/api/treks")
        if (res.ok) setTreks(await res.json())
      } catch (err) {
        console.error("Failed to fetch treks", err)
      } finally {
        setLoading(false)
      }
    }
    fetchTreks()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageHero
        eyebrow="Expeditions"
        title="Himalayan itineraries"
        subtitle="Private routes with licensed guiding, permits, lodges, and meals — composed for international travellers."
      />

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center py-20">
              <Loader2 className="mb-4 h-10 w-10 animate-spin text-gold" />
              <p className="text-stone">Loading expeditions…</p>
            </div>
          ) : treks.length === 0 ? (
            <div className="py-20 text-center">
              <Mountain className="mx-auto mb-4 h-16 w-16 text-gold/30" />
              <h3 className="font-display text-2xl text-ivory">No expeditions published yet</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {treks.map((trek) => (
                <LuxuryCard
                  key={trek._id}
                  href={`/treks/${trek._id}`}
                  image={trek.image}
                  title={trek.title}
                  description={trek.description}
                  meta={trek.duration}
                  price={trek.price.toLocaleString()}
                  cta="View itinerary"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-gold/15 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <SectionHeader
            eyebrow="Bespoke"
            title="A private itinerary, composed for you"
            subtitle="Fitness, dates, and lodge preference — our Kathmandu planners design the route."
          />
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/contact">
              <Button>Request a custom trek</Button>
            </Link>
            <Link href="/booking">
              <Button variant="outline" className="border-gold/40 bg-transparent text-gold hover:bg-gold hover:text-ink">
                Reserve a consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-gold/15 bg-card py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Included" title="Every expedition includes" />
          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-4">
            {[
              { title: "Licensed guide", desc: "A private specialist for the full itinerary." },
              { title: "Permits", desc: "TIMS, national park, and restricted-area papers." },
              { title: "Lodges", desc: "Tea houses or camping as the route requires." },
              { title: "Meals", desc: "Breakfast, lunch, and dinner on trek." },
            ].map((item) => (
              <div key={item.title} className="border border-gold/20 p-6 text-center">
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
