import { gql } from "@apollo/client";

export const GET_ALL_GROUPS = gql`
  query getAllGroupsPaginated(
    $page: Int
    $perPage: Int
    $sortBy: String
    $filters: GroupFilters
  ) {
    getAllGroupsPaginated(
      page: $page
      perPage: $perPage
      sortBy: $sortBy
      filters: $filters
    ) {
      data {
        id
        name
        category
        usersCount
      }
      total
      per_page
      current_page
      last_page
    }
  }
`;

export const GET_ALL_GROUPS_NOT_PAGINATED = gql`
  query getAllGroups($sortBy: String, $filters: GroupFilters) {
    getAllGroups(sortBy: $sortBy, filters: $filters) {
      data {
        id
        name
        category
        usersCount
      }
    }
  }
`;

export const GET_ALL_STUDENT_GROUPS = gql`
  query getAllStudentGroups($sortBy: String, $filters: GroupFilters) {
    getAllStudentGroups(sortBy: $sortBy, filters: $filters) {
      data {
        id
        name
        category
        usersCount
      }
    }
  }
`;

export const GET_ALL_ADMIN_GROUPS = gql`
  query getAllAdminGroups($sortBy: String, $filters: GroupFilters) {
    getAllAdminGroups(sortBy: $sortBy, filters: $filters) {
      data {
        id
        name
        category
        usersCount
      }
    }
  }
`;
