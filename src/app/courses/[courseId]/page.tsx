import { prisma } from "@/lib/prisma/client"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth.config"

interface CoursePageProps {
  params: {
    courseId: string
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const session = await getServerSession(authOptions)
  const course = await prisma.course.findUnique({
    where: { slug: params.courseId },
    include: {
      objectives: {
        orderBy: { order: "asc" },
      },
    },
  })

  if (!course) {
    notFound()
  }

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

  const completedObjectiveIds = new Set(userProgress.map((p: { objectiveId: string }) => p.objectiveId))
  const totalObjectives = course.objectives.length
  const completedObjectives = course.objectives.filter((obj: { id: string }) => completedObjectiveIds.has(obj.id)).length
  const progressPercentage = totalObjectives > 0 ? (completedObjectives / totalObjectives) * 100 : 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          {course.title}
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          {course.description}
        </p>
      </div>

      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">
              Progress: {completedObjectives} of {totalObjectives} objectives completed
            </span>
          </div>
          <span className="text-sm font-medium text-gray-700">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Learning Objectives
        </h2>
        <div className="space-y-6">
          {course.objectives.map((objective, index) => (
            <div
              key={objective.id}
              className="bg-white shadow rounded-lg p-6"
            >
              <div className="flex items-center justify-between">
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
                  <h3 className="text-lg font-medium text-gray-900">
                    {index + 1}. {objective.title}
                    {completedObjectiveIds.has(objective.id) && (
                      <span className="ml-2 text-sm text-green-500">(completed)</span>
                    )}
                  </h3>
                </div>
                <Link
                  href={`/courses/${course.slug}/objectives/${objective.slug}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Practice Objective
                </Link>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {objective.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 