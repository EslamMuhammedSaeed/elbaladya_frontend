import { gql } from "@apollo/client";

export const GET_ALL_ADMINS = gql`
  query getAllAdminsPaginated(
    $page: Int
    $perPage: Int
    $sortBy: String
    $filters: AdminFilters
  ) {
    getAllAdminsPaginated(
      page: $page
      perPage: $perPage
      sortBy: $sortBy
      filters: $filters
    ) {
      data {
        id
        name
        email
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

export const GET_ALL_ADMINS_NOT_PAGINATED = gql`
  query getAllAdminsNotPaginated($sortBy: String, $filters: AdminFilters) {
    getAllAdminsNotPaginated(sortBy: $sortBy, filters: $filters) {
      data {
        id
        name
        email
        group {
          id
          name
        }
      }
    }
  }
`;
