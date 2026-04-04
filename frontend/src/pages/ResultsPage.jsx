import { useQuery } from "@tanstack/react-query";
import { resultService } from "../services/resultService";
import { Card } from "../components/ui/Card";
import { VoteBarChart } from "../components/charts/VoteBarChart";
import { VotePieChart } from "../components/charts/VotePieChart";
import { Loader } from "../components/ui/Loader";
import { Badge } from "../components/ui/Badge";

export function ResultsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["results"], queryFn: resultService.results });
  const winnerQuery = useQuery({ queryKey: ["winner"], queryFn: resultService.winner });

  if (isLoading) return <Loader label="Loading election results" />;

  return (
    <div className="page-shell">
      <Card title="Election Results" subtitle={data?.election?.electionName}>
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <Badge tone="info">Total votes: {data?.totalVotes || 0}</Badge>
          <Badge tone="success">Winner: {winnerQuery.data?.winner?.candidateName || "Pending"}</Badge>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Votes per candidate">
            <VoteBarChart data={data?.results || []} />
          </Card>
          <Card title="Vote percentage">
            <VotePieChart data={data?.results || []} />
          </Card>
        </div>
      </Card>

      <Card title="Candidate Ranking">
        <ol className="space-y-3">
          {(data?.results || []).map((item, index) => (
            <li key={item.candidateId} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
              <span className="font-medium text-secondary">
                #{index + 1} {item.candidateName} ({item.party})
              </span>
              <span className="text-sm text-slate-600">
                {item.votes} votes ({item.percentage}%)
              </span>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}
