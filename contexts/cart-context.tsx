"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  category: string
  rentalDays: number
  quantity: number
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  total: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "UPDATE_RENTAL_DAYS"; payload: { id: string; rentalDays: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find((item) => item.id === action.payload.id)

      if (existingItem) {
        const updatedItems = state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
        return {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems),
          isOpen: true,
        }
      }

      const newItems = [...state.items, { ...action.payload, quantity: 1 }]
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
        isOpen: true,
      }
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload)
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
      }
    }

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        const newItems = state.items.filter((item) => item.id !== action.payload.id)
        return {
          ...state,
          items: newItems,
          total: calculateTotal(newItems),
        }
      }

      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item,
      )
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
      }
    }

    case "UPDATE_RENTAL_DAYS": {
      const updatedItems = state.items.map((item) =>
        item.id === action.payload.id ? { ...item, rentalDays: action.payload.rentalDays } : item,
      )
      return {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
      }
    }

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        total: 0,
      }

    case "TOGGLE_CART":
      return {
        ...state,
        isOpen: !state.isOpen,
      }

    case "OPEN_CART":
      return {
        ...state,
        isOpen: true,
      }

    case "CLOSE_CART":
      return {
        ...state,
        isOpen: false,
      }

    default:
      return state
  }
}

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => {
    return total + item.price * item.quantity * item.rentalDays
  }, 0)
}

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
} | null>(null)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
    total: 0,
  })

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
