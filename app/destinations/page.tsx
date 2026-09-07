"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Compass, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { PageHero } from "@/components/luxury/page-hero"
import { SectionHeader } from "@/components/luxury/section-header"

interface Destination {
  _id: string
  title: string
  description: string
  image: string
  slug: string
  trekCount: number
  availableGuides?: number
  priceRange?: string
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const res = await fetch("/api/destinations")
        if (res.ok) setDestinations(await res.json())
      } catch (err) {
        console.error("Failed to load destinations", err)
      } finally {
        setLoading(false)
      }
    }
    fetchDestinations()
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <PageHero
        eyebrow="The Himalaya"
        title="Destinations"
        subtitle="From Kathmandu’s courtyards to the high passes — regions we know intimately."
      />

      <section className="flex-grow py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center py-20">
              <Loader2 className="mb-4 h-12 w-12 animate-spin text-gold" />
              <p className="text-stone">Mapping destinations…</p>
            </div>
          ) : destinations.length === 0 ? (
            <div className="py-20 text-center">
              <Compass className="mx-auto mb-4 h-16 w-16 text-gold/30" />
              <h2 className="font-display text-2xl text-ivory">No destinations listed</h2>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {destinations.map((dest) => (
                <Card key={dest._id} className="flex flex-col overflow-hidden border-gold/20">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={dest.image || "/placeholder.svg"}
                      alt={dest.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent" />
                    <h3 className="absolute bottom-4 left-4 font-display text-2xl text-ivory">{dest.title}</h3>
                  </div>
                  <CardContent className="flex flex-grow flex-col p-6">
                    <p className="mb-6 line-clamp-3 flex-grow text-stone">{dest.description}</p>
                    <div className="mb-6 space-y-2 text-sm">
                      <div className="flex justify-between text-stone">
                        <span>Guides</span>
                        <span className="text-ivory">{dest.availableGuides || 0}</span>
                      </div>
                      <div className="flex justify-between text-stone">
                        <span>From</span>
                        <span className="text-gold">{dest.priceRange || "Varies"}/day</span>
                      </div>
                      <div className="flex justify-between text-stone">
                        <span>Routes</span>
                        <span className="text-ivory">{dest.trekCount}</span>
                      </div>
                    </div>
                    <Link href={`/treks?region=${dest.slug}`}>
                      <Button className="w-full">
                        View expeditions
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-gold/15 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <SectionHeader
            eyebrow="Planning"
            title="Compose a multi-region journey"
            subtitle="Our planners combine valleys, lodges, and private guiding around your dates."
          />
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/contact">
              <Button>Speak with a planner</Button>
            </Link>
            <Link href="/guides">
              <Button variant="outline" className="border-gold/40 bg-transparent text-gold hover:bg-gold hover:text-ink">
                Browse guides
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
