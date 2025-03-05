"use client"

import { useState } from "react"
import type { Question } from "@prisma/client"
import confetti from "canvas-confetti"

interface ObjectiveQuestionsProps {
  questions: Question[]
  objectiveId: string
  courseId: string
}

interface Feedback {
  correct: boolean
  message: string
}

export function ObjectiveQuestions({ questions, objectiveId, courseId }: ObjectiveQuestionsProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [feedback, setFeedback] = useState<Record<string, Feedback>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
    setFeedback(prev => ({ ...prev, [questionId]: { correct: false, message: "" } }))
    setError(null)
  }

  const parseOptions = (optionsString: string): string[] => {
    try {
      return JSON.parse(optionsString)
    } catch (e) {
      console.error("Error parsing options:", e)
      return []
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)
    try {
      if (questions.length === 0) {
        // If no questions, just mark as complete
        const response = await fetch("/api/learning/complete-objective", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            objectiveId,
            courseId,
          }),
        })

        if (!response.ok) {
          throw new Error(`Failed to complete objective: ${response.statusText}`)
        }

        setIsComplete(true)
        triggerConfetti()
        return
      }

      console.log('Submitting answers:', { objectiveId, courseId, answers }) // Debug log

      const response = await fetch("/api/learning/check-answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objectiveId,
          courseId,
          answers,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to check answers: ${response.statusText} - ${errorText}`)
      }

      const result = await response.json()
      console.log('Received feedback:', result) // Debug log
      setFeedback(result.feedback)

      // Check if all answers are correct
      const allCorrect = Object.values(result.feedback).every((f: Feedback) => f.correct)
      if (allCorrect) {
        setIsComplete(true)
        // Mark objective as complete
        const completeResponse = await fetch("/api/learning/complete-objective", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            objectiveId,
            courseId,
          }),
        })

        if (!completeResponse.ok) {
          throw new Error(`Failed to complete objective: ${completeResponse.statusText}`)
        }

        triggerConfetti()
      }
    } catch (error) {
      console.error("Error checking answers:", error)
      setError(error instanceof Error ? error.message : "Failed to submit answers. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  return (
    <div className="space-y-6">
      {questions.map((question, index) => {
        const options = parseOptions(question.options)
        return (
          <div
            key={question.id}
            className="border rounded-lg p-6"
          >
            <p className="font-medium text-gray-900">
              {index + 1}. {question.text}
            </p>
            <div className="mt-4">
              {options.map((option: string, i: number) => (
                <div
                  key={i}
                  className="flex items-center mt-2"
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    checked={answers[question.id] === option}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="h-4 w-4 text-indigo-600"
                    disabled={isComplete}
                  />
                  <label className="ml-3 text-sm text-gray-700">
                    {option}
                  </label>
                </div>
              ))}
            </div>
            {feedback[question.id] && (
              <div className={`mt-2 text-sm ${feedback[question.id].correct ? "text-green-600" : "text-red-600"}`}>
                {feedback[question.id].message}
              </div>
            )}
          </div>
        )
      })}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {!isComplete && (
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || (questions.length > 0 && Object.keys(answers).length !== questions.length)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting 
              ? "Processing..." 
              : questions.length === 0 
                ? "Mark as completed" 
                : "Submit Answers"}
          </button>
        </div>
      )}

      {isComplete && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Congratulations! You've completed this objective.
              </h3>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 