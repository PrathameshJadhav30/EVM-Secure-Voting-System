import { useEffect, useMemo, useState } from "react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

const empty = { name: "", party: "", symbolImage: "", description: "" };

export function CandidateForm({ initialData, onSubmit, loading }) {
  const seed = useMemo(() => initialData || empty, [initialData]);
  const [form, setForm] = useState(seed);

  useEffect(() => {
    setForm(seed);
  }, [seed]);

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form);
      }}
    >
      <Input label="Name" required value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
      <Input label="Party" required value={form.party} onChange={(event) => setForm((prev) => ({ ...prev, party: event.target.value }))} />
      <Input
        label="Symbol image URL"
        value={form.symbolImage || ""}
        onChange={(event) => setForm((prev) => ({ ...prev, symbolImage: event.target.value }))}
      />
      {form.symbolImage ? (
        <img src={form.symbolImage} alt="symbol preview" className="h-20 w-20 rounded-lg border border-slate-200 object-cover" />
      ) : null}
      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Description</span>
        <textarea
          className="w-full rounded-xl border border-slate-300 p-3 text-sm"
          rows={4}
          value={form.description || ""}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
        />
      </label>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : "Save candidate"}
      </Button>
    </form>
  );
}
