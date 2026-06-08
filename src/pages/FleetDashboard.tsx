import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Package, Truck, Users, BarChart3, Building2 } from "lucide-react";
import { useTransporterProfile } from "@/hooks/useTransporterProfile";
import { TransporterApprovalForm } from "@/components/TransporterApprovalForm";
import { FleetVehiclesManager } from "@/components/fleet/FleetVehiclesManager";
import { FleetDriversManager } from "@/components/fleet/FleetDriversManager";
import { FleetKPIs } from "@/components/fleet/FleetKPIs";
import TransporterDashboard from "./TransporterDashboard";

const FleetDashboard = () => {
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { profile, loading } = useTransporterProfile();

  useEffect(() => {
    if (!authLoading && (!user || role !== "transporter")) navigate("/auth");
  }, [user, role, authLoading, navigate]);

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  // If user is not a fleet company, fall back to individual dashboard
  if (!profile?.is_company) {
    return <TransporterDashboard />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold">
              {profile.company_name || "Empresa de Transporte"}
            </h1>
            <p className="text-sm text-muted-foreground">Painel de Gestão de Frota</p>
          </div>
        </div>

        <TransporterApprovalForm />

        {profile.approval_status === "approved" && (
          <Tabs defaultValue="requests" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="requests"><Package className="w-4 h-4 mr-1 hidden sm:inline" /> Pedidos</TabsTrigger>
              <TabsTrigger value="vehicles"><Truck className="w-4 h-4 mr-1 hidden sm:inline" /> Viaturas</TabsTrigger>
              <TabsTrigger value="drivers"><Users className="w-4 h-4 mr-1 hidden sm:inline" /> Motoristas</TabsTrigger>
              <TabsTrigger value="kpis"><BarChart3 className="w-4 h-4 mr-1 hidden sm:inline" /> KPIs</TabsTrigger>
            </TabsList>
            <TabsContent value="requests">
              <TransporterDashboard embedded />
            </TabsContent>
            <TabsContent value="vehicles">
              <FleetVehiclesManager />
            </TabsContent>
            <TabsContent value="drivers">
              <FleetDriversManager />
            </TabsContent>
            <TabsContent value="kpis">
              <FleetKPIs />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FleetDashboard;
