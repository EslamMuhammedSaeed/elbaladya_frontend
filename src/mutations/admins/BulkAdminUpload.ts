import { gql } from "@apollo/client";

export const BULK_CREATE_ADMINS = gql`
  mutation BulkCreateAdmins($file: Upload!) {
    bulkCreateAdmins(file: $file) {
      successCount
      failed {
        row
        reason
        name
        email
      }
    }
  }
`;
