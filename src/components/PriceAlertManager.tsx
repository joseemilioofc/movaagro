import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff, Trash2, Plus, Loader2, TrendingUp, TrendingDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatMZN } from "@/lib/currency";
import { calculateDistance } from "@/data/mozambiqueLocations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PriceAlert {
  id: string;
  origin: string;
  destination: string;
  cargo_type: string;
  base_price: number;
  threshold_percentage: number;
  is_active: boolean;
  created_at: string;
}

interface PriceAlertManagerProps {
  userId: string | null;
  origin?: string;
  destination?: string;
  cargoType?: string;
  currentPrice?: number;
}

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

export function PriceAlertManager({
  userId,
  origin,
  destination,
  cargoType,
  currentPrice,
}: PriceAlertManagerProps) {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [threshold, setThreshold] = useState("10");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchAlerts();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const fetchAlerts = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from("price_alerts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAlerts(data || []);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const createAlert = async () => {
    if (!userId || !origin || !destination || !cargoType || !currentPrice) {
      toast.error("Preencha todos os campos da calculadora primeiro");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from("price_alerts").insert({
        user_id: userId,
        origin,
        destination,
        cargo_type: cargoType,
        base_price: currentPrice,
        threshold_percentage: parseFloat(threshold),
        is_active: true,
      });

      if (error) throw error;
      toast.success("Alerta de preço criado com sucesso!");
      fetchAlerts();
      setDialogOpen(false);
    } catch (error) {
      console.error("Error creating alert:", error);
      toast.error("Erro ao criar alerta");
    } finally {
      setSaving(false);
    }
  };

  const toggleAlert = async (alertId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("price_alerts")
        .update({ is_active: !isActive })
        .eq("id", alertId);

      if (error) throw error;
      setAlerts(alerts.map(a => a.id === alertId ? { ...a, is_active: !isActive } : a));
      toast.success(isActive ? "Alerta desativado" : "Alerta ativado");
    } catch (error) {
      console.error("Error toggling alert:", error);
      toast.error("Erro ao atualizar alerta");
    }
  };

  const deleteAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from("price_alerts")
        .delete()
        .eq("id", alertId);

      if (error) throw error;
      setAlerts(alerts.filter(a => a.id !== alertId));
      toast.success("Alerta removido");
    } catch (error) {
      console.error("Error deleting alert:", error);
      toast.error("Erro ao remover alerta");
    }
  };

  const calculatePriceChange = (alert: PriceAlert): { percentage: number; direction: "up" | "down" | "same" } => {
    // Simulate current market price (in a real app, this would come from an API)
    const distance = calculateDistance(alert.origin, alert.destination);
    const baseRate = 2.5; // Average rate per km/ton
    const simulatedCurrentPrice = baseRate * distance * 30; // Assuming 30 tons
    
    const percentage = ((simulatedCurrentPrice - alert.base_price) / alert.base_price) * 100;
    const direction = percentage > 0 ? "up" : percentage < 0 ? "down" : "same";
    
    return { percentage: Math.abs(percentage), direction };
  };

  if (!userId) {
    return (
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Alertas de Preço
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Faça login para criar alertas de variação de preço nas suas rotas favoritas.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Alertas de Preço
            </CardTitle>
            <CardDescription>
              Receba notificações quando os preços variarem
            </CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                className="gap-2"
                disabled={!origin || !destination || !cargoType || !currentPrice}
              >
                <Plus className="w-4 h-4" />
                Criar Alerta
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Alerta de Preço</DialogTitle>
                <DialogDescription>
                  Você será notificado quando o preço desta rota variar além do limite definido.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Rota</Label>
                  <p className="text-sm text-foreground font-medium">
                    {origin} → {destination}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Carga</Label>
                  <p className="text-sm text-foreground font-medium">
                    {cargoLabels[cargoType || ""] || cargoType}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Preço Base</Label>
                  <p className="text-sm text-foreground font-medium">
                    {formatMZN(currentPrice || 0)}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="threshold">Limite de variação (%)</Label>
                  <Input
                    id="threshold"
                    type="number"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    min="1"
                    max="50"
                    placeholder="10"
                  />
                  <p className="text-xs text-muted-foreground">
                    Você será notificado se o preço variar mais de {threshold}%
                  </p>
                </div>
                <Button onClick={createAlert} disabled={saving} className="w-full">
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Bell className="w-4 h-4 mr-2" />
                  )}
                  Criar Alerta
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum alerta configurado. Calcule um preço e clique em "Criar Alerta".
          </p>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => {
              const priceChange = calculatePriceChange(alert);
              const isTriggered = priceChange.percentage >= alert.threshold_percentage;
              
              return (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border ${
                    alert.is_active ? "bg-card border-border" : "bg-muted/50 border-muted"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">
                        {alert.origin} → {alert.destination}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {cargoLabels[alert.cargo_type] || alert.cargo_type} • Base: {formatMZN(alert.base_price)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            isTriggered && alert.is_active
                              ? "bg-orange-500/20 text-orange-600 border-orange-500/50"
                              : ""
                          }`}
                        >
                          Limite: ±{alert.threshold_percentage}%
                        </Badge>
                        {alert.is_active && (
                          <span className={`flex items-center gap-1 text-xs ${
                            priceChange.direction === "up" 
                              ? "text-red-500" 
                              : priceChange.direction === "down" 
                              ? "text-green-500" 
                              : "text-muted-foreground"
                          }`}>
                            {priceChange.direction === "up" ? (
                              <TrendingUp className="w-3 h-3" />
                            ) : priceChange.direction === "down" ? (
                              <TrendingDown className="w-3 h-3" />
                            ) : null}
                            {priceChange.percentage.toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={alert.is_active}
                        onCheckedChange={() => toggleAlert(alert.id, alert.is_active)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => deleteAlert(alert.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
