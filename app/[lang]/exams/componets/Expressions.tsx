"use client";

import { useState } from "react";
import { FaPlusSquare } from "react-icons/fa";
import { z } from "zod";

import { ExpressionInput } from "@/lib/types/exam";
import { Operator } from "@/lib/types/exam_enums";
import { uid } from "@/lib/utils/utils";
import { toast } from "sonner";
import ExpressionItem from "./ExpressionItem";
import { parseValueOnly } from "@/lib/utils/expression";
import useDictionary from "@/lib/hooks/useDictionary";

type Props = {
  examId: string;
  expressions: ExpressionInput[];
  setError: (error: string) => void;
};

export default function Expressions({ examId, expressions, setError }: Props) {
  const { dict } = useDictionary();

  const expressionSchema = z.object({
    id: z.string().min(3, dict?.exams.editExam.expression.validId),
    label: z.string().min(1, dict?.exams.editExam.expression.validLabel),
    reference: z.string().optional(),
    variable: z.string().min(1, dict?.exams.editExam.expression.validVariable),
    operator: z.enum(Operator),
    value: z
      .string()
      .min(1, dict?.exams.editExam.expression.validValue)
      .transform(parseValueOnly),
  });

  const [localExpressions, setLocalExpressions] = useState<ExpressionInput[]>(
    (expressions ?? []).map((e) => ({ ...e }))
  );

  const addExpression = () => {
    const next: ExpressionInput = {
      id: uid(),
      operator: Operator.EQ,
      value: "",
      label: "",
      reference: "",
      variable: "",
    } as ExpressionInput;
    setLocalExpressions((s) => [...s, next]);
  };

  const removeExpression = async (id: string) => {
    setLocalExpressions((s) => s.filter((e) => e.id !== id));
    if (id.length === 7) return;

    try {
      const res = await fetch(`/api/exams/${examId}/expression/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Error saving expression");
      }

      toast.success("Expression removed!");
    } catch (err) {
      setError((err as Error).message || String(err));
    }
  };

  const updateExpression = (id: string, patch: Partial<ExpressionInput>) => {
    setLocalExpressions((s) =>
      s.map((e) => (e.id === id ? { ...e, ...patch } : e))
    );
  };

  const saveExpression = async (id: string) => {
    const ex = localExpressions.find((e) => e.id === id);

    if (ex) {
      try {
        const payload = {
          id,
          label: ex.label,
          reference: ex.reference,
          variable: ex.variable,
          operator: ex.operator,
          value: ex.value,
        };

        const parseResult = expressionSchema.safeParse(payload);
        if (!parseResult.success) {
          const zodError = parseResult.error;
          const message = zodError.issues.map((i) => i.message).join(". ");
          setError(message);

          toast.error(message);
          return;
        }

        const res = await fetch(`/api/exams/${examId}/expression/${id}`, {
          method: id.length === 7 ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || dict?.exams.editExam.expression.saveError);
        }
        const result = await res.json();
        const expression: ExpressionInput[] = result.data.expression;
        const currentExpression = expression.find((e: ExpressionInput) =>
          e.id.startsWith(id)
        );

        if (currentExpression) {
          ex.id = currentExpression.id;

          toast.success(dict?.exams.editExam.expression.saveSuccess);
        } else {
          toast.error(dict?.exams.editExam.expression.saveError);
        }
      } catch (err) {
        setError((err as Error).message || String(err));
      }
    }
  };

  return (
    <div className="border-t pt-4" data-exam-id={examId}>
      <h2 className="text-2xl font-bold text-gray-100">
        {dict?.exams.editExam.expression.title}
      </h2>
      {localExpressions.map((ex) => (
        <ExpressionItem
          key={ex.id}
          ex={ex}
          removeExpression={removeExpression}
          saveExpression={saveExpression}
          updateExpression={updateExpression}
        />
      ))}

      <div className="flex justify-center">
        <button
          type="button"
          onClick={addExpression}
          className="px-3 py-3 bg-green-800/50 text-gray-100 hover:cursor-pointer hover:bg-green-800/80"
          aria-label="add expression"
        >
          <FaPlusSquare size={24} />
        </button>
      </div>
    </div>
  );
}
