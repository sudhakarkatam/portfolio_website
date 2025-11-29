import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Portfolio from "./pages/Portfolio";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import GuestbookManager from "./pages/admin/GuestbookManager";
import ProjectsManager from "./pages/admin/ProjectsManager";
import SkillsManager from "./pages/admin/SkillsManager";
import MessagesManager from "./pages/admin/MessagesManager";
import ChatLogs from "./pages/admin/ChatLogs";
import Settings from "./pages/admin/Settings";
import CustomImagesManager from "./pages/admin/CustomImagesManager";
import ExperienceManager from "./pages/admin/ExperienceManager";
import PersonalTraitsManager from "./pages/admin/PersonalTraitsManager";
import ContactInfoManager from "./pages/admin/ContactInfoManager";
import ModelContexts from "./pages/admin/ModelContexts";

// Import platform test utilities in development


const queryClient = new QueryClient();

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/portfolio" element={<Portfolio />} />

          {/* Admin Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="guestbook" element={<GuestbookManager />} />
            <Route path="projects" element={<ProjectsManager />} />
            <Route path="experience" element={<ExperienceManager />} />
            <Route path="skills" element={<SkillsManager />} />
            <Route path="traits" element={<PersonalTraitsManager />} />
            <Route path="contact" element={<ContactInfoManager />} />
            <Route path="messages" element={<MessagesManager />} />
            <Route path="chat-logs" element={<ChatLogs />} />
            <Route path="custom-images" element={<CustomImagesManager />} />
            <Route path="settings" element={<Settings />} />
            <Route path="model-contexts" element={<ModelContexts />} />
          </Route>

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Analytics />
      <SpeedInsights />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
