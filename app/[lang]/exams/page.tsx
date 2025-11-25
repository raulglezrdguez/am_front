import { getMyExams } from "@/lib/services/graphql/queries/examQueries";
import { ExamsList } from "./componets/ExamList";
import ExamListHeader from "./componets/ExamListHeader";
import ErrorMessage from "@/components/ErrorMessage";

export default async function ExamsPage() {
  const { exams, error } = await getMyExams();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-sans mt-30">
      <ExamListHeader />

      {error ? (
        <ErrorMessage error={error.message} />
      ) : (
        <ExamsList exams={exams} />
      )}
    </div>
  );
}
