"use client";

import useDictionary from "@/lib/hooks/useDictionary";

export default function EmptyExamsState() {
  const { dict } = useDictionary();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <div className="text-gray-600 text-lg mb-2">
        {dict?.exams.emptyExams || "No exams"}
      </div>
    </div>
  );
}
