import { gql } from "@apollo/client";

export const UPDATE_STUDENT_COURSE = gql`
  mutation updateStudentCourseMain(
    $id: ID!
    $progress: Float!
    $timeSpentTraining: Float!
    $trainingResult: Float!
    $testResult: Float!
    $numberOfAttempts: Int!
    $numberOfAttemptsOnTests: Int!
    $timeSpentOnExams: Float!
  ) {
    updateStudentCourseMain(
      id: $id
      progress: $progress
      timeSpentTraining: $timeSpentTraining
      trainingResult: $trainingResult
      testResult: $testResult
      numberOfAttempts: $numberOfAttempts
      numberOfAttemptsOnTests: $numberOfAttemptsOnTests
      timeSpentOnExams: $timeSpentOnExams
    ) {
      id
      progress
      timeSpentTraining
      trainingResult
      testResult
      numberOfAttempts
      numberOfAttemptsOnTests
      timeSpentOnExams
      __typename
    }
  }
`;
