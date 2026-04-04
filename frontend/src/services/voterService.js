import { apiClient, unwrap } from "./apiClient";

export const voterService = {
  all: async () => unwrap(await apiClient.get("/voters")),
  byId: async (id) => unwrap(await apiClient.get(`/voters/${id}`)),
  update: async (id, payload) => unwrap(await apiClient.put(`/voters/${id}`, payload)),
  remove: async (id) => unwrap(await apiClient.delete(`/voters/${id}`)),
};
