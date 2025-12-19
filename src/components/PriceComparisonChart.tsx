import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import { formatMZN } from "@/lib/currency";
import { BarChart3 } from "lucide-react";
import { calculateDistance } from "@/data/mozambiqueLocations";

interface CargoType {
  value: string;
  label: string;
  pricePerKmTon: number;
}

interface PriceComparisonChartProps {
  origin: string;
  destination: string;
  weight: string;
  cargoTypes: CargoType[];
  selectedCargoType: string;
}

const COLORS = [
  "hsl(142, 76%, 36%)", // green
  "hsl(217, 91%, 60%)", // blue
  "hsl(262, 83%, 58%)", // purple
  "hsl(24, 94%, 50%)",  // orange
  "hsl(346, 77%, 49%)", // red
  "hsl(47, 96%, 53%)",  // yellow
  "hsl(173, 80%, 40%)", // teal
  "hsl(316, 70%, 50%)", // pink
];

export function PriceComparisonChart({
  origin,
  destination,
  weight,
  cargoTypes,
  selectedCargoType,
}: PriceComparisonChartProps) {
  const chartData = useMemo(() => {
    if (!origin || !destination || !weight) {
      return [];
    }

    const weightNum = parseFloat(weight);
    if (isNaN(weightNum) || weightNum <= 0) {
      return [];
    }

    const distance = calculateDistance(origin, destination);

    return cargoTypes
      .map((cargo) => {
        const basePrice = cargo.pricePerKmTon * distance * weightNum;
        const avgPrice = Math.max(basePrice, 6250);

        return {
          name: cargo.label,
          value: cargo.value,
          price: Math.round(avgPrice),
          isSelected: cargo.value === selectedCargoType,
        };
      })
      .sort((a, b) => a.price - b.price);
  }, [origin, destination, weight, cargoTypes, selectedCargoType]);

  if (chartData.length === 0) {
    return null;
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-foreground">{data.name}</p>
          <p className="text-primary font-bold">{formatMZN(data.price)}</p>
          {data.isSelected && (
            <p className="text-xs text-muted-foreground mt-1">✓ Selecionado</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Gráfico Comparativo de Preços
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Comparação visual dos preços médios por tipo de carga
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] sm:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                type="number" 
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                className="text-xs fill-muted-foreground"
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={100}
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="price" 
                radius={[0, 4, 4, 0]}
                maxBarSize={30}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isSelected ? "hsl(var(--primary))" : COLORS[index % COLORS.length]}
                    stroke={entry.isSelected ? "hsl(var(--primary))" : "none"}
                    strokeWidth={entry.isSelected ? 2 : 0}
                    opacity={entry.isSelected ? 1 : 0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {chartData.slice(0, 8).map((item, index) => (
            <div 
              key={item.value} 
              className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded ${
                item.isSelected ? "bg-primary/20 text-primary font-medium" : "bg-muted"
              }`}
            >
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: item.isSelected ? "hsl(var(--primary))" : COLORS[index % COLORS.length] }}
              />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
