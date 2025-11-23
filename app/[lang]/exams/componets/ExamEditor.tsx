"use client";

import { useState } from "react";
import { FaSave, FaSpinner } from "react-icons/fa";

import ErrorMessage from "@/components/ErrorMessage";
import { Exam, QuestionInput } from "@/lib/types/exam";
import Expressions from "./Expressions";
import Questions from "./Questions";
import { toast } from "sonner";
import useDictionary from "@/lib/hooks/useDictionary";

export default function ExamEditor({
  initialExam,
}: {
  initialExam: Exam | null;
}) {
  const { dict } = useDictionary();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState(initialExam?.title ?? "");
  const [subtitle, setSubtitle] = useState(initialExam?.subtitle ?? "");
  const [instructions, setInstructions] = useState(
    initialExam?.instructions ?? ""
  );
  const [description, setDescription] = useState(
    initialExam?.description ?? ""
  );
  const [year, setYear] = useState(
    initialExam?.year ?? new Date().getFullYear()
  );
  const [isPublic, setIsPublic] = useState(!!initialExam?.public);

  const [questions, setQuestions] = useState<QuestionInput[]>(
    (initialExam?.questions ?? []).map((q) => ({ ...q }))
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      title,
      subtitle,
      instructions,
      description,
      year,
      public: isPublic,
      questions,
    };

    try {
      const res = await fetch(`/api/exams/${initialExam?._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Error al guardar");
      }

      toast.success(`Exam "${title}" saved!`);
    } catch (err: unknown) {
      setError((err as Error).message || String(err));
    } finally {
      setSaving(false);
    }
  };

  return initialExam ? (
    <>
      {error && <ErrorMessage error={error} onClose={() => setError("")} />}

      <form
        onSubmit={onSubmit}
        className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-8 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {dict?.exams.createExam.title} *
          </label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={dict?.exams.createExam.title}
            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {dict?.exams.createExam.subtitle} *
          </label>
          <input
            type="text"
            name="subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder={dict?.exams.createExam.subtitle}
            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {dict?.exams.createExam.description} *
          </label>
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={dict?.exams.createExam.description}
            rows={4}
            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {dict?.exams.createExam.instructions} *
          </label>
          <textarea
            name="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder={dict?.exams.createExam.instructions}
            rows={3}
            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {dict?.exams.createExam.year} *
          </label>
          <input
            type="number"
            name="year"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            min="1900"
            max={new Date().getFullYear() + 10}
            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="public"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 bg-gray-700 border border-gray-600 rounded focus:ring-2 focus:ring-green-500"
            />
            <span className="text-sm font-medium text-gray-300">
              {dict?.exams.createExam.public}
            </span>
          </label>
          <p className="text-xs text-gray-500 mt-1">
            {dict?.exams.createExam.publicMsg}
          </p>
        </div>

        <div className="flex">
          <button
            disabled={saving}
            className="mx-auto px-6 py-6 bg-green-600/50 text-gray-100 hover:cursor-pointer hover:bg-green-600/80 rounded-xl"
            aria-label="Save"
          >
            {saving ? (
              <FaSpinner className="animate-spin" size={24} />
            ) : (
              <FaSave size={24} />
            )}
          </button>
        </div>
        <Expressions
          examId={initialExam?._id ?? ""}
          expressions={initialExam?.expression}
          setError={setError}
        />
        <Questions
          examId={initialExam?._id ?? ""}
          questions={questions}
          onChange={(q) => setQuestions(q)}
        />
      </form>
    </>
  ) : null;
}
