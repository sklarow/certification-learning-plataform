import { prisma } from "@/lib/prisma/client"
import Link from "next/link"
import { notFound } from "next/navigation"

interface CoursePageProps {
  params: {
    courseId: string
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const course = await prisma.course.findUnique({
    where: { id: params.courseId },
    include: {
      objectives: {
        orderBy: { order: "asc" },
      },
    },
  })

  if (!course) {
    notFound()
  }

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
                <h3 className="text-lg font-medium text-gray-900">
                  {index + 1}. {objective.title}
                </h3>
                <Link
                  href={`/courses/${course.id}/objectives/${objective.id}`}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Start learning
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