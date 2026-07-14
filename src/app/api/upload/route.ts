import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    // Check if user is logged in
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure uploads directory exists
    const uploadDir = join(process.cwd(), "public", "uploads")
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Generate filename preserving exact original name
    const ext = file.name.split('.').pop() || 'png'
    // Keep alphanumeric, spaces, dashes, and underscores
    const originalName = file.name.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_\- ]/g, '') || 'image'
    const filename = `${originalName}.${ext}`
    
    const filepath = join(uploadDir, filename)

    // Save the file
    await writeFile(filepath, buffer)

    return NextResponse.json({ 
      success: true,
      url: `/media/${filename}` 
    })

  } catch (error: any) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: error?.message || "Upload failed" }, { status: 500 })
  }
}
