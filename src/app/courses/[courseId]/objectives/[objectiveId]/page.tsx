import { prisma } from "@/lib/prisma/client"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Question } from "@prisma/client"

interface ObjectivePageProps {
  params: {
    courseId: string
    objectiveId: string
  }
}

export default async function ObjectivePage({ params }: ObjectivePageProps) {
  const objective = await prisma.objective.findUnique({
    where: { 
      slug: params.objectiveId,
      course: {
        slug: params.courseId
      }
    },
    include: {
      course: true,
      questions: true,
    },
  })

  if (!objective) {
    notFound()
  }

  // Get previous and next objectives
  const [previousObjective, nextObjective] = await Promise.all([
    prisma.objective.findFirst({
      where: {
        courseId: objective.courseId,
        order: { lt: objective.order },
      },
      orderBy: { order: "desc" },
    }),
    prisma.objective.findFirst({
      where: {
        courseId: objective.courseId,
        order: { gt: objective.order },
      },
      orderBy: { order: "asc" },
    }),
  ])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href={`/courses/${objective.course.slug}`}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          ← Back to course
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-3xl font-extrabold text-gray-900">
          {objective.title}
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          {objective.description}
        </p>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Practice Questions
          </h2>
          <div className="space-y-4">
            {objective.questions.map((question: Question, index: number) => (
              <div
                key={question.id}
                className="border rounded-lg p-4"
              >
                <p className="font-medium text-gray-900">
                  {index + 1}. {question.text}
                </p>
                <div className="mt-2">
                  {JSON.parse(question.options).map((option: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-center mt-2"
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        className="h-4 w-4 text-indigo-600"
                      />
                      <label className="ml-3 text-sm text-gray-700">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          {previousObjective && (
            <Link
              href={`/courses/${objective.course.slug}/objectives/${previousObjective.slug}`}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              ← Previous objective
            </Link>
          )}
          {nextObjective && (
            <Link
              href={`/courses/${objective.course.slug}/objectives/${nextObjective.slug}`}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Next objective →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
} 