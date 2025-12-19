import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatMZN } from "@/lib/currency";
import { History, Trash2, MapPin, Package, Calendar, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { toast } from "sonner";

interface PriceCalculation {
  id: string;
  origin: string;
  destination: string;
  cargo_type: string;
  weight_kg: number;
  distance_km: number;
  price_min: number;
  price_max: number;
  created_at: string;
}

interface PriceHistoryProps {
  userId: string | null;
  onSelectCalculation?: (calc: PriceCalculation) => void;
}

export function PriceHistory({ userId, onSelectCalculation }: PriceHistoryProps) {
  const [history, setHistory] = useState<PriceCalculation[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchHistory = async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("price_calculations")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [userId]);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const { error } = await supabase
        .from("price_calculations")
        .delete()
        .eq("id", id);

      if (error) throw error;
      setHistory(prev => prev.filter(h => h.id !== id));
      toast.success("Cálculo removido do histórico");
    } catch (error) {
      toast.error("Erro ao remover cálculo");
    } finally {
      setDeleting(null);
    }
  };

  const cargoLabels: Record<string, string> = {
    milho: "Milho",
    soja: "Soja",
    trigo: "Trigo",
    cafe: "Café",
    acucar: "Açúcar",
    arroz: "Arroz",
    feijao: "Feijão",
    algodao: "Algodão",
    amendoim: "Amendoim",
    tabaco: "Tabaco",
    cana: "Cana-de-açúcar",
    castanha: "Castanha de Caju",
    copra: "Copra",
    gergelim: "Gergelim",
    cha: "Chá",
    coco: "Coco",
    banana: "Banana",
    citrinos: "Citrinos",
    horticolas: "Hortícolas",
    outros: "Outros",
  };

  if (!userId) {
    return (
      <Card className="border-2 border-dashed border-muted-foreground/30">
        <CardContent className="py-8 text-center">
          <History className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">
            Faça login para salvar e visualizar o histórico de cálculos
          </p>
          <Button variant="outline" className="mt-4" asChild>
            <a href="/auth">Entrar</a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card className="border-2 border-dashed border-muted-foreground/30">
        <CardContent className="py-8 text-center">
          <History className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">
            Nenhum cálculo salvo ainda
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          Histórico de Cálculos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {history.map((calc) => (
            <div
              key={calc.id}
              className="p-3 bg-muted/50 rounded-lg border border-border hover:border-primary/30 transition-colors cursor-pointer group"
              onClick={() => onSelectCalculation?.(calc)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <MapPin className="w-3 h-3 text-green-500 flex-shrink-0" />
                    <span className="truncate">{calc.origin}</span>
                    <span className="text-muted-foreground">→</span>
                    <MapPin className="w-3 h-3 text-red-500 flex-shrink-0" />
                    <span className="truncate">{calc.destination}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      {cargoLabels[calc.cargo_type] || calc.cargo_type}
                    </span>
                    <span>{calc.weight_kg} ton</span>
                    <span>{calc.distance_km} km</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(calc.created_at), "dd MMM yyyy", { locale: pt })}
                    </span>
                  </div>
                  <div className="mt-2 text-sm font-semibold text-primary">
                    {formatMZN(calc.price_min)} - {formatMZN(calc.price_max)}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(calc.id);
                  }}
                  disabled={deleting === calc.id}
                >
                  {deleting === calc.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 text-destructive" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          Clique num cálculo para preencher automaticamente
        </p>
      </CardContent>
    </Card>
  );
}
