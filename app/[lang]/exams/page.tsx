import { getExams } from "@/lib/services/graphql/queries/examQueries";
import { ExamsList } from "./componets/ExamList";
import Header from "./componets/Header";
import ErrorMessage from "@/components/ErrorMessage";

export default async function ExamsPage() {
  const { exams, error } = await getExams();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-sans mt-10">
      <Header />

      {error ? (
        <ErrorMessage error={error.message} />
      ) : (
        <ExamsList exams={exams} />
      )}
    </div>
  );
}
