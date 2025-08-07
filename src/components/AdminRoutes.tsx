import { Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import Dashboard from "@/pages/admin/Dashboard";
import CourseCrud from "@/pages/admin/CourseCrud";
import ModuleCrud from "@/pages/admin/ModuleCrud";
import LessonCrud from "@/pages/admin/LessonCrud";
import MediaLibrary from "@/pages/admin/MediaLibrary";
import UserAnalytics from "@/pages/admin/UserAnalytics";
import BrevoCampaigns from "@/pages/admin/BrevoCampaigns";
import AiKnowledgeBase from "@/pages/admin/AiKnowledgeBase";

const AdminRoutes = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/courses" element={<CourseCrud />} />
              <Route path="/modules/:courseId" element={<ModuleCrud />} />
              <Route path="/lessons/:moduleId" element={<LessonCrud />} />
              <Route path="/media" element={<MediaLibrary />} />
              <Route path="/users" element={<UserAnalytics />} />
              <Route path="/email" element={<BrevoCampaigns />} />
              <Route path="/ai-kb" element={<AiKnowledgeBase />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminRoutes;