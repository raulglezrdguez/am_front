// Client-side editor component
"use client";

import { useState } from "react";
import { FaTrash, FaSave, FaSpinner, FaPlusSquare } from "react-icons/fa";

import ErrorMessage from "@/components/ErrorMessage";
import { Exam, ExpressionInput, QuestionInput } from "@/lib/types/exam";
import { Answer, Operator } from "@/lib/types/exam_enums";
import { displayValue, parseValue } from "@/lib/utils/expression";
import Expressions from "./Expressions";
import { toast } from "sonner";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export default function ExamEditor({
  initialExam,
}: {
  initialExam: Exam | null;
}) {
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

  const [expression, setExpression] = useState(
    (initialExam?.expression ?? []).map((e) => ({ ...e }))
  );

  const [questions, setQuestions] = useState(
    (initialExam?.questions ?? []).map((q) => ({ ...q }))
  );

  const addExpression = () => {
    setExpression((s) => [
      ...s,
      {
        id: uid(),
        operator: Operator.EQ,
        value: "",
        label: "",
        reference: "",
        variable: "",
      } as ExpressionInput,
    ]);
  };

  const removeExpression = (id: string) => {
    setExpression((s) => s.filter((e) => e.id !== id));
  };

  const updateExpression = (id: string, patch: ExpressionInput) => {
    setExpression((s) => s.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  };

  const addQuestion = () => {
    setQuestions((q) => [
      ...q,
      {
        id: uid(),
        text: "",
        answer: Answer.RADIO,
        reference: "",
        expression: {
          id: "",
          label: "",
          operator: Operator.EQ,
          value: "",
          variable: "",
          reference: "",
        },
        answers: [],
      } as QuestionInput,
    ]);
  };

  const removeQuestion = (id: string) => {
    setQuestions((q) => q.filter((x) => x.id !== id));
  };

  const updateQuestion = (id: string, patch: QuestionInput) => {
    setQuestions((q) => q.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  };

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
      expression,
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
      // Optionally refresh or show success
    } catch (err: unknown) {
      setError((err as Error).message || String(err));
    } finally {
      setSaving(false);
    }
  };

  return initialExam ? (
    <form onSubmit={onSubmit} className="min-w-96 space-y-4">
      {error && <ErrorMessage error={error} />}

      <div>
        <label className="block font-medium">Título</label>
        <input
          className="border p-2 w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label className="block font-medium">Subtítulo</label>
        <input
          className="border p-2 w-full"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />
      </div>

      <div>
        <label className="block font-medium">Instrucciones</label>
        <textarea
          className="border p-2 w-full"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
      </div>

      <div>
        <label className="block font-medium">Descripción</label>
        <textarea
          className="border p-2 w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label className="block font-medium">Año</label>
        <input
          type="number"
          className="border p-2"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        />
      </div>

      <div>
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
          <span className="ml-2">Público</span>
        </label>
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
        examId={initialExam?._id}
        expressions={initialExam?.expression}
      />

      <div className="border-t pt-4">
        <h2 className="font-semibold">Preguntas</h2>
        {questions.map((q: QuestionInput) => (
          <div key={q.id} className="p-2 border mb-2">
            <div>
              <input
                className="border p-1 w-full"
                value={q.text || ""}
                onChange={(e) =>
                  updateQuestion(q.id, { ...q, text: e.target.value })
                }
                placeholder="Texto de la pregunta"
              />
            </div>
            <div className="mt-2 flex gap-2">
              <select
                className="border p-1 w-24"
                value={q.answer}
                onChange={(e) =>
                  updateQuestion(q.id, {
                    ...q,
                    answer: e.target.value as Answer,
                  })
                }
              >
                {Object.values(Answer).map((ans) => (
                  <option key={ans} value={ans}>
                    {ans}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => removeQuestion(q.id)}
                className="text-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addQuestion}
          className="px-3 py-3 bg-green-800/50 text-gray-100 hover:cursor-pointer hover:bg-green-800/80"
          aria-label="add question"
        >
          <FaPlusSquare size={24} />
        </button>
      </div>
    </form>
  ) : null;
}
