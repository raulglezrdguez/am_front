// app/[locale]/exams/page.tsx
import { Suspense } from "react";
import Link from "next/link";

import { apolloServerClient } from "@/lib/services/graphql/serverClient";
import { GET_EXAMS } from "@/lib/services/graphql/queries/examQueries";
import { ExamsResponse } from "@/lib/types/exam";

// Componente de carga
function ExamsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse" />
      ))}
    </div>
  );
}

// Componente de error
function ExamsError({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <div className="text-red-600 text-lg mb-4">❌ {message}</div>
      <Link
        href="/exams/new"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Crear primer examen
      </Link>
    </div>
  );
}

// Componente de lista vacía
function EmptyExamsState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <div className="text-gray-600 text-lg mb-2">
        📭 No hay exámenes disponibles
      </div>
      <p className="text-gray-500 mb-6">Crea tu primer examen para empezar</p>
      <Link
        href="/exams/new"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        + Crear Examen
      </Link>
    </div>
  );
}

async function ExamsList() {
  try {
    const { data } = await apolloServerClient.query<ExamsResponse>({
      query: GET_EXAMS,
      // variables: { limit: 20, offset: 0 },
      // Cacheo: 5 minutos
      context: {
        fetchOptions: {
          next: { revalidate: 300 },
        },
      },
    });

    if (!data?.exams || data.exams.length === 0) {
      return <EmptyExamsState />;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {data.exams.map((exam) => (
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
                <span className="px-2 py-1 rounded-full bg-white/6 text-xs">
                  {exam.public ? "Público" : "Privado"}
                </span>

                {exam.author?.name && (
                  <span className="truncate">{exam.author.name}</span>
                )}

                {exam.author?.email && (
                  <span className="text-xs text-gray-400 truncate">
                    {exam.author.email}
                  </span>
                )}
              </div>

              <div className="text-xs text-gray-400">
                {exam.instructions
                  ? "Tiene instrucciones"
                  : "Sin instrucciones"}
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  } catch (error: unknown) {
    console.error("❌ Error fetching exams:", error);
    return <ExamsError message={(error as Error).message} />;
  }
}

export default async function ExamsPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-sans mt-10">
      <div className="flex flex-col justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-100 mb-5">Exams</h1>
        <Link
          href="/exams/new"
          className="px-4 py-2 bg-green-600/50 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
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
          Crear examen
        </Link>
      </div>

      <Suspense fallback={<ExamsSkeleton />}>
        <ExamsList />
      </Suspense>
    </div>
  );
}

// export default function ExamsPage() {
//   return (
//     <div className="flex min-h-screen items-center justify-center font-sans text-white">
//       <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start">
//         Exams
//       </main>
//     </div>
//   );
// }
