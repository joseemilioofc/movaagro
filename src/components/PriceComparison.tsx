import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatMZN } from "@/lib/currency";
import { BarChart3, ArrowUpDown } from "lucide-react";
import { calculateDistance } from "@/data/mozambiqueLocations";

interface CargoType {
  value: string;
  label: string;
  pricePerKmTon: number;
}

interface PriceComparisonProps {
  origin: string;
  destination: string;
  weight: string;
  cargoTypes: CargoType[];
  selectedCargoType: string;
}

export function PriceComparison({
  origin,
  destination,
  weight,
  cargoTypes,
  selectedCargoType,
}: PriceComparisonProps) {
  const comparison = useMemo(() => {
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
        const minPrice = Math.max(basePrice * 0.85, 5000);
        const maxPrice = Math.max(basePrice * 1.15, 7500);
        const avgPrice = (minPrice + maxPrice) / 2;

        return {
          value: cargo.value,
          label: cargo.label,
          pricePerKmTon: cargo.pricePerKmTon,
          minPrice,
          maxPrice,
          avgPrice,
          distance,
        };
      })
      .sort((a, b) => a.avgPrice - b.avgPrice);
  }, [origin, destination, weight, cargoTypes]);

  if (comparison.length === 0) {
    return null;
  }

  const cheapest = comparison[0];
  const mostExpensive = comparison[comparison.length - 1];

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Comparativo de Preços por Tipo de Carga
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {origin} → {destination} • {weight} toneladas • {comparison[0]?.distance} km
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Tipo de Carga</TableHead>
                <TableHead className="text-center">MZN/km/ton</TableHead>
                <TableHead className="text-right">Preço Mínimo</TableHead>
                <TableHead className="text-right">Preço Máximo</TableHead>
                <TableHead className="text-right">Média</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparison.map((item, index) => {
                const isSelected = item.value === selectedCargoType;
                const isCheapest = index === 0;
                const isMostExpensive = index === comparison.length - 1;

                return (
                  <TableRow
                    key={item.value}
                    className={
                      isSelected
                        ? "bg-primary/10 border-primary"
                        : isCheapest
                        ? "bg-green-500/10"
                        : isMostExpensive
                        ? "bg-red-500/10"
                        : ""
                    }
                  >
                    <TableCell className="font-medium">
                      <span className="flex items-center gap-2">
                        {item.label}
                        {isCheapest && (
                          <span className="text-xs px-1.5 py-0.5 bg-green-500/20 text-green-700 dark:text-green-400 rounded">
                            Mais barato
                          </span>
                        )}
                        {isMostExpensive && (
                          <span className="text-xs px-1.5 py-0.5 bg-red-500/20 text-red-700 dark:text-red-400 rounded">
                            Mais caro
                          </span>
                        )}
                        {isSelected && (
                          <span className="text-xs px-1.5 py-0.5 bg-primary/20 text-primary rounded">
                            Selecionado
                          </span>
                        )}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">
                      {item.pricePerKmTon.toFixed(1)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatMZN(item.minPrice)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatMZN(item.maxPrice)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      {formatMZN(item.avgPrice)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {comparison.length > 1 && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Diferença:{" "}
                <span className="font-semibold text-foreground">
                  {formatMZN(mostExpensive.avgPrice - cheapest.avgPrice)}
                </span>{" "}
                entre {cheapest.label} e {mostExpensive.label}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
