"use client";

import { useState } from "react";

import { QuestionInput } from "@/lib/types/exam";
import QuestionEdit from "./QuestionEdit";
import QuestionCard from "./QuestionCard";

type Props = {
  question: QuestionInput;
  onRemove: () => void;
  onUpdate: (patch: Partial<QuestionInput>) => void;
};

export default function QuestionItem({ question, onRemove, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);

  const handleSave = (updated: QuestionInput) => {
    onUpdate(updated);
    setEditing(false);
  };

  return !editing ? (
    <QuestionCard
      question={question}
      onDelete={onRemove}
      onEdit={() => setEditing(true)}
    />
  ) : (
    <QuestionEdit
      question={question}
      onCancel={() => setEditing(false)}
      onSave={handleSave}
    />
  );
}
