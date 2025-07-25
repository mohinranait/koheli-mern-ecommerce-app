import type { Product, Category, IOrder, User } from "@/types"

export const categories: Category[] = [
  {
    id: "1",
    name: "Furniture",
    slug: "furniture",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "2",
    name: "Electronics",
    slug: "electronics",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "3",
    name: "Fashion",
    slug: "fashion",
    image: "/placeholder.svg?height=300&width=400",
  },
]

export const products: Product[] = [
  // Furniture
  {
    id: "1",
    name: "Modern Sofa Set",
    price: 45000,
    image: "/placeholder.svg?height=300&width=300",
    category: "furniture",
    description: "Comfortable 3-seater modern sofa with premium fabric upholstery.",
    status: "active",
    priority: 1,
  },
  {
    id: "2",
    name: "Dining Table",
    price: 25000,
    image: "/placeholder.svg?height=300&width=300",
    category: "furniture",
    description: "6-seater wooden dining table with elegant design.",
    status: "active",
    priority: 2,
  },
  {
    id: "3",
    name: "Office Chair",
    price: 8000,
    image: "/placeholder.svg?height=300&width=300",
    category: "furniture",
    description: "Ergonomic office chair with lumbar support.",
    status: "active",
    priority: 3,
  },

  // Electronics
  {
    id: "4",
    name: "Smartphone",
    price: 35000,
    image: "/placeholder.svg?height=300&width=300",
    category: "electronics",
    description: "Latest smartphone with advanced camera and long battery life.",
    status: "active",
    priority: 1,
  },
  {
    id: "5",
    name: "Laptop",
    price: 65000,
    image: "/placeholder.svg?height=300&width=300",
    category: "electronics",
    description: "High-performance laptop for work and gaming.",
    status: "active",
    priority: 2,
  },
  {
    id: "6",
    name: "Headphones",
    price: 5000,
    image: "/placeholder.svg?height=300&width=300",
    category: "electronics",
    description: "Wireless noise-cancelling headphones.",
    status: "active",
    priority: 3,
  },

  // Fashion
  {
    id: "7",
    name: "Casual T-Shirt",
    price: 1200,
    image: "/placeholder.svg?height=300&width=300",
    category: "fashion",
    description: "Comfortable cotton t-shirt for everyday wear.",
    status: "active",
    priority: 1,
  },
  {
    id: "8",
    name: "Jeans",
    price: 2500,
    image: "/placeholder.svg?height=300&width=300",
    category: "fashion",
    description: "Premium denim jeans with perfect fit.",
    status: "active",
    priority: 2,
  },
  {
    id: "9",
    name: "Sneakers",
    price: 4500,
    image: "/placeholder.svg?height=300&width=300",
    category: "fashion",
    description: "Comfortable sports sneakers for daily use.",
    status: "active",
    priority: 3,
  },
]

export const orders: IOrder[] = [
  {
    _id: "1",
    productId: "1",
    productName: "Modern Sofa Set",
    customerName: "John Doe",
    phone: "01712345678",
    address: "Dhaka, Bangladesh",
    price: 45000,
    status: "pending",
    createdAt: "2024-01-15",
    adminMessage: "Your order is being processed. We will contact you soon for delivery confirmation.",
  },
  {
    id: "2",
    productId: "4",
    productName: "Smartphone",
    customerName: "Jane Smith",
    phone: "01798765432",
    address: "Chittagong, Bangladesh",
    price: 35000,
    status: "confirmed",
    createdAt: "2024-01-14",
    adminMessage: "Your order has been confirmed. Expected delivery in 2-3 business days.",
  },
]

export const users: User[] = [
  {
    id: "1",
    name: "Admin User",
    phone: "01700000000",
    address: "Dhaka, Bangladesh",
    role: "admin",
    status: "active",
    createdAt: "2024-01-01",
    lastLogin: "2024-01-20",
  },
  {
    id: "2",
    name: "John Doe",
    phone: "01712345678",
    address: "Dhaka, Bangladesh",
    role: "user",
    status: "active",
    createdAt: "2024-01-10",
    lastLogin: "2024-01-19",
  },
  {
    id: "3",
    name: "Jane Smith",
    phone: "01798765432",
    address: "Chittagong, Bangladesh",
    role: "user",
    status: "active",
    createdAt: "2024-01-12",
    lastLogin: "2024-01-18",
  },
  {
    id: "4",
    name: "Bob Wilson",
    phone: "01755555555",
    address: "Sylhet, Bangladesh",
    role: "user",
    status: "inactive",
    createdAt: "2024-01-08",
    lastLogin: "2024-01-15",
  },
  {
    id: "5",
    name: "Alice Johnson",
    phone: "01766666666",
    address: "Rajshahi, Bangladesh",
    role: "user",
    status: "active",
    createdAt: "2024-01-05",
    lastLogin: "2024-01-17",
  },
]
