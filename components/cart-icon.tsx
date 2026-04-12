"use client"

import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"

export function CartIcon() {
  const { state, dispatch } = useCart()

  if (state.items.length === 0) return null

  return (
    <Button
      className="fixed top-20 right-4 z-30 bg-green-700 hover:bg-green-800 rounded-full p-3 shadow-lg"
      onClick={() => dispatch({ type: "TOGGLE_CART" })}
    >
      <ShoppingCart className="h-5 w-5" />
      <Badge className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full min-w-[20px] h-5 flex items-center justify-center text-xs">
        {state.items.reduce((total, item) => total + item.quantity, 0)}
      </Badge>
    </Button>
  )
}
