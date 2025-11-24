"use client";

import useDictionary from "@/lib/hooks/useDictionary";
import { QuestionInput } from "@/lib/types/exam";
import { getOperatorText } from "@/lib/utils/expression";
import { FaEdit, FaTrash } from "react-icons/fa";

type Props = {
  question: QuestionInput;
  onEdit?: () => void;
  onDelete?: (id: string) => void;
};

const QuestionCard = ({ question, onDelete, onEdit }: Props) => {
  const { dict } = useDictionary();

  const handleDelete = () => {
    if (onDelete) {
      onDelete(question.id);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors mb-2">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-200 truncate flex-1">
          {question.id || "-"}
        </h3>

        <div className="flex gap-8 ml-4">
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="text-green-400 hover:bg-green-800/80 p-2 rounded-lg transition-colors"
              aria-label="Edit"
            >
              <FaEdit size={18} />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className="text-red-500 hover:bg-red-800/80 p-2 rounded-lg transition-colors"
              aria-label="Remove"
            >
              <FaTrash size={18} />
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <span className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
            {dict?.exams.questions.card.text}
          </span>
          <span className="text-gray-200 font-mono text-sm bg-gray-700/30 px-2 py-1 rounded">
            {question.text || "-"}
          </span>
        </div>

        <div className="space-y-1">
          <span className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
            {dict?.exams.questions.card.type}
          </span>
          <span className="text-gray-200 font-mono text-sm bg-gray-700/30 px-2 py-1 rounded">
            {question.answer || "-"}
          </span>
        </div>

        <div className="space-y-1">
          <span className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
            {dict?.exams.questions.card.expression}
          </span>
          <span className="text-gray-200 font-mono text-sm bg-gray-700/30 px-2 py-1 rounded">
            {`${question.expression.variable} ${getOperatorText(
              question.expression.operator
            )} ${question.expression.value}`}
          </span>
        </div>

        <div className="space-y-1">
          <span className="block text-xs font-medium text-gray-400 uppercase tracking-wider">
            {dict?.exams.questions.card.reference}
          </span>
          <span className="text-gray-200 font-mono text-sm bg-gray-700/30 px-2 py-1 rounded">
            {question.reference || "-"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
