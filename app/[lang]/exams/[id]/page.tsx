import Link from "next/link";
import { getExam } from "../../../../lib/services/graphql/queries/examQueries";
import ExamEditor from "../componets/ExamEditor";
import ErrorMessage from "@/components/ErrorMessage";
import { getDictionary } from "../../dictionaries";
import { Lang } from "@/types/languages";

interface Props {
  params: Promise<{ lang: Lang; id: string }>;
}

export default async function Page({ params }: Props) {
  const { id, lang } = await params;
  const dict = await getDictionary(lang);

  const { exam, error } = await getExam(id);

  return (
    <div>
      {error ? (
        <ErrorMessage error={error.message} />
      ) : (
        <div className="min-h-screen px-4 sm:px-6 lg:px-8 bg-gray-900/20 mt-30">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold text-gray-100">
                {dict?.exams.editExam.title}
              </h1>
              <Link
                href={`/${lang}/exams`}
                className="text-gray-400 hover:text-gray-200 flex items-center gap-2"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Link>
            </div>
            <ExamEditor initialExam={exam} />
          </div>
        </div>
      )}
    </div>
  );
}
