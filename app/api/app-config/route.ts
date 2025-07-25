import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import AppConfig from "@/models/AppConfig"

export async function GET() {
  try {
    await dbConnect()

    let config = await AppConfig.findOne()

    if (!config) {
      // Create default config if none exist
      config = await AppConfig.create({})
    }

    return NextResponse.json({ success: true, data: config })
  } catch (error) {
    console.error("App Config GET error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch app config" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()

    let config = await AppConfig.findOne()

    if (!config) {
      config = await AppConfig.create(body)
    } else {
      config = await AppConfig.findOneAndUpdate({}, body, { new: true, runValidators: true })
    }

    return NextResponse.json({ success: true, data: config })
  } catch (error) {
    console.error("App Config PUT error:", error)
    return NextResponse.json({ success: false, error: "Failed to update app config" }, { status: 500 })
  }
}
