"use client"

import dynamic from "next/dynamic"
import "react-quill/dist/quill.snow.css"

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
})

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  return (
    <div className="rich-text-editor">
      <ReactQuill
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={{
          toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image", "video"],
            ["clean"],
          ],
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