import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth.config"

interface CourseRouteProps {
  params: {
    courseId: string
  }
}

export async function PUT(
  request: Request,
  { params }: CourseRouteProps
) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const body = await request.json()
    const course = await prisma.course.update({
      where: { id: params.courseId },
      data: {
        title: body.title,
        description: body.description,
      },
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error("Error updating course:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: CourseRouteProps
) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    await prisma.course.delete({
      where: { id: params.courseId },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting course:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 