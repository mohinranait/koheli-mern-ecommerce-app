import { type NextRequest, NextResponse } from "next/server"
import { writeFile, unlink } from "fs/promises"
import path from "path"
import os from "os"
import { v2 as cloudinary } from "cloudinary"
import { nanoid } from "nanoid"
import dbConnect from "@/lib/mongodb"
import AppConfig from "@/models/AppConfig"

export async function POST(request: NextRequest) {
  try {
    // Database থেকে Cloudinary configuration fetch করুন
    await dbConnect()
    const config = await AppConfig.findOne()

    if (!config) {
      return NextResponse.json({ success: false, error: "App configuration not found" }, { status: 500 })
    }

    console.log({config});
    

    // Cloudinary enabled আছে কিনা check করুন
    if (!config.cloudinary.enabled) {
      return NextResponse.json({ success: false, error: "Cloudinary service is disabled" }, { status: 400 })
    }

    // Cloudinary credentials check করুন
    const { cloudName, apiKey, apiSecret } = config.cloudinary
    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ success: false, error: "Cloudinary credentials are incomplete" }, { status: 500 })
    }
    console.log({cloudName, apiKey, apiSecret});
    
    // Cloudinary dynamically configure করুন
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    })

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    // File validation
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ success: false, error: "File size too large. Maximum 10MB allowed" }, { status: 400 })
    }

    // Allowed file types
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: "Invalid file type. Only images are allowed" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = new Uint8Array(bytes)
    const tempFilePath = path.join(os.tmpdir(), `${nanoid()}_${file.name}`)

    // Temporary file write করুন
    await writeFile(tempFilePath, buffer)

    try {
      // Cloudinary তে upload করুন
      const result = await cloudinary.uploader.upload(tempFilePath, {
        folder: "koholi",
       
      })

      console.log({result});
      

      const { url, secure_url, public_id, format, width, height, bytes: uploadedBytes } = result

      // Temporary file delete করুন
      await unlink(tempFilePath)

      return NextResponse.json({
        success: true,
        data: secure_url,
      })
    } catch (uploadError) {
      // Upload fail হলে temporary file delete করুন
      try {
        await unlink(tempFilePath)
      } catch (unlinkError) {
        console.error("Failed to delete temp file:", unlinkError)
      }
      throw uploadError
    }
  } catch (error) {
    console.error("Upload error:", error)

    // Specific error messages
    if (error instanceof Error) {
      if (error.message.includes("Invalid API key")) {
        return NextResponse.json({ success: false, error: "Invalid Cloudinary API credentials" }, { status: 500 })
      }
      if (error.message.includes("network")) {
        return NextResponse.json({ success: false, error: "Network error. Please try again" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: false, error: "Upload failed. Please try again" }, { status: 500 })
  }
}




// import { NextRequest, NextResponse } from "next/server";


// import { writeFile } from "fs/promises";
// import path from "path";
// import os from "os";

// import { v2 as cloudinary } from "cloudinary";
// import { nanoid } from "nanoid";

// cloudinary.config({
//   cloud_name: 'dm9s5d3xk',
//   api_key: '772929585163915',
//   api_secret: '_ThV9Cz20zfUCmYhY8i8etsh5sg',
// });


// export async function POST(request: NextRequest) {
//   try {
//     const formData = await request.formData();
//     const file = formData.get("file") as File;

//     console.log("File chek before");
    

//     if (!file) {
//       return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
//     }

//     console.log("File finding", file);
    

//     const bytes = await file.arrayBuffer();
//     console.log({bytes});
    
//     const buffer = new Uint8Array(bytes);
// console.log({buffer});

//     const tempFilePath = path.join(os.tmpdir(), `${nanoid()}_${file.name}`);
//     console.log({tempFilePath});
    
//     await writeFile(tempFilePath, buffer);

//     const result = await cloudinary.uploader.upload(tempFilePath, {
//       folder: "shikder",
//     });

//     console.log({result});
    


//     const { url, format, width, height, bytes:iBytes,secure_url,public_id } = result;


      


    

//     return NextResponse.json({
//       success: true,
//       data: secure_url,
//     });
//   } catch (error) {
//     console.error("Upload error:", error);
//     return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 });
//   }
// }

