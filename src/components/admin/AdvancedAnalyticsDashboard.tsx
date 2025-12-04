import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Calendar, Package, Users, DollarSign, Target, Activity } from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval, parseISO, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AnalyticsDashboardProps {
  profiles: any[];
  requests: any[];
  proposals: any[];
}

const COLORS = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export const AdvancedAnalyticsDashboard = ({ profiles, requests, proposals }: AnalyticsDashboardProps) => {
  // Calculate monthly data for the last 6 months
  const monthlyData = useMemo(() => {
    const now = new Date();
    const sixMonthsAgo = subMonths(now, 5);
    const months = eachMonthOfInterval({ start: startOfMonth(sixMonthsAgo), end: startOfMonth(now) });

    return months.map((month) => {
      const start = startOfMonth(month);
      const end = endOfMonth(month);
      const interval = { start, end };

      const monthRequests = requests.filter((r) => {
        const date = parseISO(r.created_at);
        return isWithinInterval(date, interval);
      });

      const monthProposals = proposals.filter((p) => {
        const date = parseISO(p.created_at);
        return isWithinInterval(date, interval);
      });

      const monthUsers = profiles.filter((p) => {
        const date = parseISO(p.created_at);
        return isWithinInterval(date, interval);
      });

      const completedRequests = monthRequests.filter((r) => r.status === "completed");
      const revenue = monthProposals
        .filter((p) => p.status === "paid" || p.status === "confirmed")
        .reduce((sum, p) => sum + Number(p.price || 0), 0);

      return {
        month: format(month, "MMM", { locale: ptBR }),
        fullMonth: format(month, "MMMM yyyy", { locale: ptBR }),
        pedidos: monthRequests.length,
        propostas: monthProposals.length,
        concluidos: completedRequests.length,
        usuarios: monthUsers.length,
        receita: revenue,
        conversao: monthRequests.length > 0 ? ((completedRequests.length / monthRequests.length) * 100).toFixed(1) : 0,
      };
    });
  }, [profiles, requests, proposals]);

  // Calculate status distribution
  const statusDistribution = useMemo(() => {
    const statusCount: Record<string, number> = {};
    requests.forEach((r) => {
      const status = r.status || "pending";
      statusCount[status] = (statusCount[status] || 0) + 1;
    });

    const statusLabels: Record<string, string> = {
      pending: "Pendente",
      in_progress: "Em Progresso",
      completed: "Concluído",
      cancelled: "Cancelado",
    };

    return Object.entries(statusCount).map(([status, count]) => ({
      name: statusLabels[status] || status,
      value: count,
    }));
  }, [requests]);

  // Calculate cargo type distribution
  const cargoDistribution = useMemo(() => {
    const cargoCount: Record<string, number> = {};
    requests.forEach((r) => {
      const cargo = r.cargo_type || "Outro";
      cargoCount[cargo] = (cargoCount[cargo] || 0) + 1;
    });

    return Object.entries(cargoCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [requests]);

  // Calculate demand forecast (simple linear regression)
  const demandForecast = useMemo(() => {
    const historical = monthlyData.map((d, i) => ({ x: i, y: d.pedidos }));
    const n = historical.length;
    
    if (n < 2) return [];

    const sumX = historical.reduce((sum, p) => sum + p.x, 0);
    const sumY = historical.reduce((sum, p) => sum + p.y, 0);
    const sumXY = historical.reduce((sum, p) => sum + p.x * p.y, 0);
    const sumXX = historical.reduce((sum, p) => sum + p.x * p.x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const now = new Date();
    const forecast = [];
    
    // Add historical data
    monthlyData.forEach((d) => {
      forecast.push({
        month: d.month,
        real: d.pedidos,
        previsao: null,
      });
    });

    // Add forecast for next 3 months
    for (let i = 1; i <= 3; i++) {
      const futureMonth = subMonths(now, -i);
      const predictedValue = Math.max(0, Math.round(intercept + slope * (n + i - 1)));
      forecast.push({
        month: format(futureMonth, "MMM", { locale: ptBR }),
        real: null,
        previsao: predictedValue,
      });
    }

    return forecast;
  }, [monthlyData]);

  // Calculate growth rates
  const growthRates = useMemo(() => {
    if (monthlyData.length < 2) return { requests: 0, revenue: 0, users: 0 };

    const current = monthlyData[monthlyData.length - 1];
    const previous = monthlyData[monthlyData.length - 2];

    const calcGrowth = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return ((curr - prev) / prev) * 100;
    };

    return {
      requests: calcGrowth(current.pedidos, previous.pedidos),
      revenue: calcGrowth(current.receita, previous.receita),
      users: calcGrowth(current.usuarios, previous.usuarios),
    };
  }, [monthlyData]);

  const GrowthIndicator = ({ value }: { value: number }) => {
    const isPositive = value >= 0;
    return (
      <div className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>
        {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        <span>{Math.abs(value).toFixed(1)}%</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pedidos este mês</p>
                <p className="text-2xl font-bold">{monthlyData[monthlyData.length - 1]?.pedidos || 0}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Package className="h-8 w-8 text-primary" />
                <GrowthIndicator value={growthRates.requests} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Receita este mês</p>
                <p className="text-2xl font-bold">
                  {(monthlyData[monthlyData.length - 1]?.receita || 0).toLocaleString("pt-MZ")} MZN
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <DollarSign className="h-8 w-8 text-green-600" />
                <GrowthIndicator value={growthRates.revenue} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Novos usuários</p>
                <p className="text-2xl font-bold">{monthlyData[monthlyData.length - 1]?.usuarios || 0}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Users className="h-8 w-8 text-blue-600" />
                <GrowthIndicator value={growthRates.users} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa de conversão</p>
                <p className="text-2xl font-bold">{monthlyData[monthlyData.length - 1]?.conversao || 0}%</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Target className="h-8 w-8 text-purple-600" />
                <Badge variant="secondary">Meta: 80%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Tendências</TabsTrigger>
          <TabsTrigger value="comparison">Comparativo</TabsTrigger>
          <TabsTrigger value="distribution">Distribuição</TabsTrigger>
          <TabsTrigger value="forecast">Previsão</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Evolução Mensal
              </CardTitle>
              <CardDescription>Pedidos, propostas e receita nos últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="colorPedidos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPropostas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="pedidos"
                    name="Pedidos"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorPedidos)"
                  />
                  <Area
                    type="monotone"
                    dataKey="propostas"
                    name="Propostas"
                    stroke="hsl(var(--chart-2))"
                    fillOpacity={1}
                    fill="url(#colorPropostas)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Comparativo Mensal
              </CardTitle>
              <CardDescription>Pedidos vs Concluídos por mês</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="pedidos" name="Total de Pedidos" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="concluidos" name="Concluídos" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Status dos Pedidos</CardTitle>
                <CardDescription>Distribuição por status atual</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusDistribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tipos de Carga</CardTitle>
                <CardDescription>Top 5 tipos mais transportados</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={cargoDistribution} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis dataKey="name" type="category" width={100} className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="value" name="Quantidade" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forecast">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Previsão de Demanda
              </CardTitle>
              <CardDescription>
                Histórico e previsão para os próximos 3 meses (baseado em tendência linear)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={demandForecast}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="real"
                    name="Pedidos Reais"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="previsao"
                    name="Previsão"
                    stroke="hsl(var(--chart-4))"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: "hsl(var(--chart-4))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Insights</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>
                    • Tendência:{" "}
                    {growthRates.requests >= 0 ? (
                      <span className="text-green-600">Crescimento de {growthRates.requests.toFixed(1)}% no último mês</span>
                    ) : (
                      <span className="text-red-600">Queda de {Math.abs(growthRates.requests).toFixed(1)}% no último mês</span>
                    )}
                  </li>
                  <li>• Total de pedidos históricos: {requests.length}</li>
                  <li>• Média mensal: {(requests.length / 6).toFixed(1)} pedidos</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
