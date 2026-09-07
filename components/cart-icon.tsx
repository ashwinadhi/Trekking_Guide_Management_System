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
      className="fixed right-4 top-24 z-30 rounded-none border border-gold bg-ink p-3 text-gold hover:bg-gold hover:text-ink"
      onClick={() => dispatch({ type: "TOGGLE_CART" })}
    >
      <ShoppingCart className="h-5 w-5" />
      <Badge className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-none bg-gold text-xs text-ink">
        {state.items.reduce((total, item) => total + item.quantity, 0)}
      </Badge>
    </Button>
  )
}
