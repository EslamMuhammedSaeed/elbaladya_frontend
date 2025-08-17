import { gql } from "@apollo/client";

export const GET_ALL_DEVICES = gql`
  query GetAllDevices {
    getAllDevices {
      id
      name
      macAddress
    }
  }
`;
