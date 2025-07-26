import { type NextRequest, NextResponse } from "next/server"
import SocialPropNotification from "@/models/SocialPropNotification"



export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    
     const body = await request.json()
      
    
    const notification = await SocialPropNotification.findByIdAndUpdate(id, {...body}, { new: true, runValidators: true })
        
    return NextResponse.json({ success: true, data: notification }, { status: 200 })


   
  } catch (error) {
    console.error("Error updating notification:", error)
    return NextResponse.json({ error: "Failed to update notification" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const notification = await SocialPropNotification.findByIdAndDelete(id)
    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 })
    }


    return NextResponse.json({ message: "Notification deleted successfully" })
  } catch (error) {
    console.error("Error deleting notification:", error)
    return NextResponse.json({ error: "Failed to delete notification" }, { status: 500 })
  }
}
