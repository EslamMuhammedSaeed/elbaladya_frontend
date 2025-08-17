import { gql } from "@apollo/client";

export const DELETE_STUDENT = gql`
  mutation DeleteStudent($id: ID!) {
    deleteStudent(id: $id) {
      id
      name
    }
  }
`;
