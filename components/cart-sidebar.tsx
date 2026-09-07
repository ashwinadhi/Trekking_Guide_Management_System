"use client"

import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Minus, ShoppingCart } from "lucide-react"
import { CheckoutModal } from "./checkout-modal"
import { useState } from "react"

export function CartSidebar() {
  const { state, dispatch } = useCart()
  const [showCheckout, setShowCheckout] = useState(false)

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const updateRentalDays = (id: string, rentalDays: number) => {
    dispatch({ type: "UPDATE_RENTAL_DAYS", payload: { id, rentalDays } })
  }

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  if (!state.isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/70" onClick={() => dispatch({ type: "CLOSE_CART" })} />

      <div className="fixed right-0 top-0 z-50 h-full w-96 border-l border-gold/20 bg-card">
        <div className="flex items-center justify-between border-b border-gold/20 p-5">
          <h2 className="font-display text-xl text-ivory">Equipment ({state.items.length})</h2>
          <Button variant="ghost" size="sm" className="text-ivory" onClick={() => dispatch({ type: "CLOSE_CART" })}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="max-h-[calc(100vh-200px)] flex-1 overflow-y-auto p-4">
          {state.items.length === 0 ? (
            <div className="py-8 text-center text-stone">
              <ShoppingCart className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={item.id} className="border border-gold/15 p-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="h-16 w-16 object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-ivory">{item.name}</h3>
                      <Badge variant="secondary" className="mb-2 text-xs">
                        {item.category}
                      </Badge>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-stone">Quantity:</span>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 bg-transparent p-0"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 bg-transparent p-0"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-stone">Rental Days:</span>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 bg-transparent p-0"
                              onClick={() => updateRentalDays(item.id, Math.max(1, item.rentalDays - 1))}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm">{item.rentalDays}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 bg-transparent p-0"
                              onClick={() => updateRentalDays(item.id, item.rentalDays + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-display text-lg text-gold">
                          ${(item.price * item.quantity * item.rentalDays).toFixed(2)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-destructive hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {state.items.length > 0 && (
          <div className="border-t border-gold/20 bg-secondary p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-ivory">Total</span>
              <span className="font-display text-2xl text-gold">${state.total.toFixed(2)}</span>
            </div>
            <Button className="w-full" onClick={() => setShowCheckout(true)}>
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        cartItems={state.items}
        total={state.total}
      />
    </>
  )
}
