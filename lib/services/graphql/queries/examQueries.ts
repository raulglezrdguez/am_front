import { gql } from "@apollo/client";

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
