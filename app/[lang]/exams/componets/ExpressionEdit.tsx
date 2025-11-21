"use client";

import useDictionary from "@/lib/hooks/useDictionary";
import { ExpressionInput } from "@/lib/types/exam";
import { Operator } from "@/lib/types/exam_enums";
import {
  displayValue,
  getOperatorText,
  parseValue,
} from "@/lib/utils/expression";
import { FaSave, FaTrash } from "react-icons/fa";

type Props = {
  ex: ExpressionInput;
  updateExpression: (id: string, patch: Partial<ExpressionInput>) => void;
  saveExpression: (id: string) => void;
  removeExpression: (id: string) => void;
};

export default function ExpressionEdit({
  ex,
  updateExpression,
  saveExpression,
  removeExpression,
}: Props) {
  const { dict } = useDictionary();

  return (
    <div className="p-2 border rounded-lg mb-2">
      <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {dict?.exams.editExam.expression.item.label}
          </label>
          <input
            type="text"
            name="label"
            value={ex.label || ""}
            onChange={(e) => updateExpression(ex.id, { label: e.target.value })}
            placeholder={dict?.exams.editExam.expression.item.label}
            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {dict?.exams.editExam.expression.item.reference}
          </label>
          <input
            type="text"
            name="reference"
            value={ex.reference || ""}
            onChange={(e) =>
              updateExpression(ex.id, { reference: e.target.value })
            }
            placeholder={dict?.exams.editExam.expression.item.reference}
            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {dict?.exams.editExam.expression.item.variable}
          </label>
          <input
            type="text"
            name="variable"
            value={ex.variable || ""}
            onChange={(e) =>
              updateExpression(ex.id, { variable: e.target.value })
            }
            placeholder={dict?.exams.editExam.expression.item.variable}
            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {dict?.exams.editExam.expression.item.operator}
          </label>
          <select
            value={ex.operator}
            onChange={(e) =>
              updateExpression(ex.id, { operator: e.target.value as Operator })
            }
            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          >
            {Object.values(Operator).map((op) => (
              <option key={op} value={op} className="bg-gray-800 text-white">
                {getOperatorText(op)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {dict?.exams.editExam.expression.item.value}
          </label>
          <input
            type="text"
            name="value"
            value={displayValue(ex.value)}
            onChange={(e) =>
              updateExpression(ex.id, {
                value: parseValue(e.target.value, ex.value),
              })
            }
            placeholder={dict?.exams.editExam.expression.item.value}
            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>
        <div className="flex flex-row justify-around items-center align-middle">
          <button
            type="button"
            onClick={() => saveExpression(ex.id)}
            className="text-green-600 hover:bg-green-50 p-2 rounded transition-colors"
            aria-label="Save"
            title="Save"
          >
            <FaSave size={24} />
          </button>

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
    </div>
  );
}
