import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Alert } from "../components/ui/Alert";

export function LoginPage({ mode = "voter" }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form, mode);
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-lg">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Smart Secure EVM</p>
        <h1 className="mt-2 text-2xl font-bold text-secondary">{mode === "admin" ? "Admin Login" : "Voter Login"}</h1>
        <p className="mt-1 text-sm text-slate-500">Access your secure election dashboard.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Input
            label="Email"
            type="email"
            required
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
          {error ? <Alert message={error} type="error" /> : null}
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in securely"}
          </Button>
        </form>
        <div className="mt-5 flex justify-between text-sm text-slate-500">
          {mode === "voter" ? <Link to="/register">Create voter account</Link> : <Link to="/login">Voter login</Link>}
          {mode === "voter" ? <Link to="/admin-login">Admin login</Link> : null}
        </div>
      </div>
    </div>
  );
}
