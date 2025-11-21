"use client";

import useDictionary from "@/lib/hooks/useDictionary";
import { ExpressionInput } from "@/lib/types/exam";
import { displayValue, getOperatorText } from "@/lib/utils/expression";
import { FaEdit, FaTrash } from "react-icons/fa";

type Props = {
  ex: ExpressionInput;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export default function ExpressionCard({ ex, onEdit, onDelete }: Props) {
  const { dict } = useDictionary();

  return (
    <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-200 truncate flex-1">
          {ex.label || "No label"}
        </h3>
        <div className="flex gap-8 ml-4">
          {onEdit && (
            <button
              onClick={() => onEdit(ex.id)}
              className="text-green-400 hover:bg-green-800/80 p-2 rounded-lg transition-colors"
              aria-label="Edit"
              title="Edit"
            >
              <FaEdit size={18} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(ex.id)}
              className="text-red-500 hover:bg-red-800/80 p-2 rounded-lg transition-colors"
              aria-label="Remove"
              title="Remove"
            >
              <FaTrash size={18} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <span className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
            {dict?.exams.editExam.expression.item.variable}
          </span>
          <span className="text-gray-200 font-mono text-sm bg-gray-700/30 px-2 py-1 rounded">
            {ex.variable || "-"}
          </span>
        </div>

        <div className="space-y-1">
          <span className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
            {dict?.exams.editExam.expression.item.operator}
          </span>
          <span className="text-gray-200 text-sm">
            {getOperatorText(ex.operator)}
          </span>
        </div>

        {/* Value */}
        <div className="space-y-1">
          <span className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
            {dict?.exams.editExam.expression.item.value}
          </span>
          <span className="text-gray-200 text-sm font-mono bg-gray-700/30 px-2 py-1 rounded">
            {displayValue(ex.value)}
          </span>
        </div>

        {/* Reference */}
        <div className="space-y-1">
          <span className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
            {dict?.exams.editExam.expression.item.reference}
          </span>
          <span className="text-gray-300 text-sm truncate">
            {ex.reference || "-"}
          </span>
        </div>
      </div>
    </div>
  );
}
