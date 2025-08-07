import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";

export function AdminHeader() {
  const { user } = useAuth();

  return (
    <header className="h-16 flex items-center justify-between border-b border-slate-700 bg-slate-900 px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-white hover:bg-slate-700" />
        <h1 className="text-xl font-semibold text-white">IRISE Academy Admin</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-300">
          Welcome, {user?.email}
        </span>
      </div>
    </header>
  );
}