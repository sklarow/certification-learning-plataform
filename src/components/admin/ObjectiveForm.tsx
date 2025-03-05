"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { RichTextEditor } from "@/components/learning/RichTextEditor"
import { useCallback } from "react"

const objectiveSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  order: z.number().min(0, "Order must be a positive number"),
})

type ObjectiveFormData = z.infer<typeof objectiveSchema>

interface ObjectiveFormProps {
  objective?: {
    id: string
    title: string
    description: string
    order: number
    slug: string
  }
  courseId: string
}

export function ObjectiveForm({ objective, courseId }: ObjectiveFormProps) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ObjectiveFormData>({
    resolver: zodResolver(objectiveSchema),
    defaultValues: objective
      ? {
          title: objective.title,
          description: objective.description,
          order: objective.order,
        }
      : {
          title: "",
          description: "",
          order: 0,
        },
  })

  const description = watch("description")
  const title = watch("title")

  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }, [])

  const onSubmit = async (data: ObjectiveFormData) => {
    try {
      const slug = generateSlug(data.title)
      const formData = {
        ...data,
        slug,
        description: data.description || "",
      }

      if (objective) {
        const response = await fetch(`/api/admin/courses/${courseId}/objectives/${objective.slug}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Failed to update objective: ${response.statusText} - ${errorText}`)
        }
      } else {
        const response = await fetch(`/api/admin/courses/${courseId}/objectives`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Failed to create objective: ${response.statusText} - ${errorText}`)
        }
      }
      router.push(`/admin/courses/${courseId}/objectives`)
      router.refresh()
    } catch (error) {
      console.error("Error saving objective:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          {...register("title")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <div className="mt-1">
          <RichTextEditor
            value={description || ""}
            onChange={(value) => {
              setValue("description", value, { 
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true 
              })
            }}
            placeholder="Enter objective description..."
          />
        </div>
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="order"
          className="block text-sm font-medium text-gray-700"
        >
          Order
        </label>
        <input
          type="number"
          id="order"
          {...register("order", { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.order && (
          <p className="mt-1 text-sm text-red-600">{errors.order.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() =>
            router.push(`/admin/courses/${courseId}/objectives`)
          }
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {objective ? "Update Objective" : "Create Objective"}
        </button>
      </div>
    </form>
  )
} 