import { gql } from "@apollo/client";

export const CREATE_GROUP = gql`
  mutation createGroup($name: String!, $category: String) {
    createGroup(name: $name, category: $category) {
      id
      name
      category
      __typename
    }
  }
`;
