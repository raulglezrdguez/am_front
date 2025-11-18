"use client";

import { useState } from "react";
import { FaTrash, FaPlusSquare, FaSave } from "react-icons/fa";

import { ExpressionInput } from "@/lib/types/exam";
import { Operator } from "@/lib/types/exam_enums";
import {
  displayValue,
  getOperatorText,
  parseValue,
} from "@/lib/utils/expression";
import { uid } from "@/lib/utils/utils";
import { toast } from "sonner";

type Props = {
  examId: string;
  expressions: ExpressionInput[];
  setError: (error: string) => void;
};

export default function Expressions({ examId, expressions, setError }: Props) {
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

  const saveExpression = async (id: string) => {
    const ex = localExpressions.find((e) => e.id === id);

    if (ex) {
      const payload = {
        label: ex.label,
        reference: ex.reference,
        variable: ex.variable,
        operator: ex.operator,
        value: ex.value,
      };
      try {
        const res = await fetch(`/api/expression/${id}`, {
          method: id.length === 7 ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || "Error saving expression");
        }

        toast.success(`Expression "${payload.label}" saved!`);
      } catch (err) {
        setError((err as Error).message || String(err));
      }
    }
  };

  return (
    <div className="border-t pt-4" data-exam-id={examId}>
      <h2 className="font-semibold">Expressions</h2>
      {localExpressions.map((ex) => (
        <div key={ex.id} className="p-2 border mb-2">
          <div className="flex gap-2 items-center">
            <button
              type="button"
              onClick={() => saveExpression(ex.id)}
              className="text-green-600 hover:bg-green-50 p-2 rounded transition-colors"
              aria-label="Save"
              title="Save"
            >
              <FaSave size={24} />
            </button>
            <div className="flex flex-col align-middle justify-center items-center gap-3">
              <div className="flex flex-row align-middle items-center justify-around w-full">
                <input
                  className="border p-1"
                  value={ex.label || ""}
                  onChange={(e) =>
                    updateExpression(ex.id, { label: e.target.value })
                  }
                  placeholder="label"
                />
                <input
                  className="border p-1"
                  value={ex.reference || ""}
                  onChange={(e) =>
                    updateExpression(ex.id, { reference: e.target.value })
                  }
                  placeholder="reference"
                />
              </div>
              <div className="flex flex-row">
                <input
                  className="border p-1 flex-1"
                  value={ex.variable || ""}
                  onChange={(e) =>
                    updateExpression(ex.id, { variable: e.target.value })
                  }
                  placeholder="variable"
                />

                <select
                  className="border p-1 min-w-24"
                  value={ex.operator}
                  onChange={(e) =>
                    updateExpression(ex.id, {
                      operator: e.target.value as Operator,
                    })
                  }
                >
                  {Object.values(Operator).map((op) => (
                    <option key={op} value={op}>
                      {getOperatorText(op)}
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
              </div>
            </div>

            <button
              type="button"
              onClick={() => removeExpression(ex.id)}
              className="text-red-600 hover:bg-red-50 p-2 rounded transition-colors"
              aria-label="Eliminar"
              title="Eliminar"
            >
              <FaTrash size={24} />
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
