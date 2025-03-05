import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function CoursesPage() {
  const session = await getServerSession(authOptions)
  console.log('Session:', session) // Debug log

  const courses = await prisma.course.findMany({
    include: {
      objectives: {
        orderBy: {
          order: 'asc'
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  // Get user's progress for all objectives
  const userProgress = session?.user
    ? await prisma.progress.findMany({
        where: {
          userId: session.user.id,
          completed: true,
        },
        select: {
          objectiveId: true,
        },
      })
    : []

  console.log('User Progress:', userProgress) // Debug log
  const completedObjectiveIds = new Set(userProgress.map((p) => p.objectiveId))
  console.log('Completed Objective IDs:', Array.from(completedObjectiveIds)) // Debug log

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const totalObjectives = course.objectives.length
          const completedObjectives = course.objectives.filter((obj) => completedObjectiveIds.has(obj.id)).length
          const progressPercentage = totalObjectives > 0 ? (completedObjectives / totalObjectives) * 100 : 0

          console.log(`Course ${course.title}:`, { // Debug log
            totalObjectives,
            completedObjectives,
            objectives: course.objectives.map(obj => ({ id: obj.id, completed: completedObjectiveIds.has(obj.id) }))
          })

          return (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                <p className="text-gray-600 mb-4">{course.description}</p>
                
                {/* Progress Section */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>
                      {completedObjectives} of {totalObjectives} objectives
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                <Link
                  href={`/courses/${course.slug}`}
                  className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  View Course
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 