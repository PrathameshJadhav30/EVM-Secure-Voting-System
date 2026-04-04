import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { candidateService } from "../services/candidateService";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Modal } from "../components/ui/Modal";
import { DataTable } from "../components/tables/DataTable";
import { CandidateForm } from "../components/forms/CandidateForm";
import { ConfirmModal } from "../components/ui/ConfirmModal";

export function CandidateManagementPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [pendingUpdatePayload, setPendingUpdatePayload] = useState(null);
  const [candidateToDelete, setCandidateToDelete] = useState(null);

  const candidatesQuery = useQuery({ queryKey: ["candidates"], queryFn: candidateService.getAll });
  const detailQuery = useQuery({
    queryKey: ["candidate", editingId],
    queryFn: () => candidateService.getById(editingId),
    enabled: Boolean(editingId),
  });

  const createMutation = useMutation({
    mutationFn: candidateService.create,
    onSuccess: () => {
      toast.success("Candidate created");
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      setOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => candidateService.update(id, payload),
    onSuccess: () => {
      toast.success("Candidate updated");
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      setPendingUpdatePayload(null);
      setOpen(false);
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: candidateService.remove,
    onSuccess: () => {
      toast.success("Candidate deleted");
      queryClient.invalidateQueries({ queryKey: ["candidates"] });
      setCandidateToDelete(null);
    },
  });

  const columns = [
    { key: "name", title: "Name" },
    { key: "party", title: "Party" },
    {
      key: "symbolImage",
      title: "Symbol",
      render: (row) => <img src={row.symbolImage || "https://placehold.co/50x50?text=SYM"} alt={row.name} className="h-10 w-10 rounded" />,
    },
    {
      key: "actions",
      title: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              setEditingId(row.id);
              setOpen(true);
            }}
          >
            Edit
          </Button>
          <Button variant="danger" onClick={() => setCandidateToDelete(row)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="page-shell">
      <Card title="Candidate Management" subtitle="Create and maintain candidate records">
        <div className="mb-4 flex justify-end">
          <Button
            onClick={() => {
              setEditingId(null);
              setOpen(true);
            }}
          >
            Add candidate
          </Button>
        </div>
        <DataTable columns={columns} rows={candidatesQuery.data || []} emptyMessage="No candidates yet" />
      </Card>

      <Modal open={open} title={editingId ? "Edit Candidate" : "Add Candidate"} onClose={() => setOpen(false)}>
        <CandidateForm
          initialData={detailQuery.data}
          loading={createMutation.isPending || updateMutation.isPending}
          onSubmit={(payload) => {
            if (editingId) {
              setOpen(false);
              setPendingUpdatePayload(payload);
              return;
            }
            createMutation.mutate(payload);
          }}
        />
      </Modal>

      <ConfirmModal
        open={Boolean(pendingUpdatePayload && editingId)}
        title="Update Candidate"
        description={`Apply updates for ${detailQuery.data?.name || "this candidate"}?`}
        confirmLabel="Update candidate"
        confirmVariant="accent"
        loading={updateMutation.isPending}
        onClose={() => setPendingUpdatePayload(null)}
        onConfirm={() => updateMutation.mutate({ id: editingId, payload: pendingUpdatePayload })}
      />

      <ConfirmModal
        open={Boolean(candidateToDelete)}
        title="Delete Candidate"
        description={`Delete candidate ${candidateToDelete?.name || ""}? This cannot be undone.`}
        confirmLabel="Delete candidate"
        loading={deleteMutation.isPending}
        onClose={() => setCandidateToDelete(null)}
        onConfirm={() => deleteMutation.mutate(candidateToDelete.id)}
      />
    </div>
  );
}
