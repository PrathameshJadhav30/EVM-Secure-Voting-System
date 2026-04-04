import { apiClient, unwrap } from "./apiClient";

export const resultService = {
  results: async () => unwrap(await apiClient.get("/results")),
  winner: async () => unwrap(await apiClient.get("/results/winner")),
};
