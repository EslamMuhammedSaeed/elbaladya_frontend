import { gql } from "@apollo/client";

export const GET_VISION_DATA = gql`
  query getVisionData($groupId: String) {
    getVisionData(groupId: $groupId) {
      totalTrainingsWithStudents
      activeTrainings
      overallTrainingsSuccessPercentage
      overallTrainingsCompletedPercentage
      totalTrainingsWithStudentsPercentage
      activeTrainingsPercentage
    }
  }
`;

export const GET_USERS_DATA = gql`
  query getUsersData($groupId: String) {
    getUsersData(groupId: $groupId) {
      totalUsers
      totalAdmins
      totalStudents
      totalStudentsLastMonthIncreasePercentage
    }
  }
`;

export const GET_COURSES_DATA = gql`
  query getCoursesData($groupId: String) {
    getCoursesData(groupId: $groupId) {
      totalCourses
      totalGroups
      totalExams
      totalAssignments
    }
  }
`;

export const GET_TRAINING_TIME_DATA = gql`
  query getStudentCoursesTimeSpentTrainingData($groupId: String) {
    getStudentCoursesTimeSpentTrainingData(groupId: $groupId) {
      timeSpentTraining
      topCourses {
        id
        arabicName
        englishName
        timeSpentTraining
      }
    }
  }
`;

export const GET_STUDENT_COURSES_DATA = gql`
  query getStudentCoursesData($groupId: String) {
    getStudentCoursesData(groupId: $groupId) {
      totalCourses
      totalSuccessfulCourses
      totalSuccessfulCoursesPercentage
      totalFailedCourses
      totalFailedCoursesPercentage
      totalOnGoingCourses
      totalOnGoingCoursesPercentage
    }
  }
`;

export const GET_TOP_STUDENTS_DATA = gql`
  query getTopStudentsData($groupId: String) {
    getTopStudentsData(groupId: $groupId) {
      topStudents {
        id
        name
        points
        badges
        certificates
      }
    }
  }
`;
