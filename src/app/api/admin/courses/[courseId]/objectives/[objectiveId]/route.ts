import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth.config"

interface ObjectiveRouteProps {
  params: {
    courseId: string
    objectiveId: string
  }
}

export async function PUT(
  request: Request,
  { params }: ObjectiveRouteProps
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

    const objective = await prisma.objective.findUnique({
      where: { 
        slug: params.objectiveId,
        courseId: course.id,
      },
    })

    if (!objective) {
      return new NextResponse("Objective not found", { status: 404 })
    }

    const updatedObjective = await prisma.objective.update({
      where: { id: objective.id },
      data: {
        title: body.title,
        description: body.description,
        order: body.order,
        slug: body.slug,
      },
    })

    return NextResponse.json(updatedObjective)
  } catch (error) {
    console.error("Error updating objective:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: ObjectiveRouteProps
) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const course = await prisma.course.findUnique({
      where: { slug: params.courseId },
    })

    if (!course) {
      return new NextResponse("Course not found", { status: 404 })
    }

    const objective = await prisma.objective.findUnique({
      where: { 
        slug: params.objectiveId,
        courseId: course.id,
      },
    })

    if (!objective) {
      return new NextResponse("Objective not found", { status: 404 })
    }

    await prisma.objective.delete({
      where: { id: objective.id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error deleting objective:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 