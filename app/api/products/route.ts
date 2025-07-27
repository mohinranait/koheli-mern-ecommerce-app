import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Product from "@/models/Product"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")?.trim()
    const category = searchParams.get("category")
    const status = searchParams.get("status")
    const limit = searchParams.get("limit")

    // Build query
    const query: any = {}

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ]
    }

    if (category && category !== "all") {
      query.category = category
    }

    if (status && status !== "all") {
      query.status = status
    }

    // Execute query
    let productsQuery = Product.find(query).sort({ updatedAt: -1, createdAt: -1 })

    if (limit && !isNaN(Number(limit))) {
      productsQuery = productsQuery.limit(Number(limit))
    }

    const products = await productsQuery

    // console.log({products});
    

    return NextResponse.json({ 
      success: true, 
      data: products 
    })

  } catch (error) {
    console.error("Products GET error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const body = await request.json()
    const { name, price, image, category, description, status, priority, link,slug } = body

    const product = await Product.create({
      name,
      slug,
      price: Number.parseFloat(price),
      image,
      category,
      description,
      status: status || "active",
      priority: Number.parseInt(priority) || 0,
      link: link || "",
    })

    return NextResponse.json({ success: true, data: product }, { status: 201 })
  } catch (error) {
    console.error("Products POST error:", error)
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 })
  }
}
