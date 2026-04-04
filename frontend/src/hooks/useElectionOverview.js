import { useQuery } from "@tanstack/react-query";
import { candidateService } from "../services/candidateService";
import { electionService } from "../services/electionService";
import { resultService } from "../services/resultService";

export function useElectionOverview() {
  const election = useQuery({ queryKey: ["current-election"], queryFn: electionService.current });
  const candidates = useQuery({ queryKey: ["candidates"], queryFn: candidateService.getAll });
  const results = useQuery({ queryKey: ["results"], queryFn: resultService.results });

  return {
    election,
    candidates,
    results,
    isLoading: election.isLoading || candidates.isLoading || results.isLoading,
  };
}
