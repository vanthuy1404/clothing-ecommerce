export interface User {
  id: string
  email: string
  name: string
  phone?: string
  address?: string
}

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  size: string[]
  color: string[]
  description: string
  stock: number
}

export interface CartItem {
  id: string
  productId: string
  product: Product
  quantity: number
  size: string
  color: string
}

export interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  status: "pending" | "confirmed" | "shipping" | "delivered" | "cancelled"
  createdAt: string
  shippingAddress: string
  phone: string
}
