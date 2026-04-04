import { apiClient, unwrap } from "./apiClient";

export const candidateService = {
  getAll: async () => unwrap(await apiClient.get("/candidates")),
  getById: async (id) => unwrap(await apiClient.get(`/candidates/${id}`)),
  create: async (payload) => unwrap(await apiClient.post("/candidates", payload)),
  update: async (id, payload) => unwrap(await apiClient.put(`/candidates/${id}`, payload)),
  remove: async (id) => unwrap(await apiClient.delete(`/candidates/${id}`)),
};
