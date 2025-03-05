import { CourseForm } from "@/components/admin/CourseForm"

export default function NewCoursePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Create New Course
        </h1>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <CourseForm />
      </div>
    </div>
  )
} 