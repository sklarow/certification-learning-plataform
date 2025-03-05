import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    console.log('Unauthorized request - no session or user')
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const body = await request.json()
    console.log('Received request body:', body)
    const { objectiveId, courseId, answers } = body

    if (!objectiveId || !courseId || !answers) {
      console.log('Missing required fields:', { objectiveId, courseId, answers })
      return new NextResponse("Missing required fields", { status: 400 })
    }

    // Get all questions for the objective
    const questions = await prisma.question.findMany({
      where: { objectiveId },
    })

    console.log('Found questions:', questions)

    if (!questions.length) {
      console.log('No questions found for objective:', objectiveId)
      return NextResponse.json({ feedback: {} })
    }

    // Check each answer and provide feedback
    const feedback: Record<string, { correct: boolean; message: string }> = {}

    for (const question of questions) {
      const userAnswer = answers[question.id]
      console.log('Processing question:', { questionId: question.id, userAnswer })

      if (!userAnswer) {
        feedback[question.id] = {
          correct: false,
          message: "Please select an answer.",
        }
        continue
      }

      try {
        const options = JSON.parse(question.options)
        const correctAnswerIndex = parseInt(question.correctAnswer)
        const correctAnswer = options[correctAnswerIndex]
        
        console.log('Answer details:', {
          questionId: question.id,
          userAnswer,
          correctAnswer,
          options,
          correctAnswerIndex
        })
        
        // Compare the selected answer with the correct answer
        const isCorrect = userAnswer === correctAnswer

        feedback[question.id] = {
          correct: isCorrect,
          message: isCorrect ? "Correct! Well done!" : "Incorrect.",
        }
      } catch (error) {
        console.error("Error processing question:", error)
        feedback[question.id] = {
          correct: false,
          message: "Error processing question. Please try again.",
        }
      }
    }

    console.log('Final feedback:', feedback)
    return NextResponse.json({ feedback })
  } catch (error) {
    console.error("Error checking answers:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 