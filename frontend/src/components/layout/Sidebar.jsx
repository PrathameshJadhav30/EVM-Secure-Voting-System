import { BarChart3, Gauge, ShieldCheck, Users, Vote, Trophy, TimerReset } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";

const voterLinks = [
  { to: "/dashboard", label: "Dashboard", icon: Gauge, end: true },
  { to: "/vote", label: "Vote", icon: Vote, end: true },
  { to: "/candidates", label: "Candidates", icon: Users, end: true },
  { to: "/results", label: "Results", icon: Trophy, end: true },
  { to: "/profile", label: "Profile", icon: ShieldCheck, end: true },
];

const adminLinks = [
  { to: "/admin", label: "Admin", icon: BarChart3, end: true },
  { to: "/admin/candidates", label: "Candidates", icon: Users, end: true },
  { to: "/admin/elections", label: "Elections", icon: TimerReset, end: true },
  { to: "/results", label: "Results", icon: Trophy, end: true },
];

export function Sidebar() {
  const { isAdmin } = useAuth();
  const links = isAdmin ? adminLinks : voterLinks;

  return (
    <aside className="sticky top-0 hidden h-screen w-72 border-r border-slate-200 bg-white p-6 lg:block">
      <div className="mb-8 rounded-2xl bg-gradient-to-br from-[#1E3A8A] to-[#334155] p-5 text-white shadow-lg">
        <p className="text-xs uppercase tracking-widest text-slate-200">Smart Secure EVM</p>
        <h1 className="mt-2 text-xl font-bold text-white">Election Command</h1>
      </div>
      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#1E3A8A] !text-slate-50 shadow-sm hover:!text-slate-50"
                  : "text-secondary hover:bg-slate-100 hover:text-slate-900"
              }`
            }
          >
            <link.icon size={18} className="shrink-0" />
            <span className="truncate">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
