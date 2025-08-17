import { gql } from "@apollo/client";

export const ADMIN_LOGIN = gql`
  mutation AdminLoginMain($email: String!, $hashedPassword: String!) {
    adminLoginMain(email: $email, hashedPassword: $hashedPassword) {
      token
      admin {
        id
        email
        name
      }
    }
  }
`;

export interface AdminLoginResponse {
  adminLoginMain: {
    token: string;
    admin: {
      id: string;
      email: string;
      name: string;
    };
  };
}

export interface AdminLoginVariables {
  email: string;
  hashedPassword: string;
}
