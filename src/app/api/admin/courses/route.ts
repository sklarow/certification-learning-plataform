import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth.config"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const body = await request.json()
    const course = await prisma.course.create({
      data: {
        title: body.title,
        description: body.description,
      },
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error("Error creating course:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 