"use client";

import { useState } from "react";
import { FaTrash, FaPlusSquare } from "react-icons/fa";

import { ExpressionInput } from "@/lib/types/exam";
import { Operator } from "@/lib/types/exam_enums";
import { displayValue, parseValue } from "@/lib/utils/expression";
import { uid } from "@/lib/utils/utils";

type Props = {
  examId: string;
  expressions: ExpressionInput[];
};

export default function Expressions({ examId, expressions }: Props) {
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

  const removeExpression = (id: string) => {
    setLocalExpressions((s) => s.filter((e) => e.id !== id));
  };

  const updateExpression = (id: string, patch: Partial<ExpressionInput>) => {
    setLocalExpressions((s) =>
      s.map((e) => (e.id === id ? { ...e, ...patch } : e))
    );
  };

  return (
    <div className="border-t pt-4" data-exam-id={examId}>
      <h2 className="font-semibold">Expressions</h2>
      {localExpressions.map((ex) => (
        <div key={ex.id} className="p-2 border mb-2">
          <div className="flex gap-2 items-center">
            <input
              className="border p-1 flex-1"
              value={ex.label || ""}
              onChange={(e) =>
                updateExpression(ex.id, { label: e.target.value })
              }
              placeholder="label"
            />

            <select
              className="border p-1 w-24"
              value={ex.operator}
              onChange={(e) =>
                updateExpression(ex.id, {
                  operator: e.target.value as Operator,
                })
              }
            >
              {Object.values(Operator).map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>

            <input
              className="border p-1 w-40"
              value={displayValue(ex.value)}
              onChange={(e) =>
                updateExpression(ex.id, {
                  value: parseValue(e.target.value, ex.value),
                })
              }
              placeholder="value"
            />

            <button
              type="button"
              onClick={() => removeExpression(ex.id)}
              className="text-red-600 hover:bg-red-50 p-2 rounded transition-colors"
              aria-label="Eliminar"
              title="Eliminar"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addExpression}
        className="px-3 py-3 bg-green-800/50 text-gray-100 hover:cursor-pointer hover:bg-green-800/80"
        aria-label="add expression"
      >
        <FaPlusSquare size={24} />
      </button>
    </div>
  );
}
