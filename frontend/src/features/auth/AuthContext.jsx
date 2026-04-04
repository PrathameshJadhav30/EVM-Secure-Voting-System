import { createContext, useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authService } from "../../services/authService";

const TOKEN_KEY = "evm_token";
const USER_KEY = "evm_user";

const AuthContext = createContext(null);

const readStoredUser = () => {
  const userRaw = localStorage.getItem(USER_KEY);
  if (!userRaw) return null;
  try {
    return JSON.parse(userRaw);
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(readStoredUser);
  const navigate = useNavigate();

  const login = async (payload, mode = "voter") => {
    const data = mode === "admin" ? await authService.adminLogin(payload) : await authService.login(payload);
    const authUser = mode === "admin" ? { ...data.admin, role: "ADMIN" } : { ...data.voter, role: "VOTER" };

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(authUser));
    setToken(data.token);
    setUser(authUser);
    toast.success(mode === "admin" ? "Admin login successful" : "Welcome back");
    navigate(mode === "admin" ? "/admin" : "/dashboard");
  };

  const register = async (payload) => {
    const data = await authService.register(payload);
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify({ ...data.voter, role: "VOTER" }));
    setToken(data.token);
    setUser({ ...data.voter, role: "VOTER" });
    toast.success("Registration successful");
    navigate("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    toast.success("Logged out securely");
    navigate("/login");
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isAdmin: user?.role === "ADMIN",
      login,
      register,
      logout,
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

export const authStorage = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
};
