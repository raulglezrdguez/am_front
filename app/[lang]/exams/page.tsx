import { apolloServerClient } from "@/lib/services/graphql/serverClient";
import { GET_EXAMS } from "@/lib/services/graphql/queries/examQueries";
import { ExamsResponse } from "@/lib/types/exam";
import { ExamsList } from "./componets/ExamList";
import Header from "./componets/Header";

export default async function ExamsPage() {
  const { data } = await apolloServerClient.query<ExamsResponse>({
    query: GET_EXAMS,
    context: {
      fetchOptions: {
        next: { revalidate: 300 },
      },
    },
  });

  const exams = data?.exams || [];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-sans mt-10">
      <Header />

      <ExamsList exams={exams} />
    </div>
  );
}
