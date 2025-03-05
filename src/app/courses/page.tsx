import { prisma } from "@/lib/prisma/client"
import Link from "next/link"
import { Course, Objective } from "@prisma/client"

interface CourseWithObjectives extends Course {
  objectives: Objective[]
}

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    include: {
      objectives: true,
    },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Available Courses
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          Choose a course to start learning
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course: CourseWithObjectives) => (
          <div
            key={course.id}
            className="bg-white overflow-hidden shadow rounded-lg"
          >
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">
                {course.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {course.description}
              </p>
              <div className="mt-4">
                <span className="text-sm text-gray-500">
                  {course.objectives.length} learning objectives
                </span>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:px-6">
              <Link
                href={`/courses/${course.slug}`}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Start learning
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 