import { Bell, LogOut, UserCircle2 } from "lucide-react";
import { useAuth } from "../../features/auth/AuthContext";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur md:px-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Smart Secure EVM</p>
          <h2 className="text-xl font-semibold text-secondary">Election Command</h2>
          <p className="text-sm text-slate-500">Welcome, {user?.name}</p>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <button className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100" aria-label="notifications">
            <Bell size={18} />
          </button>
          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 md:flex">
            <UserCircle2 size={16} className="text-slate-500" />
            <span className="text-sm font-medium text-slate-600">{user?.role}</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
