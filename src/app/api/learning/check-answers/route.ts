import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth.config"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { objectiveId, courseId, answers } = await request.json()

    // Get all questions for the objective
    const questions = await prisma.question.findMany({
      where: { objectiveId },
    })

    // Check each answer and provide feedback
    const feedback: Record<string, { correct: boolean; message: string }> = {}

    for (const question of questions) {
      const userAnswer = answers[question.id]
      const options = JSON.parse(question.options)
      const correctAnswerIndex = parseInt(question.correctAnswer)
      const correctAnswer = options[correctAnswerIndex]
      
      // Compare the selected answer with the correct answer
      const isCorrect = userAnswer === correctAnswer

      feedback[question.id] = {
        correct: isCorrect,
        message: isCorrect ? "Correct! Well done!" : "Incorrect.",
      }
    }

    return NextResponse.json({ feedback })
  } catch (error) {
    console.error("Error checking answers:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 