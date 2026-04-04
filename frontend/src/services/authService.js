import { apiClient, unwrap } from "./apiClient";

export const authService = {
  register: async (payload) => unwrap(await apiClient.post("/auth/register", payload)),
  login: async (payload) => unwrap(await apiClient.post("/auth/login", payload)),
  adminLogin: async (payload) => unwrap(await apiClient.post("/auth/admin-login", payload)),
};
