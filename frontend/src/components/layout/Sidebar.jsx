import { BarChart3, Gauge, ShieldCheck, Users, Vote, Trophy, TimerReset } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext";

const voterLinks = [
  { to: "/dashboard", label: "Dashboard", icon: Gauge },
  { to: "/vote", label: "Vote", icon: Vote },
  { to: "/candidates", label: "Candidates", icon: Users },
  { to: "/results", label: "Results", icon: Trophy },
  { to: "/profile", label: "Profile", icon: ShieldCheck },
];

const adminLinks = [
  { to: "/admin", label: "Admin", icon: BarChart3 },
  { to: "/admin/candidates", label: "Candidates", icon: Users },
  { to: "/admin/elections", label: "Elections", icon: TimerReset },
  { to: "/results", label: "Results", icon: Trophy },
];

export function Sidebar() {
  const { isAdmin } = useAuth();
  const links = isAdmin ? adminLinks : voterLinks;

  return (
    <aside className="sticky top-0 hidden h-screen w-72 border-r border-slate-200 bg-white p-6 lg:block">
      <div className="mb-8 rounded-2xl bg-gradient-to-br from-primary to-secondary p-5 text-white shadow-lg">
        <p className="text-xs uppercase tracking-widest text-white/70">Smart Secure EVM</p>
        <h1 className="mt-2 text-xl font-bold">Election Command</h1>
      </div>
      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive ? "bg-primary text-white" : "text-secondary hover:bg-slate-100"
              }`
            }
          >
            <link.icon size={18} />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
