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
    const { objectiveId, courseId } = await request.json()

    // Create or update the user's progress for this objective
    await prisma.progress.upsert({
      where: {
        userId_objectiveId: {
          userId: session.user.id,
          objectiveId,
        },
      },
      create: {
        userId: session.user.id,
        objectiveId,
        completed: true,
      },
      update: {
        completed: true,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error completing objective:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 