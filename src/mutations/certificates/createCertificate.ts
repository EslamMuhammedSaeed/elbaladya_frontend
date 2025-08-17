import { gql } from "@apollo/client";

export const CREATE_CERTIFICATE = gql`
  mutation createCertificateMain(
    $studentId: String!
    $courseId: String!
    $date: String!
  ) {
    createCertificateMain(
      studentId: $studentId
      courseId: $courseId
      date: $date
    ) {
      id
      studentId
      courseId
      date
      __typename
    }
  }
`;
