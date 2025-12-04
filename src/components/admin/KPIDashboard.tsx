import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, Users, Package, DollarSign, CheckCircle, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useMemo, useEffect, useState, useCallback } from "react";
import { subDays, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { KPIGoalsSettings } from "./KPIGoalsSettings";

interface KPIDashboardProps {
  profiles: Array<{ created_at: string }>;
  requests: Array<{ created_at: string; status: string }>;
  proposals: Array<{ created_at: string; status: string; price: number }>;
  adminEmails?: string[];
}

interface KPIConfig {
  name: string;
  label: string;
  target: number;
  current: number;
  unit: string;
  icon: React.ReactNode;
  trend: number;
}

interface KPIGoal {
  name: string;
  target_value: number;
  unit: string;
}

export const KPIDashboard = ({ profiles, requests, proposals, adminEmails = [] }: KPIDashboardProps) => {
  const [goals, setGoals] = useState<KPIGoal[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchGoals = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("kpi_goals").select("name, target_value, unit");
      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error("Error fetching KPI goals:", error);
    }
  }, []);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals, refreshKey]);

  const kpis = useMemo(() => {
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subDays(currentMonthStart, 1));
    const lastMonthEnd = endOfMonth(lastMonthStart);

    // Current month data
    const currentMonthUsers = profiles.filter((p) =>
      isWithinInterval(new Date(p.created_at), { start: currentMonthStart, end: currentMonthEnd })
    ).length;

    const currentMonthRequests = requests.filter((r) =>
      isWithinInterval(new Date(r.created_at), { start: currentMonthStart, end: currentMonthEnd })
    ).length;

    const currentMonthCompletedRequests = requests.filter(
      (r) =>
        r.status === "completed" &&
        isWithinInterval(new Date(r.created_at), { start: currentMonthStart, end: currentMonthEnd })
    ).length;

    const currentMonthRevenue = proposals
      .filter(
        (p) =>
          (p.status === "paid" || p.status === "admin_confirmed") &&
          isWithinInterval(new Date(p.created_at), { start: currentMonthStart, end: currentMonthEnd })
      )
      .reduce((sum, p) => sum + (p.price || 0), 0);

    // Last month data for comparison
    const lastMonthUsers = profiles.filter((p) =>
      isWithinInterval(new Date(p.created_at), { start: lastMonthStart, end: lastMonthEnd })
    ).length;

    const lastMonthRequests = requests.filter((r) =>
      isWithinInterval(new Date(r.created_at), { start: lastMonthStart, end: lastMonthEnd })
    ).length;

    const lastMonthCompletedRequests = requests.filter(
      (r) =>
        r.status === "completed" &&
        isWithinInterval(new Date(r.created_at), { start: lastMonthStart, end: lastMonthEnd })
    ).length;

    const lastMonthRevenue = proposals
      .filter(
        (p) =>
          (p.status === "paid" || p.status === "admin_confirmed") &&
          isWithinInterval(new Date(p.created_at), { start: lastMonthStart, end: lastMonthEnd })
      )
      .reduce((sum, p) => sum + (p.price || 0), 0);

    // Calculate trends
    const calcTrend = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    // Conversion rate
    const totalRequests = requests.length;
    const completedRequests = requests.filter((r) => r.status === "completed").length;
    const conversionRate = totalRequests > 0 ? Math.round((completedRequests / totalRequests) * 100) : 0;

    const lastMonthTotalRequests = requests.filter((r) =>
      isWithinInterval(new Date(r.created_at), { start: lastMonthStart, end: lastMonthEnd })
    ).length;
    const lastMonthConversion = lastMonthTotalRequests > 0 
      ? Math.round((lastMonthCompletedRequests / lastMonthTotalRequests) * 100) 
      : 0;

    // Get targets from database or use defaults
    const getTarget = (name: string, defaultValue: number) => {
      const goal = goals.find((g) => g.name === name);
      return goal?.target_value ?? defaultValue;
    };

    return [
      {
        name: "new_users",
        label: "Novos Usuários",
        target: getTarget("new_users", 50),
        current: currentMonthUsers,
        unit: "usuários",
        icon: <Users className="w-5 h-5" />,
        trend: calcTrend(currentMonthUsers, lastMonthUsers),
      },
      {
        name: "monthly_requests",
        label: "Pedidos do Mês",
        target: getTarget("monthly_requests", 100),
        current: currentMonthRequests,
        unit: "pedidos",
        icon: <Package className="w-5 h-5" />,
        trend: calcTrend(currentMonthRequests, lastMonthRequests),
      },
      {
        name: "conversion_rate",
        label: "Taxa de Conversão",
        target: getTarget("conversion_rate", 80),
        current: conversionRate,
        unit: "%",
        icon: <CheckCircle className="w-5 h-5" />,
        trend: conversionRate - lastMonthConversion,
      },
      {
        name: "monthly_revenue",
        label: "Receita Mensal",
        target: getTarget("monthly_revenue", 500000),
        current: currentMonthRevenue,
        unit: "MZN",
        icon: <DollarSign className="w-5 h-5" />,
        trend: calcTrend(currentMonthRevenue, lastMonthRevenue),
      },
    ] as KPIConfig[];
  }, [profiles, requests, proposals, goals]);

  // Check KPI alerts
  useEffect(() => {
    const checkAlerts = async () => {
      if (kpis.length === 0 || adminEmails.length === 0) return;

      const kpiData = kpis.map((kpi) => ({
        name: kpi.name,
        current: kpi.current,
        target: kpi.target,
        unit: kpi.unit,
        percentage: Math.round((kpi.current / kpi.target) * 100),
      }));

      try {
        await supabase.functions.invoke("check-kpi-alerts", {
          body: { kpiData, adminEmails },
        });
      } catch (error) {
        console.error("Error checking KPI alerts:", error);
      }
    };

    // Check alerts once on load
    checkAlerts();
  }, [kpis, adminEmails]);

  const getProgressColor = (current: number, target: number) => {
    const percentage = (current / target) * 100;
    if (percentage >= 100) return "bg-green-500";
    if (percentage >= 75) return "bg-blue-500";
    if (percentage >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === "MZN") {
      return new Intl.NumberFormat("pt-MZ", { style: "currency", currency: "MZN" }).format(value);
    }
    if (unit === "%") {
      return `${value}%`;
    }
    return value.toLocaleString("pt-MZ");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              KPIs e Metas do Mês
            </CardTitle>
            <CardDescription>Acompanhe o progresso das métricas principais</CardDescription>
          </div>
          <KPIGoalsSettings onUpdate={() => setRefreshKey((k) => k + 1)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {kpis.map((kpi, index) => {
            const percentage = Math.min((kpi.current / kpi.target) * 100, 100);
            const isPositiveTrend = kpi.trend >= 0;

            return (
              <div key={index} className="space-y-3 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      {kpi.icon}
                    </div>
                    <span className="font-medium text-sm">{kpi.label}</span>
                  </div>
                  <Badge
                    variant={isPositiveTrend ? "default" : "destructive"}
                    className="flex items-center gap-1"
                  >
                    {isPositiveTrend ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {Math.abs(kpi.trend)}%
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-end justify-between">
                    <span className="text-2xl font-bold">{formatValue(kpi.current, kpi.unit)}</span>
                    <span className="text-sm text-muted-foreground">
                      Meta: {formatValue(kpi.target, kpi.unit)}
                    </span>
                  </div>
                  <div className="relative">
                    <Progress value={percentage} className="h-2" />
                    <div
                      className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getProgressColor(
                        kpi.current,
                        kpi.target
                      )}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{Math.round(percentage)}% da meta</span>
                    <span>
                      {kpi.current >= kpi.target ? (
                        <span className="text-green-600 font-medium">Meta atingida!</span>
                      ) : (
                        `Faltam ${formatValue(kpi.target - kpi.current, kpi.unit)}`
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
