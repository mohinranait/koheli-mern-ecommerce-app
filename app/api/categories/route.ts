import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Category from "@/models/Category"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const status = searchParams.get("status")

    const query: any = {}

    if (search) {
      query.$or = [{ name: { $regex: search, $options: "i" } }, { slug: { $regex: search, $options: "i" } }]
    }

    if (status && status !== "all") {
      query.status = status
    }

    const categories = await Category.find(query).sort({ updatedAt: -1, createdAt: -1 })

    return NextResponse.json({ success: true, data: categories })
  } catch (error) {
    console.error("Categories GET error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    const { name, slug, image,status } = body

    // Check if slug already exists
    const existingCategory = await Category.findOne({ slug })
    if (existingCategory) {
      return NextResponse.json({ success: false, error: "Category slug already exists" }, { status: 400 })
    }

    const category = await Category.create({
      name,
      slug: slug.toLowerCase(),
      image,
      status
    })

    return NextResponse.json({ success: true, data: category }, { status: 201 })
  } catch (error) {
    console.error("Categories POST error:", error)
    return NextResponse.json({ success: false, error: "Failed to create category" }, { status: 500 })
  }
}
