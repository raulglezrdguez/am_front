import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { createServerApolloClient } from "@/lib/services/graphql/serverClient";
// import { adminAuth } from "@/lib/firebase/admin";
import { CreateExamInput } from "@/lib/types/exam";
import {
  CREATE_EXAM_MUTATION,
  getExams,
} from "@/lib/services/graphql/queries/examQueries";

export async function GET() {
  try {
    const { exams, error } = await getExams();

    if (error) {
      return NextResponse.json({ error: error.message, status: error.status });
    }

    return NextResponse.json(exams, { status: 200 });
  } catch (error: unknown) {
    const errorObj = error as Record<string, unknown>;
    if (errorObj.code === "auth/argument-error") {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    return NextResponse.json(
      { error: (error as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify session cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = (await request.json()) as Partial<CreateExamInput>;

    // Validate required fields
    if (
      !body.title ||
      !body.subtitle ||
      !body.instructions ||
      !body.description
    ) {
      return NextResponse.json({ error: "Fields required" }, { status: 400 });
    }

    // Prepare exam data
    const examInput: CreateExamInput = {
      title: body.title.trim(),
      subtitle: body.subtitle?.trim(),
      instructions: body.instructions?.trim(),
      description: body.description.trim(),
      year: body.year || new Date().getFullYear(),
      public: body.public ?? false,
      expression: body.expression || [],
      questions: body.questions || [],
    };

    // Create exam via GraphQL (pass undefined as token; session is verified above)
    const apolloClient = createServerApolloClient(undefined);
    const result = await apolloClient.mutate({
      mutation: CREATE_EXAM_MUTATION,
      variables: { input: examInput },
    });

    const data = result.data as { createExam?: { _id: string } } | undefined;

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message || "Failed to create exam" },
        { status: 400 }
      );
    }

    if (!data?.createExam) {
      return NextResponse.json(
        { error: "Failed to create exam" },
        { status: 500 }
      );
    }

    return NextResponse.json(data.createExam, { status: 201 });
  } catch (error: unknown) {
    const errorObj = error as Record<string, unknown>;
    if (errorObj.code === "auth/argument-error") {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    return NextResponse.json(
      { error: (error as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
