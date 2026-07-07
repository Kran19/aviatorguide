import { NextRequest, NextResponse } from "next/server"
import { join } from "path"
import { readFile, stat } from "fs/promises"
import { existsSync } from "fs"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const resolvedParams = await params;
    const filename = resolvedParams.filename

    if (!filename || filename.includes("..") || filename.includes("/")) {
      return new NextResponse("Invalid filename", { status: 400 })
    }

    const uploadDir = join(process.cwd(), "public", "uploads")
    const filepath = join(uploadDir, filename)

    if (!existsSync(filepath)) {
      return new NextResponse("File not found", { status: 404 })
    }

    const fileBuffer = await readFile(filepath)
    const stats = await stat(filepath)

    // Determine content type based on extension
    const ext = filename.split('.').pop()?.toLowerCase()
    let contentType = "application/octet-stream"
    if (ext === "jpg" || ext === "jpeg") contentType = "image/jpeg"
    else if (ext === "png") contentType = "image/png"
    else if (ext === "gif") contentType = "image/gif"
    else if (ext === "webp") contentType = "image/webp"
    else if (ext === "svg") contentType = "image/svg+xml"

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": stats.size.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Error serving file:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
