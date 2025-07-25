import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Product from "@/models/Product"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const product = await Product.findById(params.id)

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: product })
  } catch (error) {
    console.error("Product GET error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const body = await request.json()
    const { name, price, image, category, description, status, priority, link } = body

    const product = await Product.findByIdAndUpdate(
      params.id,
      {
        name,
        price: Number.parseFloat(price),
        image,
        category,
        description,
        status,
        priority: Number.parseInt(priority),
        link: link || "",
      },
      { new: true, runValidators: true },
    )

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: product })
  } catch (error) {
    console.error("Product PUT error:", error)
    return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const product = await Product.findByIdAndDelete(params.id)

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" })
  } catch (error) {
    console.error("Product DELETE error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 })
  }
}
