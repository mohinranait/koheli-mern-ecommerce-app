// For DB
export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  category: string;
  description: string;
  status: "active" | "inactive";
  priority: number;
  link?: string;
  createdAt: string;
}

export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
  status: "active" | "inactive"
  priority: number
  link?: string
}

export interface Category {
  id: string
  name: string
  slug: string
  image: string
}

// DB TYPE
export interface ICategory {
  _id: string
  name: string
  slug: string
  image: string
  status: string
  createdAt: string
}

export type TOrderStatus=  "pending"| "confirmed"| "delivered"| "cancelled"
export interface IOrder {
  _id: string
  productId: string
  productImg: string
  productName: string
  customerName: string
  phone: string
  address: string
  price: number
  status: TOrderStatus
  createdAt: string
  adminMessage?: string
}

export interface IUser {
  _id: string
  name: string
  phone: string
  address: string
  role: "admin" | "user"
  status: "active" | "inactive"
  createdAt: string
  lastLogin?: string
}


export interface SocialProofNotification {
  _id: string;
  beforeText: string;
  afterText: string;
  title: string;
  image: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}
