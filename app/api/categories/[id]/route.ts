import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Category from "@/models/Category"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const body = await request.json()
    const { name, slug, image,status } = body

    // Check if slug already exists (excluding current category)
    const existingCategory = await Category.findOne({
      slug: slug.toLowerCase(),
      _id: { $ne: params.id },
    })

    if (existingCategory) {
      return NextResponse.json({ success: false, error: "Category slug already exists" }, { status: 400 })
    }

    const category = await Category.findByIdAndUpdate(
      params.id,
      { name, slug: slug.toLowerCase(), image, status },
      { new: true, runValidators: true },
    )

    if (!category) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: category })
  } catch (error) {
    console.error("Categories PUT error:", error)
    return NextResponse.json({ success: false, error: "Failed to update category" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const category = await Category.findByIdAndDelete(params.id)

    if (!category) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Category deleted successfully" })
  } catch (error) {
    console.error("Categories DELETE error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete category" }, { status: 500 })
  }
}
