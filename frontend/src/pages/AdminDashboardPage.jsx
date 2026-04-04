import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService } from "../services/adminService";
import { voterService } from "../services/voterService";
import { Card } from "../components/ui/Card";
import { DataTable } from "../components/tables/DataTable";
import { Button } from "../components/ui/Button";
import { VoteBarChart } from "../components/charts/VoteBarChart";
import { VotePieChart } from "../components/charts/VotePieChart";
import { Modal } from "../components/ui/Modal";

export function AdminDashboardPage() {
  const queryClient = useQueryClient();
  const [selectedVoterId, setSelectedVoterId] = useState(null);

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
      queryClient.invalidateQueries({ queryKey: ["voters"] });
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
          <Button variant="danger" onClick={() => deleteVoter.mutate(row.id)}>
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
        <pre className="max-h-72 overflow-auto rounded-xl bg-slate-100 p-3 text-xs text-slate-700">
          {JSON.stringify(voterDetailQuery.data, null, 2)}
        </pre>
      </Modal>
    </div>
  );
}
