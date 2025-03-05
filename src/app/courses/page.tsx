import { prisma } from "@/lib/prisma/client"
import Link from "next/link"

export default async function CoursesPage() {
  const courses = await prisma.course.findMany()

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
              <div className="mt-4">
                <Link
                  href={`/courses/${course.slug}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  View Course
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 