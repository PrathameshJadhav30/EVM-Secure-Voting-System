import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { candidateService } from "../services/candidateService";
import { voteService } from "../services/voteService";
import { electionService } from "../services/electionService";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Badge } from "../components/ui/Badge";
import { useAuth } from "../features/auth/AuthContext";

export function VotingPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [candidateId, setCandidateId] = useState(null);

  const candidatesQuery = useQuery({ queryKey: ["candidates"], queryFn: candidateService.getAll });
  const electionQuery = useQuery({ queryKey: ["current-election"], queryFn: electionService.current });

  const castVote = useMutation({
    mutationFn: voteService.castVote,
    onSuccess: () => {
      toast.success("Vote submitted securely");
      queryClient.invalidateQueries({ queryKey: ["results"] });
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      setCandidateId(null);
    },
  });

  const disabled = user?.hasVoted || castVote.isSuccess || electionQuery.data?.status !== "ACTIVE";

  return (
    <div className="page-shell">
      <Card title="Cast Your Vote" subtitle="One voter can cast exactly one vote in an active election.">
        <div className="mb-6 flex items-center gap-2">
          <span className="text-sm text-slate-600">Election status:</span>
          <Badge tone={electionQuery.data?.status === "ACTIVE" ? "success" : "warning"}>{electionQuery.data?.status || "N/A"}</Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(candidatesQuery.data || []).map((candidate) => (
            <article key={candidate.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <img
                  src={candidate.symbolImage || "https://placehold.co/64x64?text=SYM"}
                  alt={candidate.name}
                  className="h-14 w-14 rounded-xl object-cover"
                />
                <Badge>{candidate.party}</Badge>
              </div>
              <h3 className="text-lg font-semibold text-secondary">{candidate.name}</h3>
              <p className="mt-2 line-clamp-3 text-sm text-slate-500">{candidate.description || "No description provided"}</p>
              <Button className="mt-4 w-full" disabled={disabled} onClick={() => setCandidateId(candidate.id)}>
                Vote for {candidate.name}
              </Button>
            </article>
          ))}
        </div>
      </Card>

      <Modal open={Boolean(candidateId)} title="Confirm Vote" onClose={() => setCandidateId(null)}>
        <p className="text-sm text-slate-600">This action is irreversible. Confirm your vote submission?</p>
        <div className="mt-4 flex gap-3">
          <Button variant="secondary" onClick={() => setCandidateId(null)}>
            Cancel
          </Button>
          <Button variant="accent" onClick={() => castVote.mutate(candidateId)} disabled={castVote.isPending}>
            {castVote.isPending ? "Submitting..." : "Confirm vote"}
          </Button>
        </div>
      </Modal>

      {castVote.isSuccess ? (
        <Card>
          <p className="text-lg font-semibold text-accent">Your vote has been successfully secured and recorded.</p>
        </Card>
      ) : null}
    </div>
  );
}
