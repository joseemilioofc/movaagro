import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import CooperativeDashboard from "./pages/CooperativeDashboard";
import TransporterDashboard from "./pages/TransporterDashboard";
import FleetDashboard from "./pages/FleetDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSettings from "./pages/AdminSettings";
import AdminTransporterApprovals from "./pages/AdminTransporterApprovals";
import AuditLogs from "./pages/AuditLogs";
import ChatPage from "./pages/ChatPage";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Security from "./pages/Security";
import Contracts from "./pages/Contracts";
import Install from "./pages/Install";
import Ranking from "./pages/Ranking";
import AboutUs from "./pages/AboutUs";
import Company from "./pages/Company";
import Cookies from "./pages/Cookies";
import GPSConsent from "./pages/GPSConsent";
import IntermediationContract from "./pages/IntermediationContract";
import DataRetention from "./pages/DataRetention";
import AcceptableUse from "./pages/AcceptableUse";
import LegalContact from "./pages/LegalContact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <PWAInstallPrompt />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/home" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cooperative" element={<CooperativeDashboard />} />
            <Route path="/transporter" element={<TransporterDashboard />} />
            <Route path="/fleet" element={<FleetDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/transporter-approvals" element={<AdminTransporterApprovals />} />
            <Route path="/admin/audit" element={<AuditLogs />} />
            <Route path="/chat/:requestId" element={<ChatPage />} />
            <Route path="/contracts" element={<Contracts />} />
            <Route path="/install" element={<Install />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/security" element={<Security />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/company" element={<Company />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/gps-consent" element={<GPSConsent />} />
            <Route path="/intermediation" element={<IntermediationContract />} />
            <Route path="/data-retention" element={<DataRetention />} />
            <Route path="/acceptable-use" element={<AcceptableUse />} />
            <Route path="/legal-contact" element={<LegalContact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
