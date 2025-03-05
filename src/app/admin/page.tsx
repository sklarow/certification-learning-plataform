import { prisma } from "@/lib/prisma/client"
import Link from "next/link"

export default async function AdminDashboard() {
  const courses = await prisma.course.findMany({
    include: {
      objectives: true,
    },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Admin Dashboard
        </h1>
        <Link
          href="/admin/courses/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Create New Course
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {courses.map((course) => (
            <li key={course.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-indigo-600 truncate">
                      {course.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {course.objectives.length} learning objectives
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <Link
                      href={`/admin/courses/${course.id}`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/admin/courses/${course.id}/objectives`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Manage Objectives
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