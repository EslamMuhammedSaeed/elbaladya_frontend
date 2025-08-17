import { gql } from "@apollo/client";

export const UPDATE_STUDENT = gql`
  mutation updateStudentMain(
    $id: ID!
    $name: String!
    $groupId: String!
    $facultyId: String!
    $phone: String!
    $adminId: String!
    $stage: String!
    $badges: Int!
    $points: Int!
  ) {
    updateStudentMain(
      id: $id
      name: $name
      groupId: $groupId
      facultyId: $facultyId
      phone: $phone
      adminId: $adminId
      stage: $stage
      badges: $badges
      points: $points
    ) {
      id
      name
      phone
      facultyId
      adminId
      groupId
      stage
      badges
      points
      __typename
    }
  }
`;
