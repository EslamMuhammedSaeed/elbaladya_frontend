import { ApolloClient, InMemoryCache, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

const uploadLink = createUploadLink({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT, // ✅ uses your env
  fetchOptions: {
    mode: "cors",
  },
  headers: {
    "Accept-Language": "en-US,en;q=0.9,ar;q=0.8",
    DNT: "1",
    // DO NOT manually set "Content-Type"
  },
});

// Auth link to add token to headers
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("authToken");

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: from([authLink, uploadLink]),
  cache: new InMemoryCache(),
});

export default client;
