import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { BarChart3 } from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MonthlyComparisonChartProps {
  requests: { created_at: string }[];
  proposals: { created_at: string }[];
  profiles: { created_at: string }[];
}

export const MonthlyComparisonChart = ({ requests, proposals, profiles }: MonthlyComparisonChartProps) => {
  const chartData = useMemo(() => {
    const data: { month: string; pedidos: number; propostas: number; usuarios: number }[] = [];
    
    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(new Date(), i);
      const start = startOfMonth(monthDate);
      const end = endOfMonth(monthDate);
      const monthLabel = format(monthDate, "MMM/yy", { locale: ptBR });
      
      const pedidos = requests.filter((r) => 
        isWithinInterval(new Date(r.created_at), { start, end })
      ).length;
      
      const propostas = proposals.filter((p) => 
        isWithinInterval(new Date(p.created_at), { start, end })
      ).length;
      
      const usuarios = profiles.filter((p) => 
        isWithinInterval(new Date(p.created_at), { start, end })
      ).length;
      
      data.push({ month: monthLabel, pedidos, propostas, usuarios });
    }
    
    return data;
  }, [requests, proposals, profiles]);

  // Calculate growth percentages
  const growth = useMemo(() => {
    if (chartData.length < 2) return { pedidos: 0, propostas: 0, usuarios: 0 };
    
    const current = chartData[chartData.length - 1];
    const previous = chartData[chartData.length - 2];
    
    const calcGrowth = (curr: number, prev: number) => {
      if (prev === 0) return curr > 0 ? 100 : 0;
      return Math.round(((curr - prev) / prev) * 100);
    };
    
    return {
      pedidos: calcGrowth(current.pedidos, previous.pedidos),
      propostas: calcGrowth(current.propostas, previous.propostas),
      usuarios: calcGrowth(current.usuarios, previous.usuarios),
    };
  }, [chartData]);

  const formatGrowth = (value: number) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value}%`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Comparativo Mensal
        </CardTitle>
        <CardDescription>
          Últimos 6 meses - Crescimento vs mês anterior: 
          <span className={`ml-2 ${growth.pedidos >= 0 ? "text-green-600" : "text-red-600"}`}>
            Pedidos {formatGrowth(growth.pedidos)}
          </span>
          <span className={`ml-2 ${growth.propostas >= 0 ? "text-green-600" : "text-red-600"}`}>
            Propostas {formatGrowth(growth.propostas)}
          </span>
          <span className={`ml-2 ${growth.usuarios >= 0 ? "text-green-600" : "text-red-600"}`}>
            Usuários {formatGrowth(growth.usuarios)}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month" 
                className="text-xs" 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                className="text-xs" 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar 
                dataKey="pedidos" 
                name="Pedidos" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="propostas" 
                name="Propostas" 
                fill="hsl(var(--chart-2))" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="usuarios" 
                name="Usuários" 
                fill="hsl(var(--chart-3))" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
