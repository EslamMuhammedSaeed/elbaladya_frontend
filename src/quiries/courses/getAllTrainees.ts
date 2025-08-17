import { gql } from "@apollo/client";

export const GET_ALL_STUDENTS = gql`
  query GetAllStudentsPaginated(
    $page: Int
    $perPage: Int
    $sortBy: String
    $filters: StudentFilters
  ) {
    getAllStudentsPaginated(
      page: $page
      perPage: $perPage
      sortBy: $sortBy
      filters: $filters
    ) {
      data {
        id
        name
        facultyId
        stage
        phone
        profilePicture
        lastAttempt
        points
        badges
        adminId
        groupId
        courses {
          courseId
          numberOfAttempts
          testResult
          timeSpentTraining
          timeSpentOnExams
        }
        group {
          id
          name
        }
      }
      total
      per_page
      current_page
      last_page
    }
  }
`;

export const GET_ALL_STUDENTS_NOT_PAGINATED = gql`
  query GetAllStudentsNotPaginated($sortBy: String, $filters: StudentFilters) {
    getAllStudentsNotPaginated(sortBy: $sortBy, filters: $filters) {
      data {
        id
        name
        facultyId
        phone
        stage
        lastAttempt
        points
        badges
        courses {
          courseId
          numberOfAttempts
          testResult
          timeSpentTraining
          timeSpentOnExams
        }
        group {
          id
          name
        }
      }
    }
  }
`;
