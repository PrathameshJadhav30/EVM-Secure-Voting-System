import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Alert } from "../components/ui/Alert";

export function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", voterId: "", age: "18" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register({ ...form, age: Number(form.age) });
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-7 shadow-lg">
        <h1 className="text-2xl font-bold text-secondary">Voter Registration</h1>
        <p className="mt-1 text-sm text-slate-500">Create your verified profile to participate in elections.</p>

        <form onSubmit={submit} className="mt-6 grid gap-4 md:grid-cols-2">
          <Input label="Full name" required value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
          <Input label="Voter ID" required value={form.voterId} onChange={(event) => setForm((prev) => ({ ...prev, voterId: event.target.value }))} />
          <Input
            label="Email"
            type="email"
            required
            className="md:col-span-2"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          />
          <Input
            label="Password"
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          />
          <Input
            label="Age"
            type="number"
            min={18}
            required
            value={form.age}
            onChange={(event) => setForm((prev) => ({ ...prev, age: event.target.value }))}
          />
          <div className="md:col-span-2">
            {error ? <Alert type="error" message={error} /> : null}
          </div>
          <div className="md:col-span-2">
            <Button className="w-full" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Register securely"}
            </Button>
          </div>
        </form>

        <p className="mt-5 text-sm text-slate-500">
          Already registered? <Link to="/login" className="text-primary">Login</Link>
        </p>
      </div>
    </div>
  );
}
