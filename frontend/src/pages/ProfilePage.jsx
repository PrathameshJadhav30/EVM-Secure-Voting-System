import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { voterService } from "../services/voterService";
import { useAuth } from "../features/auth/AuthContext";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export function ProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const profileQuery = useQuery({ queryKey: ["profile", user?.id], queryFn: () => voterService.byId(user.id), enabled: Boolean(user?.id) });

  const [form, setForm] = useState({ name: "", age: "", password: "" });

  const updateMutation = useMutation({
    mutationFn: (payload) => voterService.update(user.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
    },
  });

  const profile = profileQuery.data;

  return (
    <div className="page-shell">
      <Card title="My Profile" subtitle="Manage voter profile and password">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Name</p>
            <p className="font-semibold text-secondary">{profile?.name}</p>
            <p className="mt-3 text-sm text-slate-500">Voter ID</p>
            <p className="font-semibold text-secondary">{profile?.voterId}</p>
            <p className="mt-3 text-sm text-slate-500">Email</p>
            <p className="font-semibold text-secondary">{profile?.email}</p>
          </div>
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              const payload = {};
              if (form.name) payload.name = form.name;
              if (form.age) payload.age = Number(form.age);
              if (form.password) payload.password = form.password;
              updateMutation.mutate(payload);
            }}
          >
            <Input label="Update name" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
            <Input label="Update age" type="number" min={18} value={form.age} onChange={(event) => setForm((prev) => ({ ...prev, age: event.target.value }))} />
            <Input
              label="New password"
              type="password"
              minLength={8}
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            />
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Update profile"}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
