import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { DashboardPage } from "../pages/DashboardPage";
import { VotingPage } from "../pages/VotingPage";
import { CandidatesPage } from "../pages/CandidatesPage";
import { ElectionManagementPage } from "../pages/ElectionManagementPage";
import { ResultsPage } from "../pages/ResultsPage";
import { AdminDashboardPage } from "../pages/AdminDashboardPage";
import { ProfilePage } from "../pages/ProfilePage";
import { CandidateManagementPage } from "../pages/CandidateManagementPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage mode="voter" />} />
      <Route path="/admin-login" element={<LoginPage mode="admin" />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/vote" element={<VotingPage />} />
          <Route path="/candidates" element={<CandidatesPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowRole="ADMIN" />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/candidates" element={<CandidateManagementPage />} />
          <Route path="/admin/elections" element={<ElectionManagementPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
