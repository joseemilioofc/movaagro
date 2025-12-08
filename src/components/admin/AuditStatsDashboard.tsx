import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { format, subDays, parseISO, startOfDay, eachDayOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Activity, Users, TrendingUp, Clock } from "lucide-react";

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: any;
  ip_address: string | null;
  created_at: string;
}

interface Profile {
  user_id: string;
  name: string;
  email: string;
}

interface AuditStatsDashboardProps {
  logs: AuditLog[];
  profiles: Profile[];
}

const COLORS = [
  "hsl(142, 70%, 35%)",
  "hsl(85, 50%, 50%)",
  "hsl(35, 30%, 45%)",
  "hsl(200, 60%, 50%)",
  "hsl(280, 50%, 50%)",
  "hsl(0, 60%, 50%)",
  "hsl(45, 80%, 50%)",
  "hsl(180, 50%, 45%)",
];

const actionLabels: Record<string, string> = {
  create: "Criação",
  update: "Atualização",
  delete: "Exclusão",
  login: "Login",
  logout: "Logout",
  email_sent: "Email",
  view: "Visualização",
  accept: "Aceito",
  reject: "Rejeitado",
  sign_contract: "Contrato",
  send_message: "Mensagem",
  submit_proposal: "Proposta",
  complete_transport: "Concluído",
  rate: "Avaliação",
};

export const AuditStatsDashboard = ({ logs, profiles }: AuditStatsDashboardProps) => {
  const stats = useMemo(() => {
    // Activities per day (last 7 days)
    const last7Days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date(),
    });

    const activitiesPerDay = last7Days.map((day) => {
      const dayStart = startOfDay(day);
      const count = logs.filter((log) => {
        const logDate = startOfDay(parseISO(log.created_at));
        return logDate.getTime() === dayStart.getTime();
      }).length;

      return {
        date: format(day, "EEE", { locale: ptBR }),
        fullDate: format(day, "dd/MM", { locale: ptBR }),
        count,
      };
    });

    // Most frequent actions
    const actionCounts = logs.reduce((acc, log) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topActions = Object.entries(actionCounts)
      .map(([action, count]) => ({
        name: actionLabels[action] || action,
        value: count,
        action,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    // Most active users
    const userCounts = logs.reduce((acc, log) => {
      acc[log.user_id] = (acc[log.user_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topUsers = Object.entries(userCounts)
      .map(([userId, count]) => {
        const profile = profiles.find((p) => p.user_id === userId);
        return {
          name: profile?.name || "Desconhecido",
          email: profile?.email || "",
          count,
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Entity distribution
    const entityCounts = logs.reduce((acc, log) => {
      acc[log.entity_type] = (acc[log.entity_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const entityLabels: Record<string, string> = {
      user: "Usuário",
      transport_request: "Pedido",
      transport_proposal: "Proposta",
      profile: "Perfil",
      kpi_settings: "KPI",
      digital_contract: "Contrato",
      chat_message: "Mensagem",
      rating: "Avaliação",
    };

    const entityDistribution = Object.entries(entityCounts)
      .map(([entity, count]) => ({
        name: entityLabels[entity] || entity,
        value: count,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    return {
      activitiesPerDay,
      topActions,
      topUsers,
      entityDistribution,
      totalLogs: logs.length,
      uniqueUsers: Object.keys(userCounts).length,
      todayLogs: activitiesPerDay[activitiesPerDay.length - 1]?.count || 0,
    };
  }, [logs, profiles]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Registros</p>
                <p className="text-2xl font-bold text-foreground">{stats.totalLogs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-xl">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Usuários Ativos</p>
                <p className="text-2xl font-bold text-foreground">{stats.uniqueUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-light rounded-xl">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hoje</p>
                <p className="text-2xl font-bold text-foreground">{stats.todayLogs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary rounded-xl">
                <Clock className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Média/Dia</p>
                <p className="text-2xl font-bold text-foreground">
                  {Math.round(stats.totalLogs / 7)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activities per Day */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Atividades por Dia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.activitiesPerDay}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="fullDate" 
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    className="text-muted-foreground"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(142, 70%, 35%)"
                    strokeWidth={3}
                    dot={{ fill: "hsl(142, 70%, 35%)", r: 4 }}
                    name="Atividades"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Most Frequent Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ações Mais Frequentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.topActions}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {stats.topActions.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-2 -mt-4">
                {stats.topActions.slice(0, 4).map((action, index) => (
                  <div key={action.action} className="flex items-center gap-1 text-xs">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-muted-foreground">{action.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Active Users */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Usuários Mais Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.topUsers} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    tick={{ fontSize: 11 }}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [value, "Ações"]}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="hsl(85, 50%, 50%)" 
                    radius={[0, 4, 4, 0]}
                    name="Ações"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Entity Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribuição por Entidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.entityDistribution}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="hsl(142, 70%, 35%)" 
                    radius={[4, 4, 0, 0]}
                    name="Registros"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
