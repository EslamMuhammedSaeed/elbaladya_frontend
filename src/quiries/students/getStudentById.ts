import { gql } from "@apollo/client";

export const GET_STUDENT_BY_ID = gql`
  query GetStudentById($id: ID!) {
    getStudentById(id: $id) {
      id
      name
      email
      facultyId
      phone
      profilePicture
      hadTutorial
      lastAttempt
      badges
      points
      createdAt
      updatedAt
      device {
        id
        name
        macAddress
      }
      courses {
        id
        progress
        testResult
        trainingResult
        numberOfAttempts
        timeSpentTraining
        timeSpentOnExams
        numberOfAttemptsOnTests
        course {
          arabicName
          englishName
        }
      }
      certificates {
        id
        createdAt
      }
    }
  }
`;
