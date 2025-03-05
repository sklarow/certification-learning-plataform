import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import QuestionForm from "@/components/admin/QuestionForm";

interface QuestionPageProps {
  params: {
    courseId: string;
    objectiveId: string;
    questionId: string;
  };
}

export default async function QuestionPage({ params }: QuestionPageProps) {
  const { courseId, objectiveId, questionId } = params;

  const question = await prisma.question.findUnique({
    where: {
      id: questionId,
    },
    include: {
      objective: {
        include: {
          course: true,
        },
      },
    },
  });

  if (!question) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Question</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700">
            {question.objective.course.title}
          </h2>
          <p className="text-gray-600">{question.objective.title}</p>
        </div>
        <QuestionForm
          question={question}
          objectiveId={objectiveId}
          courseId={courseId}
        />
      </div>
    </div>
  );
} 