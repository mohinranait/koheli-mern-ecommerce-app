import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import SiteSettings from "@/models/SiteSettings"
import { defaultSiteSettings } from "@/lib/site-settings"

// Interface for MongoDB validation errors
interface MongoValidationError extends Error {
  name: 'ValidationError'
  errors: Record<string, {
    message: string
    path: string
    value: any
  }>
}

export async function GET() {
  try {
    await dbConnect()

    let settings = await SiteSettings.findOne()
    
    if (!settings?._id) {
      // Create default settings if none exist
      settings = await SiteSettings.create(defaultSiteSettings)
    }

    return NextResponse.json({ 
      success: true, 
      data: settings 
    })
  } catch (error) {
    console.error("Site Settings GET error:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch site settings",
        message: error instanceof Error ? error.message : "Unknown error"
      }, 
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    console.log({body});

    let existsSetting = await SiteSettings.findOne()
    console.log({existsSetting});
    
   const settings = await SiteSettings.findByIdAndUpdate(
        existsSetting._id, 
        { ...body }, 
        { 
          new: true, 
          runValidators: true,       
        }
      )

      console.log({settings});
      

    if (!settings) {
      throw new Error("Failed to update settings")
    }

    return NextResponse.json({ 
      success: true, 
      data: settings,
      message: "Settings updated successfully"
    })
  } catch (error) {
    console.error("Site Settings PATCH error:", error)
    
    // Handle validation errors specifically
    if (error instanceof Error && error.name === 'ValidationError') {
      const validationError = error as MongoValidationError
      return NextResponse.json(
        { 
          success: false, 
          error: "Validation failed",
          details: validationError.errors
        }, 
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to update site settings",
        message: error instanceof Error ? error.message : "Unknown error"
      }, 
      { status: 500 }
    )
  }
}