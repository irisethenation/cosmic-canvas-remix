import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminRoutes from "./components/AdminRoutes";

const queryClient = new QueryClient();

const PublicRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => {
  const mode = import.meta.env.VITE_APP_MODE || 'public';
  const hostname = window.location.hostname;

  // Auto-redirect if user hits wrong subdomain
  if (hostname.startsWith('admin')) {
    if (mode !== 'admin') {
      window.location.href = 'https://course.irise.academy';
      return null;
    }
  } else {
    if (mode === 'admin') {
      window.location.href = 'https://admin.irise.academy';
      return null;
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {mode === 'admin' ? <AdminRoutes /> : <PublicRoutes />}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
