"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"

const questionSchema = z.object({
  text: z.string().min(1, "Question text is required"),
  options: z.array(z.string()).min(2, "At least 2 options are required"),
  correctAnswer: z.string().min(1, "Correct answer is required"),
})

type QuestionFormData = z.infer<typeof questionSchema>

interface QuestionFormProps {
  question?: {
    id: string
    text: string
    options: string
    correctAnswer: string
    objective: {
      slug: string
    }
  }
  objectiveId: string
  courseId: string
}

export default function QuestionForm({ question, objectiveId, courseId }: QuestionFormProps) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: question
      ? {
          text: question.text,
          options: JSON.parse(question.options),
          correctAnswer: question.correctAnswer,
        }
      : {
          text: "",
          options: ["", ""],
          correctAnswer: "",
        },
  })

  const options = watch("options")

  const onSubmit = async (data: QuestionFormData) => {
    try {
      if (question) {
        await fetch(`/api/admin/courses/${courseId}/objectives/${objectiveId}/questions/${question.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            options: JSON.stringify(data.options),
          }),
        })
      } else {
        await fetch(`/api/admin/courses/${courseId}/objectives/${objectiveId}/questions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
            options: JSON.stringify(data.options),
          }),
        })
      }
      router.push(`/admin/courses/${courseId}/objectives/${objectiveId}/questions`)
      router.refresh()
    } catch (error) {
      console.error("Error saving question:", error)
    }
  }

  const addOption = () => {
    setValue("options", [...options, ""])
  }

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index)
    setValue("options", newOptions)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="text"
          className="block text-sm font-medium text-gray-700"
        >
          Question
        </label>
        <textarea
          id="text"
          {...register("text")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          rows={3}
        />
        {errors.text && (
          <p className="mt-1 text-sm text-red-600">{errors.text.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Options</label>
        {options.map((_, index) => (
          <div key={index} className="mt-2 flex items-center space-x-2">
            <input
              type="text"
              {...register(`options.${index}`)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <input
              type="radio"
              {...register("correctAnswer")}
              value={index.toString()}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <button
              type="button"
              onClick={() => removeOption(index)}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addOption}
          className="mt-2 text-indigo-600 hover:text-indigo-800"
        >
          Add Option
        </button>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() =>
            router.push(
              `/admin/courses/${courseId}/objectives/${objectiveId}/questions`
            )
          }
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {question ? "Update Question" : "Create Question"}
        </button>
      </div>
    </form>
  )
} 