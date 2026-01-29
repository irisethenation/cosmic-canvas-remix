import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import CourseDetail from "./pages/CourseDetail";
import LessonPlayer from "./pages/LessonPlayer";
import Programs from "./pages/Programs";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Support from "./pages/Support";
import PaidCalls from "./pages/PaidCalls";
import Community from "./pages/Community";
import Newsletter from "./pages/Newsletter";
import Testimonials from "./pages/Testimonials";
import TestimonialDetail from "./pages/TestimonialDetail";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminCourseDetail from "./pages/admin/AdminCourseDetail";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminSubscriptions from "./pages/admin/AdminSubscriptions";
import AdminNotices from "./pages/admin/AdminNotices";
import AdminSupport from "./pages/admin/AdminSupport";
import AdminVapi from "./pages/admin/AdminVapi";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/programs" element={<Programs />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/support" element={<Support />} />
    <Route path="/community" element={<Community />} />
    <Route path="/newsletter" element={<Newsletter />} />
    <Route path="/testimonials" element={<Testimonials />} />
    <Route path="/testimonials/:slug" element={<TestimonialDetail />} />
    <Route 
      path="/dashboard" 
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/onboarding" 
      element={
        <ProtectedRoute>
          <Onboarding />
        </ProtectedRoute>
      } 
    />
    <Route path="/courses/:slug" element={<CourseDetail />} />
    <Route 
      path="/lessons/:lessonId" 
      element={
        <ProtectedRoute>
          <LessonPlayer />
        </ProtectedRoute>
      } 
    />
    {/* Admin Routes */}
    <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
    <Route path="/admin/courses" element={<AdminRoute><AdminCourses /></AdminRoute>} />
    <Route path="/admin/courses/:courseId" element={<AdminRoute><AdminCourseDetail /></AdminRoute>} />
    <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
    <Route path="/admin/subscriptions" element={<AdminRoute><AdminSubscriptions /></AdminRoute>} />
    <Route path="/admin/notices" element={<AdminRoute><AdminNotices /></AdminRoute>} />
    <Route path="/admin/support" element={<AdminRoute><AdminSupport /></AdminRoute>} />
    <Route path="/admin/vapi" element={<AdminRoute><AdminVapi /></AdminRoute>} />
    {/* Protected support routes */}
    <Route 
      path="/support/paid-calls" 
      element={
        <ProtectedRoute>
          <PaidCalls />
        </ProtectedRoute>
      } 
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
