import { prisma } from "@/lib/prisma/client"
import { notFound } from "next/navigation"
import { CourseForm } from "@/components/admin/CourseForm"

interface CourseEditPageProps {
  params: {
    courseId: string
  }
}

export default async function CourseEditPage({ params }: CourseEditPageProps) {
  const course = await prisma.course.findUnique({
    where: { id: params.courseId },
  })

  if (!course) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Edit Course
        </h1>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <CourseForm course={course} />
      </div>
    </div>
  )
} 