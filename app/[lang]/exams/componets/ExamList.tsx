import { Exam } from "@/lib/types/exam";
import Link from "next/link";
import EmptyExamsState from "./EmptyExamsState";

export function ExamsList({ exams }: { exams: Exam[] }) {
  if (!exams || exams.length === 0) {
    return <EmptyExamsState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {exams.map((exam) => (
        <Link
          key={exam._id}
          href={`/exams/${exam._id}`}
          className="block p-6 bg-green-800/80 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-100 truncate flex-1">
              {exam.title}
            </h3>
            <span className="ml-3 text-sm text-gray-300 shrink-0">
              {exam.year}
            </span>
          </div>

          {exam.subtitle && (
            <p className="text-gray-300 text-sm mb-2 line-clamp-1">
              {exam.subtitle}
            </p>
          )}

          <p className="text-gray-200 text-sm mb-3 line-clamp-2">
            {exam.description}
          </p>

          <div className="flex items-center justify-between gap-4 mt-3">
            <div className="flex items-center gap-3 text-sm text-gray-300 truncate">
              {exam.author?.name && (
                <span className="truncate">{exam.author.name}</span>
              )}

              {exam.author?.email && (
                <span className="text-xs text-gray-400 truncate">
                  {exam.author.email}
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
