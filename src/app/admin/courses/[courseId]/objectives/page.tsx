import { prisma } from "@/lib/prisma/client"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Objective } from "@prisma/client"

interface ObjectivesPageProps {
  params: {
    courseId: string
  }
}

export default async function ObjectivesPage({ params }: ObjectivesPageProps) {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Learning Objectives
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            {course.title}
          </p>
        </div>
        <Link
          href={`/admin/courses/${course.slug}/objectives/new`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Add Objective
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {course.objectives.map((objective: Objective) => (
            <li key={objective.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-indigo-600 truncate">
                      {objective.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {objective.description}
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <Link
                      href={`/admin/courses/${course.slug}/objectives/${objective.slug}`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/admin/courses/${course.slug}/objectives/${objective.slug}/questions`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Manage Questions
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
} 