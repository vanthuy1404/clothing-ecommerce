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
  image: string
  category: string
  sizes: string[]
  colors: string[]
  description: string
  stock: number
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  size: string
  color: string
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: string
  date: string
  address: string
  phone: string
}
