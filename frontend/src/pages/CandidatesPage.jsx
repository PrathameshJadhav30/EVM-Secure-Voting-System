import { useQuery } from "@tanstack/react-query";
import { candidateService } from "../services/candidateService";
import { Card } from "../components/ui/Card";
import { Loader } from "../components/ui/Loader";

export function CandidatesPage() {
  const { data, isLoading } = useQuery({ queryKey: ["candidates"], queryFn: candidateService.getAll });

  if (isLoading) return <Loader label="Loading candidates" />;

  return (
    <div className="page-shell">
      <Card title="Candidate Directory" subtitle="Public list of all participating candidates">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(data || []).map((candidate) => (
            <div key={candidate.id} className="rounded-xl border border-slate-200 p-4">
              <img
                src={candidate.symbolImage || "https://placehold.co/100x100?text=SYM"}
                alt={candidate.name}
                className="h-16 w-16 rounded-xl"
              />
              <h3 className="mt-3 text-lg font-semibold text-secondary">{candidate.name}</h3>
              <p className="text-sm text-slate-600">{candidate.party}</p>
              <p className="mt-2 text-sm text-slate-500">{candidate.description || "No description"}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
