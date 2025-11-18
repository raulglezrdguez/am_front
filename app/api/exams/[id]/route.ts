import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerApolloClient } from "../../../../lib/services/graphql/serverClient";
import { UPDATE_EXAM_PROPERTIES_MUTATION } from "../../../../lib/services/graphql/queries/examQueries";

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

    const body = await req.json();
    // const input = body;

    const inputProperties = {
      title: body.title,
      subtitle: body.subtitle,
      instructions: body.instructions,
      description: body.description,
      year: body.year,
      public: body.public,
    };

    const apolloClient = createServerApolloClient(sessionCookie);

    const result = await apolloClient.mutate({
      mutation: UPDATE_EXAM_PROPERTIES_MUTATION,
      variables: { id, input: inputProperties },
    });

    const updated =
      (
        result?.data as {
          updateExam: {
            _id: string;
            title: string;
            subtitle: string;
            instructions: string;
            description: string;
            public: string;
            year: string;
            // author: {
            //   name: string;
            //   email: string;
            // };
            // expression: {
            //   id: string;
            //   operator: string;
            //   value: string;
            //   label: string;
            //   reference: string;
            //   variable: string;
            // };
            // questions: {
            //   id: string;
            //   text: string;
            //   expression: {
            //     id: string;
            //     operator: string;
            //     value: string;
            //     label: string;
            //     reference: string;
            //     variable: string;
            //   };
            //   answer: string;
            //   reference: string;
            //   answers: {
            //     id: string;
            //     value: string;
            //     content: string;
            //   };
            // };
          };
        }
      )?.updateExam ?? null;

    console.log(updated);

    return NextResponse.json({ data: updated });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: (err as Error)?.message ?? String(err) },
      { status: 500 }
    );
  }
}
