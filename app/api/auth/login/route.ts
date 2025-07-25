import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    const { phone } = body

    if (!phone) {
      return NextResponse.json({ success: false, error: "Phone number is required" }, { status: 400 })
    }

    // Find or create user
    let user = await User.findOne({ phone })

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        name: "User", // Default name, can be updated later
        phone,
        address: "Not provided", // Default address
        role: "user",
        status: "active",
      })
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    return NextResponse.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        status: user.status,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ success: false, error: "Login failed" }, { status: 500 })
  }
}
