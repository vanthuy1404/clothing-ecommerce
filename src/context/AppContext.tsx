"use client"

import type React from "react"
import { createContext, useContext, useState, type ReactNode } from "react"
import type { User, Product, CartItem, Order } from "../types"
import { products } from "../data"

interface AppContextType {
  user: User | null
  products: Product[]
  cart: CartItem[]
  orders: Order[]
  login: (email: string, password: string) => boolean
  register: (email: string, password: string, name: string) => boolean
  logout: () => void
  addToCart: (product: Product, size: string, color: string) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  createOrder: (address: string, phone: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  const login = (email: string, password: string): boolean => {
    const fakeUser: User = {
      id: "1",
      email,
      name: email.split("@")[0],
      phone: "0123456789",
      address: "Hà Nội, Việt Nam",
    }
    setUser(fakeUser)
    return true
  }

  const register = (email: string, password: string, name: string): boolean => {
    const fakeUser: User = {
      id: Date.now().toString(),
      email,
      name,
      phone: "",
      address: "",
    }
    setUser(fakeUser)
    return true
  }

  const logout = () => {
    setUser(null)
    setCart([])
  }

  const addToCart = (product: Product, size: string, color: string) => {
    const existingItem = cart.find(
      (item) => item.product.id === product.id && item.size === size && item.color === color,
    )

    if (existingItem) {
      updateQuantity(existingItem.id, existingItem.quantity + 1)
    } else {
      const newItem: CartItem = {
        id: Date.now().toString(),
        product,
        quantity: 1,
        size,
        color,
      }
      setCart([...cart, newItem])
    }
  }

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCart(cart.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const createOrder = (address: string, phone: string) => {
    const order: Order = {
      id: Date.now().toString(),
      items: [...cart],
      total: cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
      status: "Chờ xác nhận",
      date: new Date().toLocaleDateString("vi-VN"),
      address,
      phone,
    }
    setOrders([order, ...orders])
    setCart([])
  }

  return (
    <AppContext.Provider
      value={{
        user,
        products,
        cart,
        orders,
        login,
        register,
        logout,
        addToCart,
        removeFromCart,
        updateQuantity,
        createOrder,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}
