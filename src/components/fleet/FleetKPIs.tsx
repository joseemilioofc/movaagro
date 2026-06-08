import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, Truck, Users, DollarSign } from "lucide-react";
import { formatMZN } from "@/lib/currency";

interface Stats {
  totalRevenue: number;
  totalTrips: number;
  vehicleCount: number;
  driverCount: number;
  perVehicle: { plate: string; trips: number; revenue: number }[];
  perDriver: { name: string; trips: number }[];
}

export const FleetKPIs = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) load(); }, [user]);

  const load = async () => {
    setLoading(true);
    try {
      const [vehicles, drivers, proposals] = await Promise.all([
        (supabase as any).from("fleet_vehicles").select("id, plate").eq("transporter_id", user!.id),
        (supabase as any).from("fleet_drivers").select("id, name").eq("transporter_id", user!.id),
        (supabase as any)
          .from("transport_proposals")
          .select("price, status, assigned_vehicle_id, assigned_driver_id")
          .eq("transporter_id", user!.id)
          .eq("status", "accepted"),
      ]);

      const props = (proposals.data as any[]) || [];
      const vs = (vehicles.data as any[]) || [];
      const ds = (drivers.data as any[]) || [];

      const perVehicle = vs.map(v => {
        const trips = props.filter(p => p.assigned_vehicle_id === v.id);
        return { plate: v.plate, trips: trips.length, revenue: trips.reduce((s, t) => s + Number(t.price || 0), 0) };
      });
      const perDriver = ds.map(d => ({
        name: d.name,
        trips: props.filter(p => p.assigned_driver_id === d.id).length,
      })).sort((a, b) => b.trips - a.trips);

      setStats({
        totalRevenue: props.reduce((s, p) => s + Number(p.price || 0), 0),
        totalTrips: props.length,
        vehicleCount: vs.length,
        driverCount: ds.length,
        perVehicle,
        perDriver,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  if (!stats) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-light rounded-lg flex items-center justify-center"><DollarSign className="w-5 h-5 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Receita total</p>
              <p className="text-lg font-bold">{formatMZN(stats.totalRevenue)}</p>
            </div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-light rounded-lg flex items-center justify-center"><TrendingUp className="w-5 h-5 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Viagens</p>
              <p className="text-lg font-bold">{stats.totalTrips}</p>
            </div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-light rounded-lg flex items-center justify-center"><Truck className="w-5 h-5 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Viaturas</p>
              <p className="text-lg font-bold">{stats.vehicleCount}</p>
            </div>
          </div>
        </CardContent></Card>
        <Card><CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-light rounded-lg flex items-center justify-center"><Users className="w-5 h-5 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Motoristas</p>
              <p className="text-lg font-bold">{stats.driverCount}</p>
            </div>
          </div>
        </CardContent></Card>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Viagens por viatura</CardTitle><CardDescription>Receita acumulada</CardDescription></CardHeader>
          <CardContent>
            {stats.perVehicle.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem dados.</p>
            ) : (
              <div className="space-y-2">
                {stats.perVehicle.map(v => (
                  <div key={v.plate} className="flex justify-between text-sm py-1 border-b last:border-0">
                    <span className="font-medium">{v.plate}</span>
                    <span className="text-muted-foreground">{v.trips} viagens • {formatMZN(v.revenue)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Ranking de motoristas</CardTitle><CardDescription>Por número de viagens</CardDescription></CardHeader>
          <CardContent>
            {stats.perDriver.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem dados.</p>
            ) : (
              <div className="space-y-2">
                {stats.perDriver.map((d, i) => (
                  <div key={d.name} className="flex justify-between text-sm py-1 border-b last:border-0">
                    <span className="font-medium">#{i + 1} {d.name}</span>
                    <span className="text-muted-foreground">{d.trips} viagens</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
