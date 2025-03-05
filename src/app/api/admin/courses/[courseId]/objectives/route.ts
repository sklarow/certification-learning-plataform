import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth.config"

interface ObjectivesRouteProps {
  params: {
    courseId: string
  }
}

export async function POST(
  request: Request,
  { params }: ObjectivesRouteProps
) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const body = await request.json()
    const course = await prisma.course.findUnique({
      where: { slug: params.courseId },
    })

    if (!course) {
      return new NextResponse("Course not found", { status: 404 })
    }

    const objective = await prisma.objective.create({
      data: {
        title: body.title,
        description: body.description,
        order: body.order,
        slug: body.slug,
        courseId: course.id,
      },
    })

    return NextResponse.json(objective)
  } catch (error) {
    console.error("Error creating objective:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 