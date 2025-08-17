import { gql } from "@apollo/client";

export const GET_ALL_COURSES = gql`
  query GetAllCoursesPaginated($page: Int, $perPage: Int, $sortBy: String) {
    getAllCoursesPaginated(page: $page, perPage: $perPage, sortBy: $sortBy) {
      data {
        id
        arabicName
        englishName
        picture
        students {
          numberOfAttempts
          numberOfAttemptsOnTests
          timeSpentOnExams
          timeSpentTraining
          testResult
          trainingResult
        }
      }
      total
      per_page
      current_page
      last_page
    }
  }
`;
