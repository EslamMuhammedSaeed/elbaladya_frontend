import { gql } from "@apollo/client";

export const GLOBAL_SEARCH = gql`
  query searchModel($search: String!) {
    searchModel(search: $search) {
      students {
        id
        name
        facultyId
      }
      courses {
        id
        arabicName
        englishName
      }
      groups {
        id
        name
      }
      admins {
        id
        name
      }
    }
  }
`;
