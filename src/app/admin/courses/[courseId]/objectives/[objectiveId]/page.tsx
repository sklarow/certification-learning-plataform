import { prisma } from "@/lib/prisma/client"
import { notFound } from "next/navigation"
import { ObjectiveForm } from "@/components/admin/ObjectiveForm"

interface EditObjectivePageProps {
  params: {
    courseId: string
    objectiveId: string
  }
}

export default async function EditObjectivePage({ params }: EditObjectivePageProps) {
  const objective = await prisma.objective.findUnique({
    where: { 
      slug: params.objectiveId,
      course: {
        slug: params.courseId
      }
    },
    include: {
      course: true,
    },
  })

  if (!objective) {
    notFound()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Edit Objective
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          {objective.course.title}
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <ObjectiveForm objective={objective} courseId={objective.courseId} />
      </div>
    </div>
  )
} 