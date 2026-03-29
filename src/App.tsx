import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SimulationProvider } from "@/context/SimulationContext";
import { IntegrationProvider } from "@/context/IntegrationContext";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Product from "./pages/Product";
import HowItWorks from "./pages/HowItWorks";
import Features from "./pages/Features";
import DashboardDemo from "./pages/DashboardDemo";
import Simulate from "./pages/Simulate";
import Integrations from "./pages/Integrations";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CompanyLogin from "./pages/CompanyLogin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <IntegrationProvider>
          <SimulationProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<CompanyLogin />} />
                <Route path="/product" element={<Product />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/features" element={<Features />} />
                <Route path="/dashboard-demo" element={<DashboardDemo />} />
                <Route path="/simulate" element={<ProtectedRoute><Simulate /></ProtectedRoute>} />
                <Route path="/integrations" element={<ProtectedRoute><Integrations /></ProtectedRoute>} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </SimulationProvider>
        </IntegrationProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
