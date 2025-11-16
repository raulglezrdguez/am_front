"use client";

import Link from "next/link";
import useDictionary from "@/lib/hooks/useDictionary";

export default function Header() {
  const { dict } = useDictionary();

  return (
    <div className="flex flex-col justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-100 mb-5">
        {dict?.exams.title || "Exams"}
      </h1>
      <Link
        href={"exams/new"}
        className="px-4 py-2 bg-green-600/50 text-green-100 rounded-lg hover:bg-green-700 flex items-center gap-2"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        {dict?.exams.newExam || "Create exam"}
      </Link>
    </div>
  );
}
