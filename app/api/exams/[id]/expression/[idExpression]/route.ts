import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerApolloClient } from "@/lib/services/graphql/serverClient";
import type { ExpressionInput } from "@/lib/types/exam";
import {
  CREATE_EXAM_EXPRESSION_MUTATION,
  DELETE_EXAM_EXPRESSION_MUTATION,
  UPDATE_EXAM_EXPRESSION_MUTATION,
} from "@/lib/services/graphql/queries/examQueries";
import { uid } from "@/lib/utils/utils";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; idExpression: string }> }
) {
  try {
    const { id, idExpression } = await params;
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: ExpressionInput = await req.json();

    const input = [
      {
        id: `${idExpression}-${uid()}`,
        label: body.label,
        reference: body.reference,
        variable: body.variable,
        operator: body.operator,
        value: body.value,
      },
    ];

    const apolloClient = createServerApolloClient(sessionCookie);

    const result = await apolloClient.mutate({
      mutation: CREATE_EXAM_EXPRESSION_MUTATION,
      variables: { id, input },
    });

    const created =
      (
        result?.data as {
          createExamExpression: {
            id: string;
            expression: {
              id: string;
              operator: string;
              value: string;
              label: string;
              reference: string;
              variable: string;
            };
          };
        }
      )?.createExamExpression ?? null;

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
  { params }: { params: Promise<{ id: string; idExpression: string }> }
) {
  try {
    const { id, idExpression } = await params;
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: ExpressionInput = await req.json();
    const input = {
      id: idExpression,
      label: body.label,
      reference: body.reference,
      variable: body.variable,
      operator: body.operator,
      value: body.value,
    };
    const apolloClient = createServerApolloClient(sessionCookie);

    const result = await apolloClient.mutate({
      mutation: UPDATE_EXAM_EXPRESSION_MUTATION,
      variables: { id, input },
    });

    const updated =
      (
        result?.data as {
          updateExamExpression: {
            id: string;
            expression: {
              id: string;
              operator: string;
              value: string;
              label: string;
              reference: string;
              variable: string;
            };
          };
        }
      )?.updateExamExpression ?? null;

    return NextResponse.json({ data: updated });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error)?.message ?? String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; idExpression: string }> }
) {
  try {
    const { id, idExpression } = await params;
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const apolloClient = createServerApolloClient(sessionCookie);

    const result = await apolloClient.mutate({
      mutation: DELETE_EXAM_EXPRESSION_MUTATION,
      variables: { id, expressionId: idExpression },
    });

    const deleted =
      (
        result?.data as {
          deleteExamExpression: {
            id: string;
            expression: {
              id: string;
              operator: string;
              value: string;
              label: string;
              reference: string;
              variable: string;
            };
          };
        }
      )?.deleteExamExpression ?? null;

    return NextResponse.json({ data: deleted });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error)?.message ?? String(error) },
      { status: 500 }
    );
  }
}
