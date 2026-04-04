import { apiClient, unwrap } from "./apiClient";

export const adminService = {
  dashboard: async () => unwrap(await apiClient.get("/admin/dashboard")),
  startElection: async (electionId) => unwrap(await apiClient.put("/admin/election/start", { electionId })),
  endElection: async (electionId) => unwrap(await apiClient.put("/admin/election/end", { electionId })),
};
