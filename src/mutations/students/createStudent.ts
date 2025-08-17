import { gql } from "@apollo/client";

export const CREATE_STUDENT = gql`
  mutation createStudentMain(
    $name: String!
    $groupId: String!
    $facultyId: String!
    $phone: String!
    $adminId: String!
    $hadTutorial: Boolean
    $lastAttempt: DateTime
    $stage: String!
    $badges: Int
    $points: Int
  ) {
    createStudentMain(
      name: $name
      groupId: $groupId
      facultyId: $facultyId
      phone: $phone
      adminId: $adminId
      hadTutorial: $hadTutorial
      lastAttempt: $lastAttempt
      stage: $stage
      badges: $badges
      points: $points
    ) {
      id
      name
      phone
      stage
      __typename
    }
  }
`;
