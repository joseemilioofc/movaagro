import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Settings, Loader2, Target, Bell } from "lucide-react";
import { logAuditAction } from "@/hooks/useAuditLog";

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
}

const kpiLabels: Record<string, string> = {
  new_users: "Novos Usuários",
  monthly_requests: "Pedidos do Mês",
  conversion_rate: "Taxa de Conversão",
  monthly_revenue: "Receita Mensal",
};

export const KPIGoalsSettings = ({ onUpdate }: { onUpdate: () => void }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [goals, setGoals] = useState<KPIGoal[]>([]);
  const [alerts, setAlerts] = useState<KPIAlert[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchSettings();
    }
  }, [open]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const [goalsRes, alertsRes] = await Promise.all([
        supabase.from("kpi_goals").select("*"),
        supabase.from("kpi_alerts").select("*"),
      ]);

      if (goalsRes.error) throw goalsRes.error;
      if (alertsRes.error) throw alertsRes.error;

      setGoals(goalsRes.data || []);
      setAlerts(alertsRes.data || []);
    } catch (error) {
      console.error("Error fetching KPI settings:", error);
      toast({
        title: "Erro",
        description: "Erro ao carregar configurações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoalChange = (name: string, value: number) => {
    setGoals((prev) =>
      prev.map((g) => (g.name === name ? { ...g, target_value: value } : g))
    );
  };

  const handleAlertChange = (kpiName: string, field: "email_alert" | "threshold_percentage", value: boolean | number) => {
    setAlerts((prev) =>
      prev.map((a) => (a.kpi_name === kpiName ? { ...a, [field]: value } : a))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update goals
      for (const goal of goals) {
        const { error } = await supabase
          .from("kpi_goals")
          .update({ target_value: goal.target_value, updated_at: new Date().toISOString() })
          .eq("name", goal.name);
        if (error) throw error;
      }

      // Update alerts
      for (const alert of alerts) {
        const { error } = await supabase
          .from("kpi_alerts")
          .update({
            email_alert: alert.email_alert,
            threshold_percentage: alert.threshold_percentage,
            updated_at: new Date().toISOString(),
          })
          .eq("kpi_name", alert.kpi_name);
        if (error) throw error;
      }

      await logAuditAction({
        action: "update",
        entityType: "kpi_settings",
        details: { goals, alerts },
      });

      toast({
        title: "Configurações salvas",
        description: "As metas e alertas foram atualizados com sucesso.",
      });

      onUpdate();
      setOpen(false);
    } catch (error: any) {
      console.error("Error saving KPI settings:", error);
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Configurar Metas
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Configurar Metas e Alertas
          </DialogTitle>
          <DialogDescription>
            Defina as metas mensais e configure alertas por email.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Goals Section */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Target className="w-4 h-4" />
                Metas Mensais
              </h3>
              {goals.map((goal) => (
                <div key={goal.id} className="grid grid-cols-2 gap-4 items-center p-3 bg-muted/30 rounded-lg">
                  <div>
                    <Label className="font-medium">{kpiLabels[goal.name] || goal.name}</Label>
                    <p className="text-xs text-muted-foreground">{goal.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={goal.target_value}
                      onChange={(e) => handleGoalChange(goal.name, Number(e.target.value))}
                      className="w-full"
                    />
                    <span className="text-sm text-muted-foreground whitespace-nowrap">{goal.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Alerts Section */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Alertas por Email
              </h3>
              {alerts.map((alert) => {
                const goal = goals.find((g) => g.name === alert.kpi_name);
                return (
                  <div key={alert.id} className="p-3 bg-muted/30 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="font-medium">{kpiLabels[alert.kpi_name] || alert.kpi_name}</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Alertas</span>
                        <Switch
                          checked={alert.email_alert}
                          onCheckedChange={(checked) => handleAlertChange(alert.kpi_name, "email_alert", checked)}
                        />
                      </div>
                    </div>
                    {alert.email_alert && (
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-muted-foreground whitespace-nowrap">Alertar quando abaixo de:</Label>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={alert.threshold_percentage}
                          onChange={(e) => handleAlertChange(alert.kpi_name, "threshold_percentage", Number(e.target.value))}
                          className="w-20"
                        />
                        <span className="text-sm text-muted-foreground">% da meta</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving || loading}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Salvar Configurações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
