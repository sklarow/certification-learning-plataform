import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth.config"
import { z } from "zod"

const questionSchema = z.object({
  text: z.string().min(1),
  options: z.string(),
  correctAnswer: z.string().min(1),
})

interface QuestionsRouteProps {
  params: {
    courseId: string
    objectiveId: string
  }
}

export async function POST(
  request: Request,
  { params }: QuestionsRouteProps
) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "ADMIN") {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const body = await request.json()
    const validatedData = questionSchema.parse(body)

    const objective = await prisma.objective.findUnique({
      where: {
        slug: params.objectiveId,
        course: {
          slug: params.courseId
        }
      }
    })

    if (!objective) {
      return new NextResponse("Objective not found", { status: 404 })
    }

    const question = await prisma.question.create({
      data: {
        text: validatedData.text,
        options: validatedData.options,
        correctAnswer: validatedData.correctAnswer,
        objectiveId: objective.id,
      },
    })

    return NextResponse.json(question)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      )
    }
    console.error("Error creating question:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 