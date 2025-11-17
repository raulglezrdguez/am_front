import { gql } from "@apollo/client";
import { cookies } from "next/headers";
import { createServerApolloClient } from "../serverClient";
import { ExamsResponse } from "@/lib/types/exam";

export const GET_EXAMS = gql`
  # query GetExams($limit: Int = 20, $offset: Int = 0) {
  #   exams(limit: $limit, offset: $offset) {
  query GetExams {
    exams {
      _id
      title
      subtitle
      instructions
      description
      public
      author {
        name
        email
      }
      year
      expression {
        id
        operator
        value
        label
        reference
        variable
      }
      questions {
        id
        text
        expression {
          id
          operator
          value
          label
          reference
          variable
        }
        answer
        reference
        answers {
          id
          value
          content
        }
      }
    }
  }
`;

export const CREATE_EXAM_MUTATION = gql`
  mutation CreateExam($input: CreateExamInput!) {
    createExam(input: $input) {
      _id
      title
      subtitle
      description
      year
      public
      author {
        name
        email
      }
    }
  }
`;

export async function getExams() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

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

    return { exams };
  } catch (error) {
    const errorObj = error as Record<string, unknown>;
    if (errorObj.code === "auth/argument-error") {
      return { exams: [], error: { message: "Invalid session", status: 401 } };
    }

    return {
      exams: [],
      error: {
        message: (error as Error).message || "Internal server error",
        status: 500,
      },
    };
  }
}
