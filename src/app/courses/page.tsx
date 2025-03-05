import { prisma } from "@/lib/prisma/client"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth.config"

export default async function CoursesPage() {
  const session = await getServerSession(authOptions)
  const courses = await prisma.course.findMany({
    include: {
      objectives: {
        orderBy: {
          order: "asc",
        },
      },
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

  const completedObjectiveIds = new Set(userProgress.map(p => p.objectiveId))

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Courses</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="space-y-4">
                {course.objectives.map((objective) => (
                  <div
                    key={objective.id}
                    className="flex items-center justify-between border rounded-lg p-3"
                  >
                    <div className="flex items-center space-x-2">
                      {completedObjectiveIds.has(objective.id) && (
                        <svg
                          className="h-5 w-5 text-green-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                      <span className="text-sm font-medium">
                        {objective.title}
                        {completedObjectiveIds.has(objective.id) && (
                          <span className="ml-2 text-xs text-green-500">(completed)</span>
                        )}
                      </span>
                    </div>
                    <Link
                      href={`/courses/${course.slug}/objectives/${objective.slug}`}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Practice Objective
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 