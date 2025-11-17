"use client";

import { useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreateExamInput } from "@/lib/types/exam";
import useDictionary from "@/lib/hooks/useDictionary";
import ErrorMessage from "@/components/ErrorMessage";

export default function NewExamPage() {
  const router = useRouter();
  const { dict, lang } = useDictionary();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<CreateExamInput>({
    title: "",
    subtitle: "",
    instructions: "",
    description: "",
    year: new Date().getFullYear(),
    public: false,
    expression: [],
    questions: [],
  });

  const examSchema = z.object({
    title: z.string().min(3, "Title is required"),
    subtitle: z.string().min(3, "Subtitle is required"),
    instructions: z.string().min(3, "Instructions is required"),
    description: z.string().min(3, "Description is required"),
    year: z.number().int().min(1801, { message: "Correct year is required" }),
    public: z.boolean(),
    expression: z.array(z.any()).optional(),
    questions: z.array(z.any()).optional(),
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const target = e.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? target.checked
          : name === "year"
          ? parseInt(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validate with Zod
      const parseResult = examSchema.safeParse(formData);
      if (!parseResult.success) {
        const zodError = parseResult.error;
        const message = zodError.issues.map((i) => i.message).join(". ");
        setError(message);
        setLoading(false);
        return;
      }

      // Fetch the API endpoint to create exam
      const response = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create exam");
      }

      const { _id } = await response.json();

      // Redirect to the new exam
      router.push(`/${lang}/exams/${_id}`);
    } catch (err) {
      setError((err as Error).message || "Error creating exam");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 bg-gray-900/20 mt-30">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-100">
            {dict?.exams?.newExam || "Create New Exam"}
          </h1>
          <Link
            href={`/${lang}/exams`}
            className="text-gray-400 hover:text-gray-200 flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Link>
        </div>

        {error && <ErrorMessage error={error} onClose={() => setError("")} />}

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-8 space-y-6"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter exam title"
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Subtitle *
            </label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              placeholder="Optional subtitle"
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter exam description"
              rows={4}
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Instructions *
            </label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              placeholder="Exam instructions for students"
              rows={3}
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Year *
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              min="1900"
              max={new Date().getFullYear() + 10}
              className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Public/Private */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="public"
                checked={formData.public}
                onChange={handleChange}
                className="w-4 h-4 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-green-500"
              />
              <span className="text-sm font-medium text-gray-300">
                Make exam public
              </span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Unchecked = private exam (only visible to author)
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white font-medium rounded-lg transition-colors"
            >
              {loading ? "Creating..." : "Create Exam"}
            </button>
            <Link
              href={`/${lang}/exams`}
              className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors text-center"
            >
              Cancel
            </Link>
          </div>

          {/* Note */}
          <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-300">
              <strong>Note:</strong> Questions and expressions can be added
              after creating the exam. This form creates the basic exam
              structure.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
