import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";

import App from "./App";
import { AuthProvider } from "@context/AuthContext";
import { DarkModeProvider } from "@context/DarkModeContext";
import "bootstrap/dist/css/bootstrap.rtl.min.css";
import "@styles/global.scss"; // optional
import "./i18n";
import client from "@apolloClient/client";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <AuthProvider>
        <DarkModeProvider>
          <App />
        </DarkModeProvider>
      </AuthProvider>
    </ApolloProvider>
  </React.StrictMode>
);
