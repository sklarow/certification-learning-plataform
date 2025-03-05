import { prisma } from "@/lib/prisma/client"
import Link from "next/link"
import { notFound } from "next/navigation"

interface Question {
  id: string
  text: string
  options: string
  correctAnswer: string
}

interface QuestionsPageProps {
  params: {
    courseId: string
    objectiveId: string
  }
}

export default async function QuestionsPage({ params }: QuestionsPageProps) {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Practice Questions
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            {objective.course.title} - {objective.title}
          </p>
        </div>
        <Link
          href={`/admin/courses/${objective.course.slug}/objectives/${objective.slug}/questions/new`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Add Question
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {objective.questions.map((question: Question, index: number) => (
            <li key={question.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-indigo-600 truncate">
                      Question {index + 1}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {question.text}
                    </p>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Correct Answer: {question.correctAnswer}
                      </p>
                      <p className="text-sm text-gray-500">
                        Options: {JSON.parse(question.options).join(", ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <Link
                      href={`/admin/courses/${objective.course.slug}/objectives/${objective.slug}/questions/${question.id}`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Edit
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