"use client"

import { useState } from "react"
import { Star, Search, Filter, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { getSessionId } from "@/lib/session"

export default function EquipmentPage() {
  const { dispatch } = useCart()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  const equipment = [
    {
      id: "1",
      name: "Professional Trekking Backpack 65L",
      price: 15,
      image: "/placeholder.svg?height=200&width=200&text=Backpack",
      category: "Backpacks",
      rating: 4.8,
      reviews: 124,
      features: ["Waterproof", "Ergonomic", "Multiple Compartments"],
      description: "High-quality 65L backpack perfect for multi-day treks",
    },
    {
      id: "2",
      name: "4-Season Mountaineering Tent",
      price: 25,
      image: "/placeholder.svg?height=200&width=200&text=Tent",
      category: "Shelter",
      rating: 4.9,
      reviews: 89,
      features: ["4-Season", "Lightweight", "Easy Setup"],
      description: "Durable tent suitable for extreme weather conditions",
    },
    {
      id: "3",
      name: "Down Sleeping Bag (-10°C)",
      price: 20,
      image: "/placeholder.svg?height=200&width=200&text=Sleeping+Bag",
      category: "Sleep System",
      rating: 4.7,
      reviews: 156,
      features: ["Down Fill", "Compact", "Warm"],
      description: "Premium down sleeping bag rated for -10°C",
    },
    {
      id: "4",
      name: "Trekking Poles (Pair)",
      price: 8,
      image: "/placeholder.svg?height=200&width=200&text=Poles",
      category: "Accessories",
      rating: 4.6,
      reviews: 203,
      features: ["Adjustable", "Lightweight", "Shock Absorbing"],
      description: "Carbon fiber trekking poles with ergonomic grips",
    },
    {
      id: "5",
      name: "High-Altitude Hiking Boots",
      price: 12,
      image: "/placeholder.svg?height=200&width=200&text=Boots",
      category: "Footwear",
      rating: 4.8,
      reviews: 167,
      features: ["Waterproof", "Insulated", "Crampon Compatible"],
      description: "Professional mountaineering boots for high altitude",
    },
    {
      id: "6",
      name: "Portable Camping Stove",
      price: 10,
      image: "/placeholder.svg?height=200&width=200&text=Stove",
      category: "Cooking",
      rating: 4.5,
      reviews: 98,
      features: ["Lightweight", "Wind Resistant", "Fuel Efficient"],
      description: "Compact gas stove perfect for trekking meals",
    },
    {
      id: "7",
      name: "Insulated Jacket",
      price: 18,
      image: "/placeholder.svg?height=200&width=200&text=Jacket",
      category: "Clothing",
      rating: 4.7,
      reviews: 134,
      features: ["Down Insulation", "Packable", "Water Resistant"],
      description: "Lightweight down jacket for cold weather protection",
    },
    {
      id: "8",
      name: "Water Purification System",
      price: 6,
      image: "/placeholder.svg?height=200&width=200&text=Filter",
      category: "Accessories",
      rating: 4.4,
      reviews: 76,
      features: ["Fast Filtration", "Portable", "Long Lasting"],
      description: "Advanced water filter for safe drinking water",
    },
  ]

  const categories = ["all", "Backpacks", "Shelter", "Sleep System", "Footwear", "Clothing", "Cooking", "Accessories"]

  const filteredEquipment = equipment
    .filter(
      (item) =>
        (selectedCategory === "all" || item.category === selectedCategory) &&
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const addToCart = async (item: (typeof equipment)[0]) => {
    // 1. Update local cart state immediately (optimistic UI)
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
        rentalDays: 1,
      },
    })

    // 2. Persist the cart item to MongoDB
    try {
      const sessionId = getSessionId()
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          itemId: item.id,
          itemType: "equipment",
          name: item.name,
          price: item.price,
          quantity: 1,
          rentalDays: 1,
          image: item.image,
          category: item.category,
        }),
      })
    } catch (err) {
      // Non-blocking — cart still works even if DB save fails
      console.error("Failed to persist cart item to DB:", err)
    }

    toast({
      title: "Added to Cart!",
      description: `${item.name} has been added to your cart.`,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Equipment Rental</h1>
          <p className="text-xl text-gray-600">
            Rent high-quality trekking and mountaineering equipment for your Nepal adventure
          </p>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEquipment.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-48 object-cover" />
                  <Badge className="absolute top-2 left-2 bg-white/90 text-gray-800">{item.category}</Badge>
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-xs font-medium">{item.rating}</span>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.features.slice(0, 2).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      <span>{item.rating}</span>
                      <span>({item.reviews})</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">${item.price}</div>
                      <div className="text-xs text-gray-500">per day</div>
                    </div>
                  </div>

                  <Button onClick={() => addToCart(item)} className="w-full bg-green-700 hover:bg-green-800">
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEquipment.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No equipment found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Rental Information */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Rental Information</h2>
            <p className="text-xl text-gray-600">Everything you need to know about our equipment rental service</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Rental Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Minimum rental period:</span>
                  <span className="font-medium">1 day</span>
                </div>
                <div className="flex justify-between">
                  <span>Security deposit:</span>
                  <span className="font-medium">50% of rental value</span>
                </div>
                <div className="flex justify-between">
                  <span>Late return fee:</span>
                  <span className="font-medium">$10 per day</span>
                </div>
                <div className="flex justify-between">
                  <span>Damage assessment:</span>
                  <span className="font-medium">Case by case</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pickup & Return</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Pickup locations:</span>
                  <span className="font-medium">Thamel, Kathmandu</span>
                </div>
                <div className="flex justify-between">
                  <span>Operating hours:</span>
                  <span className="font-medium">8 AM - 8 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Advance booking:</span>
                  <span className="font-medium">24 hours minimum</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery service:</span>
                  <span className="font-medium">Available (+$5)</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
