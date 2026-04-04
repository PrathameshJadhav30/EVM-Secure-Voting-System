import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { electionService } from "../services/electionService";
import { adminService } from "../services/adminService";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
import { Dropdown } from "../components/ui/Dropdown";
import { ConfirmModal } from "../components/ui/ConfirmModal";
import { statusTone } from "../utils/format";

export function ElectionManagementPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ electionName: "", startDate: "", endDate: "" });
  const [controlApi, setControlApi] = useState("admin");
  const [pendingAction, setPendingAction] = useState(null);

  const electionQuery = useQuery({ queryKey: ["current-election"], queryFn: electionService.current });

  const createMutation = useMutation({
    mutationFn: electionService.create,
    onSuccess: () => {
      toast.success("Election created");
      queryClient.invalidateQueries({ queryKey: ["current-election"] });
      setForm({ electionName: "", startDate: "", endDate: "" });
    },
  });

  const startMutation = useMutation({
    mutationFn: (electionId) =>
      controlApi === "admin" ? adminService.startElection(electionId) : electionService.start(electionId),
    onSuccess: () => {
      toast.success("Election started");
      queryClient.invalidateQueries({ queryKey: ["current-election"] });
    },
  });

  const endMutation = useMutation({
    mutationFn: (electionId) =>
      controlApi === "admin" ? adminService.endElection(electionId) : electionService.end(electionId),
    onSuccess: () => {
      toast.success("Election ended");
      queryClient.invalidateQueries({ queryKey: ["current-election"] });
    },
  });

  return (
    <div className="page-shell">
      <Card title="Election Timeline" subtitle="Create and control election lifecycle">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">Current election</p>
              <h3 className="text-xl font-semibold text-secondary">{electionQuery.data?.electionName || "No election"}</h3>
            </div>
            <Badge tone={statusTone(electionQuery.data?.status)}>{electionQuery.data?.status || "N/A"}</Badge>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="min-w-60">
              <Dropdown
                label="Lifecycle API"
                value={controlApi}
                onChange={setControlApi}
                options={[
                  { value: "admin", label: "Admin API (/admin/election/*)" },
                  { value: "election", label: "Election API (/elections/*)" },
                ]}
              />
            </div>
            <Button onClick={() => setPendingAction("start")} disabled={!electionQuery.data?.id || startMutation.isPending}>
              Start election
            </Button>
            <Button
              variant="danger"
              onClick={() => setPendingAction("end")}
              disabled={!electionQuery.data?.id || endMutation.isPending}
            >
              End election
            </Button>
          </div>
        </div>
      </Card>

      <Card title="Create New Election">
        <form
          className="grid gap-4 md:grid-cols-3"
          onSubmit={(event) => {
            event.preventDefault();
            createMutation.mutate(form);
          }}
        >
          <Input
            label="Election name"
            required
            value={form.electionName}
            onChange={(event) => setForm((prev) => ({ ...prev, electionName: event.target.value }))}
          />
          <Input
            label="Start date"
            type="datetime-local"
            required
            value={form.startDate}
            onChange={(event) => setForm((prev) => ({ ...prev, startDate: event.target.value }))}
          />
          <Input
            label="End date"
            type="datetime-local"
            required
            value={form.endDate}
            onChange={(event) => setForm((prev) => ({ ...prev, endDate: event.target.value }))}
          />
          <div className="md:col-span-3">
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create election"}
            </Button>
          </div>
        </form>
      </Card>

      <ConfirmModal
        open={pendingAction === "start"}
        title="Start Election"
        description="Start this election now? Voting will be enabled for eligible voters."
        confirmLabel="Start now"
        confirmVariant="accent"
        loading={startMutation.isPending}
        onClose={() => setPendingAction(null)}
        onConfirm={() => startMutation.mutate(electionQuery.data?.id)}
      />

      <ConfirmModal
        open={pendingAction === "end"}
        title="End Election"
        description="End this election now? This action will stop all new votes."
        confirmLabel="End election"
        loading={endMutation.isPending}
        onClose={() => setPendingAction(null)}
        onConfirm={() => endMutation.mutate(electionQuery.data?.id)}
      />
    </div>
  );
}
