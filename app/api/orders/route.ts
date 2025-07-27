import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Order from "@/models/Order"
import '@/models/Product';
import User from "@/models/User";

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const status = searchParams.get("status")
    const phone = searchParams.get("phone")

    const query: any = {}

    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: "i" } },
        { productName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ]
    }

    if (status && status !== "all") {
      query.status = status
    }

    if (phone) {
      query.phone = phone
    }

    const orders = await Order.find(query).populate("productId", "name price image").sort({ createdAt: -1 })

    return NextResponse.json({ success: true, data: orders })
  } catch (error) {
    console.error("Orders GET error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    const { productId, productName, customerName, phone, address, price,productImg } = body

    if (!phone) {
      return NextResponse.json({ success: false, error: "Phone number is required" }, { status: 400 })
    }

    // Find or create user
      let user = await User.findOne({ phone })

      if (!user) {
          // Create new user if doesn't exist
          user = await User.create({
            name: "User", 
            phone,
            address: "Not provided", 
            role: "user",
            status: "active",
          })
      }

    const order = await Order.create({
      productId,
      productName,
      customerName,
      productImg,
      phone,
      address,
      price: Number.parseFloat(price),
    })

    return NextResponse.json({ success: true, data: user }, { status: 201 })
  } catch (error) {
    console.error("Orders POST error:", error)
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
  }
}
