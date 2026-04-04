import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-appbg">
      <div className="mx-auto flex max-w-[1600px]">
        <Sidebar />
        <div className="flex min-h-screen flex-1 flex-col">
          <Navbar />
          <main className="flex-1 p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
