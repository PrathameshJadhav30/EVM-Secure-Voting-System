import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

export function ProtectedRoute({ allowRole }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowRole && user?.role !== allowRole) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
