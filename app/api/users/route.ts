import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const role = searchParams.get("role")
    const status = searchParams.get("status")

    const query: any = {}

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
      ]
    }

    if (role && role !== "all") {
      query.role = role
    }

    if (status && status !== "all") {
      query.status = status
    }

    const users = await User.find(query).sort({ createdAt: -1 })

    return NextResponse.json({ success: true, data: users })
  } catch (error) {
    console.error("Users GET error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    const { name, phone, address, role, status } = body

    // Check if phone already exists
    const existingUser = await User.findOne({ phone })
    if (existingUser) {
      return NextResponse.json({ success: false, error: "Phone number already exists" }, { status: 400 })
    }

    const user = await User.create({
      name,
      phone,
      address,
      role: role || "user",
      status: status || "active",
    })

    return NextResponse.json({ success: true, data: user }, { status: 201 })
  } catch (error) {
    console.error("Users POST error:", error)
    return NextResponse.json({ success: false, error: "Failed to create user" }, { status: 500 })
  }
}
