import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import QuestionForm from "@/components/admin/QuestionForm";

interface NewQuestionPageProps {
  params: {
    courseId: string;
    objectiveId: string;
  };
}

export default async function NewQuestionPage({ params }: NewQuestionPageProps) {
  const { courseId, objectiveId } = params;

  const objective = await prisma.objective.findUnique({
    where: {
      id: objectiveId,
    },
    include: {
      course: true,
    },
  });

  if (!objective) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Question</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700">
            {objective.course.title}
          </h2>
          <p className="text-gray-600">{objective.title}</p>
        </div>
        <QuestionForm objectiveId={objectiveId} courseId={courseId} />
      </div>
    </div>
  );
} 