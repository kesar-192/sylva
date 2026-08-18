import { createContext, useContext, useEffect, useState } from "react";
import axiosClient, { setAccessToken } from "../api/axiosClient.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check for an existing session

  // On first load, try to silently refresh using the httpOnly cookie.
  // This is what lets a user stay logged in after closing the tab.
  useEffect(() => {
    const bootstrapSession = async () => {
      try {
        const { data } = await axiosClient.post("/auth/refresh");
        setAccessToken(data.accessToken);
        const profileRes = await axiosClient.get("/auth/profile");
        setUser(profileRes.data.user);
      } catch (err) {
        setUser(null);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };
    bootstrapSession();
  }, []);

  const signup = async ({ name, email, password }) => {
    const { data } = await axiosClient.post("/auth/register", { name, email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const login = async ({ email, password }) => {
    const { data } = await axiosClient.post("/auth/login", { email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await axiosClient.post("/auth/logout");
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  const updateProfile = async (updates) => {
    const { data } = await axiosClient.patch("/auth/profile", updates);
    setUser(data.user);
    return data.user;
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
