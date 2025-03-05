import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth.config"
import { writeFile } from "fs/promises"
import { join } from "path"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return new NextResponse("No file uploaded", { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create a unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
    const filename = `${uniqueSuffix}-${file.name}`
    const path = join(process.cwd(), "public/uploads", filename)

    // Save the file
    await writeFile(path, buffer)

    // Return the URL
    return NextResponse.json({ 
      url: `/uploads/${filename}`,
      success: true 
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 