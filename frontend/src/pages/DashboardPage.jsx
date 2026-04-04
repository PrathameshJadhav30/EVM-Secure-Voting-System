import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { Card } from "../components/ui/Card";
import { Skeleton } from "../components/ui/Skeleton";
import { Badge } from "../components/ui/Badge";
import { useElectionOverview } from "../hooks/useElectionOverview";
import { statusTone } from "../utils/format";

const COLORS = ["#1E3A8A", "#10B981", "#334155", "#0EA5E9", "#F59E0B"];

export function DashboardPage() {
  const { election, candidates, results, isLoading } = useElectionOverview();

  if (isLoading) {
    return (
      <div className="page-shell">
        <Skeleton className="h-20" />
        <Skeleton className="h-56" />
      </div>
    );
  }

  const summary = [
    { label: "Total voters", value: results.data?.totalVotes ?? 0 },
    { label: "Votes cast", value: results.data?.totalVotes ?? 0 },
    { label: "Candidates", value: candidates.data?.length ?? 0 },
  ];

  return (
    <div className="page-shell">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summary.map((item) => (
          <Card key={item.label}>
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="stat-number mt-2">{item.value}</p>
          </Card>
        ))}
        <Card>
          <p className="text-sm text-slate-500">Current election</p>
          <p className="mt-2 text-lg font-bold text-secondary">{election.data?.electionName || "No election"}</p>
          <div className="mt-3">
            <Badge tone={statusTone(election.data?.status)}>{election.data?.status || "UNKNOWN"}</Badge>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Voting Distribution" subtitle="Candidate vote share">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={results.data?.results || []} dataKey="votes" nameKey="candidateName" outerRadius={100} label>
                {(results.data?.results || []).map((entry, index) => (
                  <Cell key={entry.candidateId} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card title="Participation" subtitle="Live election turnout">
          <div className="space-y-3">
            {(results.data?.results || []).map((item) => (
              <div key={item.candidateId}>
                <div className="mb-1 flex justify-between text-sm text-slate-600">
                  <span>{item.candidateName}</span>
                  <span>{item.percentage}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
