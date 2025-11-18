import { getExam } from "../../../../lib/services/graphql/queries/examQueries";
import ExamEditor from "../componets/ExamEditor";
import ErrorMessage from "@/components/ErrorMessage";

interface Props {
  params: Promise<{ lang: string; id: string }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  const { exam, error } = await getExam(id);

  return (
    <div>
      {error ? (
        <ErrorMessage error={error.message} />
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center font-sans mt-30">
          <h1 className="text-3xl font-bold text-gray-100 mb-5">Exam editor</h1>
          <ExamEditor initialExam={exam} />
        </div>
      )}
    </div>
  );
}
