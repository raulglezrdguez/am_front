import { cookies } from "next/headers";
import { createServerApolloClient } from "@/lib/services/graphql/serverClient";
import { GET_EXAMS } from "@/lib/services/graphql/queries/examQueries";
import { ExamsResponse } from "@/lib/types/exam";
import { ExamsList } from "./componets/ExamList";
import Header from "./componets/Header";
import { adminAuth } from "@/lib/firebase/admin";

export default async function ExamsPage() {
  let token: string | undefined;

  try {
    // Read session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    console.log(sessionCookie);
    if (sessionCookie) {
      // Verify the session cookie and extract token/uid
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
      // For now, pass the uid; backend can validate with this
      // If you need the actual ID token, you'd need to store it or regenerate it
      token = decodedClaims.uid;
      console.log("token", token);
    }
  } catch (error) {
    console.error("Error verifying session:", error);
    // Continue without token if session verification fails
  }

  // Create Apollo client with token (if available)
  const serverClient = createServerApolloClient(token);

  const { data } = await serverClient.query<ExamsResponse>({
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
