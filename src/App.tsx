import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import StoryEditor from "./pages/StoryEditor";
import CategoryManagement from "./pages/CategoryManagement";
import GlobalSettings from "./pages/GlobalSettings";
import StoryPage from "./pages/StoryPage";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Disclaimer from "./pages/Disclaimer";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ApplyForJob from "./pages/ApplyForJob";
import CorrectionPolicy from "./pages/CorrectionPolicy";
import DNPACodeOfEthics from "./pages/DNPACodeOfEthics";
import FactCheckingPolicy from "./pages/FactCheckingPolicy";
import AdminStories from "./pages/AdminStories";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="webstory-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/apply-for-job" element={<ApplyForJob />} />
            <Route path="/correction-policy" element={<CorrectionPolicy />} />
            <Route path="/dnpa-code-of-ethics" element={<DNPACodeOfEthics />} />
            <Route path="/fact-checking-policy" element={<FactCheckingPolicy />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/story/new" element={<StoryEditor />} />
            <Route path="/admin/story/edit/:id" element={<StoryEditor />} />
            <Route path="/admin/categories" element={<CategoryManagement />} />
            <Route path="/admin/settings" element={<GlobalSettings />} />
            <Route path="/admin/stories" element={<AdminStories />} />
            <Route path="/story/:slug" element={<StoryPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
