import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { readdir, stat, unlink } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const uploadDir = join(process.cwd(), "public", "uploads")
    if (!existsSync(uploadDir)) {
      return NextResponse.json({ files: [] })
    }

    const files = await readdir(uploadDir)
    
    // Only process actual files (skip directories or hidden files if necessary)
    const filesData = await Promise.all(
      files
        .filter(f => !f.startsWith('.'))
        .map(async (filename) => {
          const filepath = join(uploadDir, filename)
          const stats = await stat(filepath)
          return {
            name: filename,
            url: `/media/${filename}`,
            size: stats.size,
            createdAt: stats.birthtime, // birthtime works on most OS, fallback to mtime if needed
          }
        })
    )

    // Sort by newest
    filesData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ files: filesData })
  } catch (error) {
    console.error("Media fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const filename = searchParams.get("filename")
    
    if (!filename || filename.includes("..") || filename.includes("/")) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 })
    }

    const uploadDir = join(process.cwd(), "public", "uploads")
    const filepath = join(uploadDir, filename)

    if (existsSync(filepath)) {
      await unlink(filepath)
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

  } catch (error) {
    console.error("Media delete error:", error)
    return NextResponse.json({ error: "Failed to delete media" }, { status: 500 })
  }
}
