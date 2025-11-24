"use client";

import { useState, useEffect } from "react";
import { FaPlusSquare } from "react-icons/fa";

import { QuestionInput } from "@/lib/types/exam";
import QuestionItem from "./QuestionItem";
import { Answer, Operator } from "@/lib/types/exam_enums";
import useDictionary from "@/lib/hooks/useDictionary";
import { toast } from "sonner";
import { removeTypename } from "@/lib/utils/utils";

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

type Props = {
  examId: string;
  questions?: QuestionInput[];
  onChange?: (questions: QuestionInput[]) => void;
};

export default function Questions({ examId, questions, onChange }: Props) {
  const { dict } = useDictionary();

  const [localQuestions, setLocalQuestions] = useState<QuestionInput[]>(
    (questions ?? []).map((q) => ({ ...q }))
  );

  useEffect(() => {
    if (onChange) onChange(localQuestions);
  }, [localQuestions, onChange]);

  const addQuestion = async () => {
    const next: QuestionInput = {
      id: uid(),
      text: "t",
      expression: {
        id: uid(),
        label: "l",
        operator: "EQ" as Operator,
        value: "v",
        variable: "v",
        reference: "",
      },
      answer: "RADIO" as Answer,
      reference: "",
      answers: [],
    } as QuestionInput;

    const res = await fetch(`/api/exams/${examId}/question/id`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || dict?.exams.questions.saveError);
    }

    // toast.success(dict?.exams.editExam.expression.saveSuccess);
    toast.success(dict?.exams.questions.saveSuccess);

    setLocalQuestions((s) => {
      const n = [...s, next];
      return n;
    });
  };

  const removeQuestion = (id: string) => {
    setLocalQuestions((s) => {
      const n = s.filter((q) => q.id !== id);
      return n;
    });
  };

  const updateQuestion = async (id: string, patch: Partial<QuestionInput>) => {
    const body = removeTypename(patch);

    const res = await fetch(`/api/exams/${examId}/question/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      // const txt = await res.text();
      throw new Error(dict?.exams.questions.updateError);
    }

    // toast.success(dict?.exams.editExam.expression.saveSuccess);
    toast.success(dict?.exams.questions.updateSuccess);

    setLocalQuestions((s) => {
      const n = s.map((q) => (q.id === id ? { ...q, ...patch } : q));
      return n;
    });
  };

  return (
    <div className="border-t pt-4" data-exam-id={examId}>
      <h2 className="text-2xl font-bold text-gray-100">
        {dict?.exams.questions.label}
      </h2>
      {localQuestions.map((q) => (
        <QuestionItem
          key={q.id}
          question={q}
          onRemove={() => removeQuestion(q.id)}
          onUpdate={(patch) => updateQuestion(q.id, patch)}
        />
      ))}

      <div className="flex justify-center mt-5">
        <button
          type="button"
          onClick={addQuestion}
          className="px-3 py-3 bg-green-800/50 text-gray-100 hover:cursor-pointer hover:bg-green-800/80"
          aria-label="add question"
        >
          <FaPlusSquare size={24} />
        </button>
      </div>
    </div>
  );
}
