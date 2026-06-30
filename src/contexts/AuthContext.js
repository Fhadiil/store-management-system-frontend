import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      // Set the token in axios headers
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // Decode JWT to get user info (role is in the token)
      try {
        const parts = token.split(".");
        const payload = JSON.parse(atob(parts[1]));
        setUser({
          username: payload.username || "User",
          role: payload.role || "sales_person",
          store_id: payload.store_id,
          token,
        });
      } catch (err) {
        console.error("Failed to decode token:", err);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      setError(null);
      const response = await axios.post("http://127.0.0.1:8000/store/token/", {
        username,
        password,
      });

      const accessToken = response.data.access;
      const refreshToken = response.data.refresh;

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      // Decode JWT to get user info
      const parts = accessToken.split(".");
      const payload = JSON.parse(atob(parts[1]));

      const userData = {
        username: payload.username || username,
        role: payload.role || "sales_person",
        store_id: payload.store_id,
        token: accessToken,
      };

      setUser(userData);
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      return userData;
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail || "Login failed. Please try again.";
      setError(errorMessage);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isSalesPerson: user?.role === "sales_person",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
