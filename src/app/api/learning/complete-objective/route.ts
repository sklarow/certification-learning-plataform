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
    const body = await request.json()
    const { objectiveId, courseId } = body
    console.log('Completing objective request:', { userId: session.user.id, objectiveId, courseId, body }) // Debug log

    // Validate required parameters
    if (!objectiveId) {
      console.error('Missing objectiveId in request')
      return new NextResponse("Missing objectiveId parameter", { status: 400 })
    }

    // Verify both user and objective exist
    console.log('Verifying user and objective exist:', { userId: session.user.id, objectiveId });
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    
    if (!user) {
      console.error(`User not found with ID: ${session.user.id}`);
      return new NextResponse("User not found", { status: 404 });
    }
    
    // Verify objective exists
    const objective = await prisma.objective.findUnique({
      where: { id: objectiveId },
    });

    if (!objective) {
      console.error(`Objective not found with ID: ${objectiveId}`);
      return new NextResponse("Objective not found", { status: 404 });
    }
    
    // Log the found entities
    console.log('Found user and objective:', { 
      user: { id: user.id, email: user.email }, 
      objective: { id: objective.id, title: objective.title }
    });

    // Check if the objectiveId is a valid format (in case it's being passed incorrectly)
    console.log('Objective ID format check:', { 
      objectiveId,
      objectiveIdFromDB: objective.id,
      match: objectiveId === objective.id 
    });
    
    // Check if the user ID is a valid format
    console.log('User ID format check:', { 
      sessionUserId: session.user.id,
      userIdFromDB: user.id,
      match: session.user.id === user.id 
    });
    
    // Check if there's already a progress record
    const existingProgress = await prisma.progress.findUnique({
      where: {
        userId_objectiveId: {
          userId: session.user.id,
          objectiveId: objectiveId,
        },
      },
    });
    
    console.log('Existing progress record:', existingProgress);
    
    // Create or update the user's progress for this objective
    try {
      // Use the exact IDs from the database to ensure they match
      const progress = await prisma.progress.upsert({
        where: {
          userId_objectiveId: {
            userId: user.id,
            objectiveId: objective.id,
          },
        },
        create: {
          userId: user.id,
          objectiveId: objective.id,
          completed: true,
        },
        update: {
          completed: true,
        },
      })

      console.log('Progress updated successfully:', progress) // Debug log
      return new NextResponse(null, { status: 204 })
    } catch (dbError) {
      console.error("Database error while updating progress:", dbError)
      return new NextResponse(`Database error: ${dbError.message}`, { status: 500 })
    }
  } catch (error) {
    console.error("Error completing objective:", error)
    return new NextResponse(`Internal Server Error: ${error.message}`, { status: 500 })
  }
} 