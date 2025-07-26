import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import SocialPropNotification from "@/models/SocialPropNotification"



export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const status = searchParams.get("status")

    const query: any = {}

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { beforeText: { $regex: search, $options: "i" } },
        { afterText: { $regex: search, $options: "i" } },
      ]
    }

    if (status && status !== "all") {
      query.status = status
    }

    const notifications = await SocialPropNotification.find(query).sort({ createdAt: -1 })

    return NextResponse.json({ success: true, data: notifications })
  } catch (error) {
    console.error("notifications GET error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch notifications" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    const { beforeText, afterText, title, image, status,  } = body

    const notification = await SocialPropNotification.create({
          beforeText,
          afterText,
          title,
          image,
          status,
        })
    
    return NextResponse.json({ success: true, data: notification }, { status: 201 })

   
  } catch (error) {
    console.error("Error creating notification:", error)
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 })
  }
}
