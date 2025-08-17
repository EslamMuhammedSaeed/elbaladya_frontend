import { gql } from "@apollo/client";

export const GET_DASHBOARD_DATA = gql`
  query getDashboardData {
    getDashboardData {
      totalStudents
      studentsWithProgressCount
      studentsWithProgressPercentage
      totalTimeSpentTraining
      completedCoursesCount
      completedCoursesPercentage

      courses {
        id
        arabicName
        englishName
        studentCount
        totalTimeSpentTraining
        totalNumberOfAttempts
        averageTrainingResultPercentage
      }
      trainingResultCategories {
        label
        percentage
      }
    }
  }
`;
