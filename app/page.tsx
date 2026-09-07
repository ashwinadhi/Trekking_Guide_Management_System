"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Mountain, Users, Shield, Award, Calendar, Car, Backpack, Clock, Loader2, Plane } from "lucide-react"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
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

export default function HomePage() {
  const [featuredTreks, setFeaturedTreks] = useState<Trek[]>([])
  const [treksLoading, setTreksLoading] = useState(true)

  useEffect(() => {
    async function fetchTreks() {
      try {
        const res = await fetch("/api/treks")
        if (res.ok) {
          const data = await res.json()
          setFeaturedTreks(data.slice(0, 3))
        }
      } catch (err) {
        console.error("Failed to fetch treks", err)
      } finally {
        setTreksLoading(false)
      }
    }
    fetchTreks()
  }, [])

  const stats = [
    { icon: Mountain, label: "Private expeditions", value: "500+" },
    { icon: Users, label: "International guests", value: "2,000+" },
    { icon: Shield, label: "Years of stewardship", value: "15+" },
    { icon: Award, label: "Safe completions", value: "99%" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative flex h-screen items-center justify-center">
        <div className="absolute inset-0">
          <Image src="/images/mountain-sunrise.jpg" alt="Nepal Mountains" fill className="object-cover ken-burns" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-ink" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <p className="luxury-label mb-6">Kathmandu · Licensed Himalayan specialists</p>
          <h1 className="font-display text-5xl font-medium leading-[1.05] text-ivory md:text-7xl">
            Private Himalayan
            <span className="mt-2 block italic text-gold">expeditions</span>
          </h1>
          <div className="luxury-hairline" />
          <p className="mx-auto mt-8 max-w-2xl text-lg text-stone md:text-xl">
            Bespoke treks, private licensed guides, mountain lodges, and chauffeur arrival — arranged for travellers who
            expect discretion and excellence.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/treks">
              <Button size="lg" className="px-8 py-6 text-xs uppercase tracking-[0.22em]">
                Explore expeditions
              </Button>
            </Link>
            <Link href="/car-booking">
              <Button
                size="lg"
                variant="outline"
                className="border-gold/60 bg-transparent px-8 py-6 text-xs uppercase tracking-[0.22em] text-ivory hover:bg-gold hover:text-ink"
              >
                Airport chauffeur
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-gold/20 bg-card">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="mx-auto mb-4 h-6 w-6 text-gold" strokeWidth={1.25} />
                <div className="font-display text-4xl text-ivory">{stat.value}</div>
                <div className="mt-2 text-[11px] uppercase tracking-[0.2em] text-stone">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Signature journeys"
            title="Featured expeditions"
            subtitle="Carefully curated Himalayan routes, privately guided, with lodge stays arranged to your preference."
          />

          {treksLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
          ) : featuredTreks.length === 0 ? (
            <div className="py-12 text-center">
              <Mountain className="mx-auto mb-3 h-12 w-12 text-gold/40" />
              <p className="text-stone">Expeditions will be published shortly.</p>
            </div>
          ) : (
            <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
              {featuredTreks.map((trek) => (
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

          <div className="mt-14 text-center">
            <Link href="/treks">
              <Button variant="outline" size="lg" className="border-gold/50 bg-transparent text-gold hover:bg-gold hover:text-ink">
                View all expeditions
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-gold/15 bg-card py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="The house"
            title="A complete Himalayan atelier"
            subtitle="Guides, lodges, chauffeur, helicopter, and equipment — one concierge, one standard."
          />

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Car,
                title: "Chauffeur & arrival",
                body: "Airport transfers, city touring, and trailhead transport with professional drivers.",
                href: "/car-booking",
                cta: "Arrange transfer",
              },
              {
                icon: Plane,
                title: "Helicopter charter",
                body: "Sightseeing, heli-treks, and private charters from Kathmandu with a dedicated flight desk.",
                href: "/helicopter-booking",
                cta: "Request a flight",
              },
              {
                icon: Mountain,
                title: "Private guides",
                body: "Licensed local specialists with trail mastery, cultural fluency, and uncompromising safety.",
                href: "/guides",
                cta: "Meet the guides",
              },
              {
                icon: Backpack,
                title: "Equipment atelier",
                body: "High-altitude kit, fitted and delivered to your Kathmandu hotel before departure.",
                href: "/equipment",
                cta: "View equipment",
              },
            ].map((service) => (
              <div key={service.title} className="border border-gold/20 bg-background p-8 text-center lg:p-10">
                <service.icon className="mx-auto mb-6 h-8 w-8 text-gold" strokeWidth={1.25} />
                <h3 className="font-display text-2xl text-ivory">{service.title}</h3>
                <p className="mt-4 text-stone">{service.body}</p>
                <Link href={service.href}>
                  <Button variant="outline" className="mt-8 border-gold/40 bg-transparent text-gold hover:bg-gold hover:text-ink">
                    {service.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-28">
        <div className="absolute inset-0">
          <Image src="/images/mountain-sunrise.jpg" alt="" fill className="object-cover object-bottom opacity-40" />
          <div className="absolute inset-0 bg-ink/80" />
        </div>
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <p className="luxury-label mb-4">Private concierge</p>
          <h2 className="font-display text-4xl text-ivory md:text-5xl">Begin your Himalayan season</h2>
          <div className="luxury-hairline" />
          <p className="mt-6 text-lg text-stone">
            Speak with a planner in Kathmandu. We craft dates, lodges, and private guiding around your arrival.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/booking">
              <Button size="lg" className="px-8 text-xs uppercase tracking-[0.22em]">
                <Calendar className="mr-2 h-4 w-4" />
                Reserve your trek
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-gold/50 bg-transparent px-8 text-xs uppercase tracking-[0.22em] text-ivory hover:bg-gold hover:text-ink"
              >
                Speak with a planner
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
