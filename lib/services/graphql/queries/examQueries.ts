import { gql } from "@apollo/client";
import { cookies } from "next/headers";
import { createServerApolloClient } from "../serverClient";
import { ExamResponse, ExamsResponse } from "@/lib/types/exam";

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

export const GET_EXAM = gql`
  query GetExam($id: ID!) {
    exam(id: $id) {
      _id
      title
      subtitle
      instructions
      description
      public
      year
      author {
        name
        email
      }
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

export const UPDATE_EXAM_PROPERTIES_MUTATION = gql`
  mutation updateExamProperties($id: ID!, $input: UpdateExamPropertiesInput!) {
    updateExamProperties(id: $id, input: $input) {
      _id
      title
      subtitle
      instructions
      description
      public
      year
      # author {
      #   name
      #   email
      # }
      # expression {
      #   id
      #   operator
      #   value
      #   label
      #   reference
      #   variable
      # }
      # questions {
      #   id
      #   text
      #   expression {
      #     id
      #     operator
      #     value
      #     label
      #     reference
      #     variable
      #   }
      #   answer
      #   reference
      #   answers {
      #     id
      #     value
      #     content
      #   }
      # }
    }
  }
`;

export const CREATE_EXAM_EXPRESSION_MUTATION = gql`
  mutation createExamExpression($id: ID!, $input: [ExpressionInput!]!) {
    createExamExpression(id: $id, input: $input) {
      _id
      expression {
        id
        operator
        value
        label
        reference
        variable
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

export async function getExam(id: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    // Create Apollo client with token (if available)
    const serverClient = createServerApolloClient(token);

    const { data } = await serverClient.query<ExamResponse>({
      query: GET_EXAM,
      context: {
        fetchOptions: {
          next: { revalidate: 300 },
        },
      },
      variables: { id },
    });

    console.log(data);
    const exam = data?.exam || null;

    return { exam };
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
