"use client"

import dynamic from "next/dynamic"
import "react-quill/dist/quill.snow.css"
import { useCallback, useRef, useEffect } from "react"
import type ReactQuill from "react-quill"

const DynamicReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
}) as typeof ReactQuill

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const quillRef = useRef<ReactQuill>(null)

  // Ensure the editor is properly initialized with the value
  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor()
      if (editor && value !== editor.root.innerHTML) {
        editor.root.innerHTML = value
      }
    }
  }, [value])

  const imageHandler = useCallback(async () => {
    const input = document.createElement("input")
    input.setAttribute("type", "file")
    input.setAttribute("accept", "image/*")
    input.click()

    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return

      const formData = new FormData()
      formData.append("file", file)

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Upload failed")
        }

        const data = await response.json()
        const editor = quillRef.current?.getEditor()
        const range = editor?.getSelection()
        if (range?.index !== undefined) {
          editor?.insertEmbed(range.index, "image", data.url)
        }
      } catch (error) {
        console.error("Error uploading image:", error)
      }
    }
  }, [])

  return (
    <div className="rich-text-editor">
      <DynamicReactQuill
        ref={quillRef}
        value={value}
        onChange={(content) => {
          // Ensure we're not sending undefined or null
          onChange(content || "")
        }}
        placeholder={placeholder}
        modules={{
          toolbar: {
            container: [
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image", "video"],
              ["clean"],
            ],
            handlers: {
              image: imageHandler,
            },
          },
        }}
        formats={[
          "header",
          "bold", "italic", "underline", "strike",
          "list", "bullet",
          "link", "image", "video",
        ]}
      />
    </div>
  )
} 