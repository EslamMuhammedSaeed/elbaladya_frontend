import { gql } from "@apollo/client";

export const CREATE_ADMIN = gql`
  mutation createAdmin(
    $name: String!
    $email: String!
    $hashedPassword: String!
    $groupId: String!
  ) {
    createAdmin(
      name: $name
      email: $email
      hashedPassword: $hashedPassword
      groupId: $groupId
    ) {
      id
      name
      email
      group {
        id
        name
      }
      __typename
    }
  }
`;
