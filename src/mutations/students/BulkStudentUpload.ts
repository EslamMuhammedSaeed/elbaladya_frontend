import { gql } from "@apollo/client";

export const BULK_CREATE_STUDENTS = gql`
  mutation BulkCreateStudents($file: Upload!) {
    bulkCreateStudents(file: $file) {
      successCount
      failed {
        row
        reason
        name
        phone
        facultyId
      }
    }
  }
`;
