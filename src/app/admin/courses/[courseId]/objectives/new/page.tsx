import { prisma } from "@/lib/prisma/client"
import { notFound } from "next/navigation"
import { ObjectiveForm } from "@/components/admin/ObjectiveForm"

interface NewObjectivePageProps {
  params: {
    courseId: string
  }
}

export default async function NewObjectivePage({ params }: NewObjectivePageProps) {
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
          Create New Objective
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          {course.title}
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <ObjectiveForm courseId={params.courseId} />
      </div>
    </div>
  )
} 