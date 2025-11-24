"use client";

import React, { useState } from "react";
import { FaPlusSquare, FaTrash, FaSave, FaTimes } from "react-icons/fa";

import {
  QuestionInput,
  AnswerOptionInput,
  ExpressionInput,
} from "@/lib/types/exam";
import { Answer, Operator } from "@/lib/types/exam_enums";
import { displayValue, parseValue } from "@/lib/utils/expression";
import { z } from "zod";
import { toast } from "sonner";
import useDictionary from "@/lib/hooks/useDictionary";

const AnswerOptionSchema = z.object({
  id: z.string(),
  value: z.string(),
  content: z.string(),
});

const ExpressionSchema = z.object({
  id: z.string(),
  operator: z.nativeEnum(Operator),
  value: z.union([z.string(), z.number(), z.boolean()]),
  label: z.string(),
  reference: z.string().optional(),
  variable: z.string().optional(),
});

const QuestionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, "El texto de la pregunta es obligatorio"),
  expression: ExpressionSchema,
  answer: z.nativeEnum(Answer),
  reference: z.string().optional(),
  answers: z.array(AnswerOptionSchema).optional(),
});

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

type Props = {
  question: QuestionInput;
  onSave: (q: QuestionInput) => void;
  onCancel: () => void;
};

export default function QuestionEdit({ question, onSave, onCancel }: Props) {
  const { dict } = useDictionary();

  const [id, setId] = useState(question.id ?? "");
  const [text, setText] = useState(question.text ?? "");
  const [answerType, setAnswerType] = useState<QuestionInput["answer"]>(
    question.answer
  );
  const [reference, setReference] = useState(question.reference ?? "");

  const [expression, setExpression] = useState<ExpressionInput>({
    ...question.expression,
  });
  const [answers, setAnswers] = useState<AnswerOptionInput[]>([
    ...(question.answers ?? []),
  ]);

  const addAnswer = () => {
    setAnswers((s) => [...s, { id: uid(), value: "", content: "" }]);
  };

  const removeAnswer = (id: string) => {
    setAnswers((s) => s.filter((a) => a.id !== id));
  };

  const updateAnswer = (id: string, patch: Partial<AnswerOptionInput>) => {
    setAnswers((s) => s.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  };

  const save = () => {
    const updated: QuestionInput = {
      ...question,
      id,
      text,
      answer: answerType,
      reference,
      expression,
      answers,
    };

    QuestionSchema.parse(updated);
    const parseResult = QuestionSchema.safeParse(updated);
    if (!parseResult.success) {
      const zodError = parseResult.error;
      const message = zodError.issues.map((i) => i.message).join(". ");
      toast.error(message);
      return;
    }

    onSave(updated);
  };

  const inputClasses =
    "w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-150 ease-in-out";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

  return (
    <div className="p-2 border rounded-lg mb-2">
      <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-lg p-8 space-y-6">
        <div>
          <label className={labelClasses}>
            {dict?.exams.questions.edit.identifier}
          </label>
          <input
            type={"text"}
            className={inputClasses}
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClasses}>
            {dict?.exams.questions.edit.text}
          </label>
          <textarea
            rows={3}
            className={`${inputClasses} resize-none`}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClasses}>
              {dict?.exams.questions.edit.kind}
            </label>
            <select
              className={inputClasses}
              value={answerType}
              onChange={(e) => setAnswerType(e.target.value as Answer)}
            >
              {Object.values(Answer).map((a) => (
                <option key={a} value={a} className="bg-gray-800 text-white">
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClasses}>
              {dict?.exams.questions.edit.reference}
            </label>
            <input
              type="text"
              className={inputClasses}
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder={dict?.exams.questions.edit.reference}
            />
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 space-y-4">
          <h3 className="text-xl font-semibold text-gray-200">
            {dict?.exams.questions.edit.expression}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className={labelClasses}>
                {dict?.exams.questions.edit.variable}
              </label>
              <input
                type="text"
                className={inputClasses}
                value={expression.variable || ""}
                onChange={(e) =>
                  setExpression({ ...expression, variable: e.target.value })
                }
                placeholder={dict?.exams.questions.edit.variable}
              />
            </div>

            <div>
              <label className={labelClasses}>
                {dict?.exams.questions.edit.operator}
              </label>
              <select
                className={inputClasses}
                value={expression.operator}
                onChange={(e) =>
                  setExpression({
                    ...expression,
                    operator: e.target.value as Operator,
                  })
                }
              >
                {Object.values(Operator).map((op) => (
                  <option
                    key={op}
                    value={op}
                    className="bg-gray-800 text-white"
                  >
                    {op}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClasses}>
                {dict?.exams.questions.edit.value}
              </label>
              <input
                type="text"
                className={inputClasses}
                value={displayValue(expression.value)}
                onChange={(e) =>
                  setExpression({
                    ...expression,
                    value: parseValue(e.target.value, expression.value),
                  })
                }
                placeholder={dict?.exams.questions.edit.value}
              />
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-6 space-y-4">
          <h3 className="text-xl font-semibold text-gray-200">
            {dict?.exams.questions.edit.answers}
          </h3>
          <div className="space-y-3">
            {answers.map((ans) => (
              <div
                key={ans.id}
                className="flex flex-col md:flex-row gap-2 items-start md:items-center bg-gray-700/30 p-3 rounded-lg border border-gray-600"
              >
                <input
                  type="text"
                  className={`${inputClasses} md:w-32`}
                  value={ans.value}
                  onChange={(e) =>
                    updateAnswer(ans.id, { value: e.target.value })
                  }
                  placeholder={dict?.exams.questions.edit.value}
                />
                <input
                  type="text"
                  className={`${inputClasses} flex-1`}
                  value={ans.content}
                  onChange={(e) =>
                    updateAnswer(ans.id, { content: e.target.value })
                  }
                  placeholder={dict?.exams.questions.edit.answer}
                />
                <button
                  type="button"
                  onClick={() => removeAnswer(ans.id)}
                  className="text-red-500 hover:text-red-400 p-2 rounded-full transition duration-150 ease-in-out self-end md:self-center"
                  aria-label="Remove option"
                >
                  <FaTrash size={20} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-5">
            <button
              type="button"
              onClick={addAnswer}
              className="px-3 py-3 bg-green-800/50 text-gray-100 hover:cursor-pointer hover:bg-green-800/80"
              aria-label="add expression"
            >
              <FaPlusSquare size={24} />
            </button>
          </div>
        </div>
        <div className="flex flex-row justify-around items-center align-middle">
          <button
            type="button"
            onClick={save}
            className="text-green-600 hover:bg-green-50 p-2 rounded transition-colors"
            aria-label="Save"
            title="Save"
          >
            <FaSave size={24} />
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="text-red-600 hover:bg-red-50 p-2 rounded transition-colors"
            aria-label="Cancel"
            title="Cancel"
          >
            <FaTimes size={24} />
          </button>
        </div>{" "}
      </div>
    </div>
  );
}
