import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import SiteSettings from "@/models/SiteSettings"

export async function GET() {
  try {
    await dbConnect()

    let settings = await SiteSettings.findOne()

    if (!settings) {
      // Create default settings if none exist
      settings = await SiteSettings.create({})
    }

    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    console.error("Site Settings GET error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch site settings" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()

    let settings = await SiteSettings.findOne()

    if (!settings) {
      settings = await SiteSettings.create(body)
    } else {
      settings = await SiteSettings.findOneAndUpdate({}, body, { new: true, runValidators: true })
    }

    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    console.error("Site Settings PUT error:", error)
    return NextResponse.json({ success: false, error: "Failed to update site settings" }, { status: 500 })
  }
}
