import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { objectiveId, courseId } = await request.json()
    console.log('Completing objective:', { userId: session.user.id, objectiveId }) // Debug log

    // Create or update the user's progress for this objective
    const progress = await prisma.progress.upsert({
      where: {
        userId_objectiveId: {
          userId: session.user.id,
          objectiveId: objectiveId,
        },
      },
      create: {
        userId: session.user.id,
        objectiveId: objectiveId,
        completed: true,
      },
      update: {
        completed: true,
      },
    })

    console.log('Progress updated:', progress) // Debug log
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error completing objective:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 