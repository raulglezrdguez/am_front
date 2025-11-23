import {
  CREATE_EXAM_QUESTION_MUTATION,
  UPDATE_EXAM_QUESTION_MUTATION,
} from "@/lib/services/graphql/queries/examQueries";
import { createServerApolloClient } from "@/lib/services/graphql/serverClient";
import { QuestionInput } from "@/lib/types/exam";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: QuestionInput = await req.json();

    const input = [
      {
        ...body,
      },
    ];

    const apolloClient = createServerApolloClient(sessionCookie);

    const result = await apolloClient.mutate({
      mutation: CREATE_EXAM_QUESTION_MUTATION,
      variables: { id, input },
    });

    const created =
      (
        result?.data as {
          createExamQuestion: {
            id: string;
            questions: {
              id: string;
            };
          };
        }
      )?.createExamQuestion ?? null;

    return NextResponse.json({ data: created });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error)?.message ?? String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: QuestionInput = await req.json();

    const input = {
      ...body,
    };

    const apolloClient = createServerApolloClient(sessionCookie);

    const result = await apolloClient.mutate({
      mutation: UPDATE_EXAM_QUESTION_MUTATION,
      variables: { id, input },
    });

    const updated =
      (
        result?.data as {
          updateExamQuestion: {
            id: string;
            questions: {
              id: string;
            };
          };
        }
      )?.updateExamQuestion ?? null;

    return NextResponse.json({ data: updated });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error)?.message ?? String(error) },
      { status: 500 }
    );
  }
}
