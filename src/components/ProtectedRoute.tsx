import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  console.log("ProtectedRoute: Auth state", {
    isAuthenticated,
    isLoading,
    pathname: location.pathname,
  });

  // Show loading while checking authentication
  if (isLoading) {
    console.log("ProtectedRoute: Showing loading spinner");
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("ProtectedRoute: Redirecting to login");
    // Redirect to login page with the return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log("ProtectedRoute: Rendering protected content");
  return <>{children}</>;
};
