import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Settings, Loader2, Bell, History, Target, Mail, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { KPIGoalsSettings } from "@/components/admin/KPIGoalsSettings";
import { useToast } from "@/hooks/use-toast";

interface AlertHistory {
  id: string;
  alert_type: string;
  kpi_names: string[];
  recipients: string[];
  details: any;
  sent_at: string;
}

interface KPIGoal {
  id: string;
  name: string;
  target_value: number;
  unit: string;
  description: string | null;
}

interface KPIAlert {
  id: string;
  kpi_name: string;
  email_alert: boolean;
  threshold_percentage: number;
  last_alert_sent_at: string | null;
}

const kpiLabels: Record<string, string> = {
  new_users: "Novos Usuários",
  monthly_requests: "Pedidos do Mês",
  conversion_rate: "Taxa de Conversão",
  monthly_revenue: "Receita Mensal",
};

const AdminSettings = () => {
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [alertHistory, setAlertHistory] = useState<AlertHistory[]>([]);
  const [goals, setGoals] = useState<KPIGoal[]>([]);
  const [alerts, setAlerts] = useState<KPIAlert[]>([]);
  const [sendingTestAlert, setSendingTestAlert] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || role !== "admin")) {
      navigate("/auth?admin=true");
    }
  }, [user, role, authLoading, navigate]);

  useEffect(() => {
    if (user && role === "admin") {
      fetchData();
    }
  }, [user, role]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [historyRes, goalsRes, alertsRes] = await Promise.all([
        supabase
          .from("alert_history")
          .select("*")
          .order("sent_at", { ascending: false })
          .limit(50),
        supabase.from("kpi_goals").select("*"),
        supabase.from("kpi_alerts").select("*"),
      ]);

      if (historyRes.error) throw historyRes.error;
      if (goalsRes.error) throw goalsRes.error;
      if (alertsRes.error) throw alertsRes.error;

      setAlertHistory(historyRes.data || []);
      setGoals(goalsRes.data || []);
      setAlerts(alertsRes.data || []);
    } catch (error) {
      console.error("Error fetching settings data:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendTestAlert = async () => {
    setSendingTestAlert(true);
    try {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("email")
        .eq("user_id", user?.id)
        .single();

      if (!profileData?.email) {
        throw new Error("Email não encontrado");
      }

      const testKpiData = goals.map((goal) => ({
        name: goal.name,
        current: Math.floor(goal.target_value * 0.3), // 30% of target for test
        target: goal.target_value,
        unit: goal.unit,
        percentage: 30,
      }));

      const { error } = await supabase.functions.invoke("check-kpi-alerts", {
        body: {
          kpiData: testKpiData,
          adminEmails: [profileData.email],
          forceAlert: true,
        },
      });

      if (error) throw error;

      toast({
        title: "Email de teste enviado",
        description: `Alerta enviado para ${profileData.email}`,
      });

      // Refresh history
      fetchData();
    } catch (error: any) {
      console.error("Error sending test alert:", error);
      toast({
        title: "Erro ao enviar teste",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSendingTestAlert(false);
    }
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Configurações</h1>
            <p className="text-muted-foreground">Gerencie as configurações do sistema</p>
          </div>
        </div>

        <Tabs defaultValue="kpis">
          <TabsList>
            <TabsTrigger value="kpis" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Metas e KPIs
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Alertas
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Histórico
            </TabsTrigger>
          </TabsList>

          {/* KPIs Tab */}
          <TabsContent value="kpis" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Metas Mensais</CardTitle>
                    <CardDescription>Configure as metas de desempenho</CardDescription>
                  </div>
                  <KPIGoalsSettings onUpdate={fetchData} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {goals.map((goal) => (
                    <div key={goal.id} className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{kpiLabels[goal.name] || goal.name}</span>
                        <Badge variant="secondary">
                          {goal.target_value.toLocaleString("pt-MZ")} {goal.unit}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Configuração de Alertas</CardTitle>
                    <CardDescription>Configure quando receber alertas por email</CardDescription>
                  </div>
                  <Button onClick={sendTestAlert} disabled={sendingTestAlert} variant="outline">
                    {sendingTestAlert ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Mail className="w-4 h-4 mr-2" />
                    )}
                    Enviar Alerta de Teste
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>KPI</TableHead>
                      <TableHead>Alertas Ativos</TableHead>
                      <TableHead>Limite</TableHead>
                      <TableHead>Último Alerta</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell className="font-medium">
                          {kpiLabels[alert.kpi_name] || alert.kpi_name}
                        </TableCell>
                        <TableCell>
                          <Badge variant={alert.email_alert ? "default" : "secondary"}>
                            {alert.email_alert ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell>{alert.threshold_percentage}% da meta</TableCell>
                        <TableCell>
                          {alert.last_alert_sent_at
                            ? format(new Date(alert.last_alert_sent_at), "dd/MM/yyyy HH:mm", { locale: ptBR })
                            : "Nunca"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Histórico de Alertas</CardTitle>
                    <CardDescription>Alertas enviados nos últimos 30 dias</CardDescription>
                  </div>
                  <Button onClick={fetchData} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Atualizar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {alertHistory.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Nenhum alerta enviado ainda.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data/Hora</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>KPIs</TableHead>
                        <TableHead>Destinatários</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {alertHistory.map((alert) => (
                        <TableRow key={alert.id}>
                          <TableCell className="whitespace-nowrap">
                            {format(new Date(alert.sent_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{alert.alert_type}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {alert.kpi_names.map((name, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {kpiLabels[name] || name}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {alert.recipients.join(", ")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AdminSettings;
