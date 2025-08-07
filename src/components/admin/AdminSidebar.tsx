import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  BookOpen, 
  Layers, 
  FileText, 
  Upload, 
  Users, 
  Mail, 
  Brain,
  LogOut
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";

const items = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Courses", url: "/courses", icon: BookOpen },
  { title: "Media Library", url: "/media", icon: Upload },
  { title: "User Analytics", url: "/users", icon: Users },
  { title: "Email Campaigns", url: "/email", icon: Mail },
  { title: "AI Knowledge Base", url: "/ai-kb", icon: Brain },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { signOut } = useAuth();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-slate-700 text-white font-medium border-l-2 border-blue-400" : "hover:bg-slate-800/50 text-slate-300";

  return (
    <Sidebar className={`${collapsed ? "w-14" : "w-60"} bg-slate-950 border-slate-700`} collapsible="icon">
      <SidebarHeader className="p-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/5b04634a-8b34-4b3f-b5d4-9ca573b411f1.png" 
            alt="IRISE Academy" 
            className="h-8 w-8"
          />
          {!collapsed && (
            <span className="font-semibold text-lg text-white">Admin Panel</span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-slate-950">
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400 text-xs uppercase tracking-wider">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span className="text-sm">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-slate-700 bg-slate-950">
        <SidebarMenuButton onClick={signOut} className="w-full text-slate-300 hover:bg-slate-800/50 hover:text-white">
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Sign Out</span>}
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}