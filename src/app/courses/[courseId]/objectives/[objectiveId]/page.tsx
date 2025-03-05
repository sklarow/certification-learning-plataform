import { prisma } from "@/lib/prisma/client"
import Link from "next/link"
import { ObjectiveQuestions } from "@/components/learning/ObjectiveQuestions"

interface Objective {
  id: string
  title: string
  slug: string
  description: string
  order: number
  courseId: string
  course: {
    slug: string
  }
}

export default async function ObjectivePage({
  params,
}: {
  params: { courseId: string; objectiveId: string }
}) {
  const objective = await prisma.objective.findUnique({
    where: {
      slug: params.objectiveId,
      course: {
        slug: params.courseId
      }
    },
    include: {
      questions: true,
      course: true,
    },
  })

  if (!objective) {
    return <div>Objective not found</div>
  }

  // Get all objectives for this course to handle navigation
  const allObjectives = await prisma.objective.findMany({
    where: {
      courseId: objective.courseId,
    },
    orderBy: {
      order: "asc",
    },
  })

  const currentIndex = allObjectives.findIndex((o: Objective) => o.id === objective.id)
  const prevObjective = currentIndex > 0 ? allObjectives[currentIndex - 1] : null
  const nextObjective =
    currentIndex < allObjectives.length - 1 ? allObjectives[currentIndex + 1] : null

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{objective.title}</h1>
        <p className="text-gray-600">{objective.description}</p>
      </div>

      <div className="mb-8">
        <ObjectiveQuestions
          objectiveId={objective.id}
          courseId={objective.courseId}
          questions={objective.questions}
        />
      </div>

      <div className="flex justify-between items-center mt-8">
        <div className="flex space-x-4">
          {prevObjective && (
            <Link
              href={`/courses/${objective.course.slug}/objectives/${prevObjective.slug}`}
              className="text-blue-600 hover:text-blue-800"
            >
              ← Previous Objective
            </Link>
          )}
          <Link
            href={`/courses/${objective.course.slug}`}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Course
          </Link>
        </div>
        {nextObjective && (
          <Link
            href={`/courses/${objective.course.slug}/objectives/${nextObjective.slug}`}
            className="text-blue-600 hover:text-blue-800"
          >
            Next Objective →
          </Link>
        )}
      </div>
    </div>
  )
} 