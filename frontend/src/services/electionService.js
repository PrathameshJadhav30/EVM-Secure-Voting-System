import { apiClient, unwrap } from "./apiClient";

export const electionService = {
  current: async () => unwrap(await apiClient.get("/elections/current")),
  create: async (payload) => unwrap(await apiClient.post("/elections", payload)),
  start: async (electionId) => unwrap(await apiClient.put("/elections/start", { electionId })),
  end: async (electionId) => unwrap(await apiClient.put("/elections/end", { electionId })),
};
