import { apiClient, unwrap } from "./apiClient";

export const voteService = {
  castVote: async (candidateId) => unwrap(await apiClient.post("/vote", { candidateId })),
};
