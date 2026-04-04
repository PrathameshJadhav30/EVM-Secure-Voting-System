import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { adminService } from "../services/adminService";
import { voterService } from "../services/voterService";
import { Card } from "../components/ui/Card";
import { DataTable } from "../components/tables/DataTable";
import { Button } from "../components/ui/Button";
import { VoteBarChart } from "../components/charts/VoteBarChart";
import { VotePieChart } from "../components/charts/VotePieChart";
import { Modal } from "../components/ui/Modal";
import { Badge } from "../components/ui/Badge";
import { ConfirmModal } from "../components/ui/ConfirmModal";

export function AdminDashboardPage() {
  const queryClient = useQueryClient();
  const [selectedVoterId, setSelectedVoterId] = useState(null);
  const [voterToDelete, setVoterToDelete] = useState(null);

  const dashboardQuery = useQuery({ queryKey: ["admin-dashboard"], queryFn: adminService.dashboard });
  const votersQuery = useQuery({ queryKey: ["voters"], queryFn: voterService.all });
  const voterDetailQuery = useQuery({
    queryKey: ["voter", selectedVoterId],
    queryFn: () => voterService.byId(selectedVoterId),
    enabled: Boolean(selectedVoterId),
  });

  const deleteVoter = useMutation({
    mutationFn: voterService.remove,
    onSuccess: () => {
      toast.success("Voter removed");
      queryClient.invalidateQueries({ queryKey: ["voters"] });
      setVoterToDelete(null);
    },
  });

  const summary = dashboardQuery.data?.summary || {};

  const columns = [
    { key: "name", title: "Name" },
    { key: "voterId", title: "Voter ID" },
    { key: "email", title: "Email" },
    {
      key: "hasVoted",
      title: "Status",
      render: (row) => (row.hasVoted ? "Voted" : "Pending"),
    },
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setSelectedVoterId(row.id)}>
            View
          </Button>
          <Button variant="danger" onClick={() => setVoterToDelete(row)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const chartData = (dashboardQuery.data?.candidateStatistics || []).map((item) => ({
    candidateId: item.candidateId,
    candidateName: item.candidateName,
    votes: item.voteCount,
    percentage: summary.totalVotes ? Number(((item.voteCount / summary.totalVotes) * 100).toFixed(2)) : 0,
  }));

  return (
    <div className="page-shell">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card><p className="text-sm text-slate-500">Total Voters</p><p className="stat-number">{summary.totalVoters || 0}</p></Card>
        <Card><p className="text-sm text-slate-500">Total Votes</p><p className="stat-number">{summary.totalVotes || 0}</p></Card>
        <Card><p className="text-sm text-slate-500">Candidates</p><p className="stat-number">{summary.totalCandidates || 0}</p></Card>
        <Card>
          <p className="text-sm text-slate-500">Active Election</p>
          <p className="mt-2 text-base font-semibold text-secondary">{summary.activeElection?.electionName || "None"}</p>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Vote Distribution"><VoteBarChart data={chartData} /></Card>
        <Card title="Candidate Share"><VotePieChart data={chartData} /></Card>
      </div>

      <Card title="Voter Administration" subtitle="Complete registered voter records">
        <DataTable columns={columns} rows={votersQuery.data || []} emptyMessage="No voters found" />
      </Card>

      <Modal open={Boolean(selectedVoterId)} title="Voter Profile" onClose={() => setSelectedVoterId(null)}>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wider text-slate-500">Name</p>
            <p className="mt-1 font-semibold text-slate-800">{voterDetailQuery.data?.name || "N/A"}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wider text-slate-500">Voter ID</p>
            <p className="mt-1 font-semibold text-slate-800">{voterDetailQuery.data?.voterId || "N/A"}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 md:col-span-2">
            <p className="text-xs uppercase tracking-wider text-slate-500">Email</p>
            <p className="mt-1 font-semibold text-slate-800">{voterDetailQuery.data?.email || "N/A"}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wider text-slate-500">Age</p>
            <p className="mt-1 font-semibold text-slate-800">{voterDetailQuery.data?.age || "N/A"}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wider text-slate-500">Voting Status</p>
            <div className="mt-2">
              <Badge tone={voterDetailQuery.data?.hasVoted ? "success" : "warning"}>
                {voterDetailQuery.data?.hasVoted ? "Voted" : "Pending"}
              </Badge>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={Boolean(voterToDelete)}
        title="Delete Voter"
        description={`Delete voter ${voterToDelete?.name || ""}? This action cannot be undone.`}
        confirmLabel="Delete voter"
        loading={deleteVoter.isPending}
        onClose={() => setVoterToDelete(null)}
        onConfirm={() => deleteVoter.mutate(voterToDelete.id)}
      />
    </div>
  );
}
