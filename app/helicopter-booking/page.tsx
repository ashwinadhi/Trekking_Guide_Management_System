"use client"

import { useState, useEffect } from "react"
import { Check, Loader2, ArrowRight, Search, Filter, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { PageHero } from "@/components/luxury/page-hero"
import { HelicopterTakeoff } from "@/components/luxury/helicopter-takeoff"
import { HelicopterBookingModal, type HelicopterOption } from "@/components/helicopter-booking-modal"

export default function HelicopterBookingPage() {
  const [helicopters, setHelicopters] = useState<HelicopterOption[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<HelicopterOption | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  useEffect(() => {
    async function fetchHelicopters() {
      try {
        const res = await fetch("/api/helicopters")
        if (res.ok) setHelicopters(await res.json())
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchHelicopters()
  }, [])

  const types = ["all", ...new Set(helicopters.map((h) => h.type).filter(Boolean))]

  const filtered = helicopters
    .filter(
      (h) =>
        (selectedType === "all" || h.type === selectedType) &&
        h.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "price-low") return a.pricePerFlight - b.pricePerFlight
      if (sortBy === "price-high") return b.pricePerFlight - a.pricePerFlight
      return a.name.localeCompare(b.name)
    })

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <PageHero
        eyebrow="Private air"
        title="Helicopter charter"
        subtitle="Everest sightseeing, heli-treks, and private Himalayan transfers — dispatched from Kathmandu."
      />

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <HelicopterTakeoff />
        </div>
      </section>

      <section className="border-y border-gold/15 bg-card py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 text-center">
            <p className="luxury-label mb-3">The fleet</p>
            <h2 className="font-display text-4xl text-ivory">Choose your aircraft</h2>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 lg:flex-row">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone" />
              <Input
                placeholder="Search aircraft…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 border-gold/20 pl-10 focus:ring-gold"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="h-12 w-full sm:w-44">
                <Filter className="mr-2 h-4 w-4 text-gold" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === "all" ? "All types" : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-12 w-full sm:w-44">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-low">Price low–high</SelectItem>
                <SelectItem value="price-high">Price high–low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="flex-grow py-20">
        <div className="mx-auto max-w-7xl px-4">
          {loading ? (
            <div className="flex flex-col items-center py-20">
              <Loader2 className="mb-4 h-10 w-10 animate-spin text-gold" />
              <p className="text-stone">Preparing the flight desk…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <h3 className="font-display text-2xl text-ivory">No aircraft listed yet</h3>
              <p className="mt-2 text-stone">Our concierge can still arrange a private charter — contact us.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((h) => (
                <div key={h._id} className="group flex flex-col overflow-hidden border border-gold/20 bg-card">
                  <div className="relative h-64 overflow-hidden">
                    <img src={h.image} alt={h.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute left-4 top-4 bg-primary px-3 py-1 text-[10px] uppercase tracking-widest text-primary-foreground">
                      {h.type}
                    </div>
                    <div className="absolute bottom-4 right-4 border border-gold/20 bg-ink/90 px-4 py-2">
                      <p className="text-[10px] uppercase tracking-widest text-stone">Per flight day</p>
                      <p className="font-display text-2xl text-gold">${h.pricePerFlight}</p>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-2xl text-ivory">{h.name}</h3>
                    <p className="mt-2 flex items-center gap-2 text-sm text-stone">
                      <Users className="h-4 w-4 text-gold" /> Pilot {h.pilotName} · {h.capacity} seats
                    </p>
                    <Button
                      onClick={() => {
                        setSelected(h)
                        setIsModalOpen(true)
                      }}
                      className="mt-8 w-full"
                    >
                      Reserve this charter <ArrowRight size={16} className="ml-2" />
                    </Button>
                    <p className="mt-3 flex items-center gap-1 text-[11px] uppercase tracking-widest text-stone">
                      <Check size={12} className="text-gold" /> Licensed Himalayan operators
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      {selected && (
        <HelicopterBookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} helicopter={selected} />
      )}
    </div>
  )
}
