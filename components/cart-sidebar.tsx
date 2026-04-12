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
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => dispatch({ type: "CLOSE_CART" })} />

      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Equipment Cart ({state.items.length})
          </h2>
          <Button variant="ghost" size="sm" onClick={() => dispatch({ type: "CLOSE_CART" })}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 max-h-[calc(100vh-200px)]">
          {state.items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={item.id} className="border rounded-lg p-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <Badge variant="secondary" className="text-xs mb-2">
                        {item.category}
                      </Badge>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Quantity:</span>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0 bg-transparent"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0 bg-transparent"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Rental Days:</span>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0 bg-transparent"
                              onClick={() => updateRentalDays(item.id, Math.max(1, item.rentalDays - 1))}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-sm w-8 text-center">{item.rentalDays}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-6 w-6 p-0 bg-transparent"
                              onClick={() => updateRentalDays(item.id, item.rentalDays + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="font-medium text-green-600">
                          ${(item.price * item.quantity * item.rentalDays).toFixed(2)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 h-6 px-2"
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
          <div className="border-t p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <span className="font-semibold">Total:</span>
              <span className="font-bold text-lg text-green-600">${state.total.toFixed(2)}</span>
            </div>
            <Button className="w-full bg-green-700 hover:bg-green-800" onClick={() => setShowCheckout(true)}>
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
