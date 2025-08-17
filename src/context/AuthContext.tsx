import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

interface Admin {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  admin: Admin | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, admin: Admin) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on app start
    const storedToken = localStorage.getItem("authToken");
    const storedAdmin = localStorage.getItem("adminData");

    console.log("AuthContext: Checking stored auth data", {
      storedToken: !!storedToken,
      storedAdmin: !!storedAdmin,
    });

    if (storedToken && storedAdmin) {
      try {
        const adminData = JSON.parse(storedAdmin);
        console.log("AuthContext: Restoring auth state", { adminData });
        setToken(storedToken);
        setAdmin(adminData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("AuthContext: Error parsing stored admin data", error);
        // If stored data is corrupted, clear it
        localStorage.removeItem("authToken");
        localStorage.removeItem("adminData");
      }
    } else {
      console.log("AuthContext: No stored auth data found");
    }

    // Mark loading as complete
    setIsLoading(false);
  }, []);

  const login = (newToken: string, adminData: Admin) => {
    console.log("AuthContext: Logging in", { adminData });
    setToken(newToken);
    setAdmin(adminData);
    setIsAuthenticated(true);

    // Store in localStorage
    localStorage.setItem("authToken", newToken);
    localStorage.setItem("adminData", JSON.stringify(adminData));
    console.log("AuthContext: Auth data stored in localStorage");
  };

  const logout = () => {
    console.log("AuthContext: Logging out");
    setToken(null);
    setAdmin(null);
    setIsAuthenticated(false);

    // Clear localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("adminData");
    console.log("AuthContext: Auth data cleared from localStorage");
  };

  const value: AuthContextType = {
    isAuthenticated,
    admin,
    token,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
