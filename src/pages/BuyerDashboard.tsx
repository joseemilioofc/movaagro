import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, ShoppingCart, Store, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/currency";

interface Order {
  id: string;
  seller_id: string;
  listing_id: string;
  title: string;
  quantity_kg: number;
  total_product_amount: number;
  shipping_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  seller_name?: string;
}

const BuyerDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*, product_listings(title)")
        .eq("buyer_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const enrichedOrders = (data || []).map((order: any) => ({
        ...order,
        title: order.product_listings?.title || "Produto",
      }));

      const sellerIds = [...new Set(enrichedOrders.map((o) => o.seller_id))];
      if (sellerIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, name")
          .in("user_id", sellerIds);

        const names: Record<string, string> = {};
        profiles?.forEach((p) => {
          names[p.user_id] = p.name;
        });

        setOrders(
          enrichedOrders.map((o) => ({
            ...o,
            seller_name: names[o.seller_id] || "Vendedor",
          }))
        );
      } else {
        setOrders(enrichedOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const totalOrders = orders.length;
  const pendingPayment = orders.filter((o) => o.payment_status === "pending").length;
  const inTransit = orders.filter((o) => o.status === "in_transit").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Painel do Comprador</h1>
            <p className="text-muted-foreground">Acompanhe as suas encomendas e encontre novos produtos</p>
          </div>
          <Link to="/marketplace">
            <Button className="bg-gradient-primary text-primary-foreground">
              <Store className="w-4 h-4 mr-2" />
              Explorar Marketplace
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total de Encomendas</CardDescription>
              <CardTitle className="text-3xl">{totalOrders}</CardTitle>
            </CardHeader>
            <CardContent>
              <ShoppingCart className="w-5 h-5 text-primary" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pagamentos Pendentes</CardDescription>
              <CardTitle className="text-3xl">{pendingPayment}</CardTitle>
            </CardHeader>
            <CardContent>
              <Package className="w-5 h-5 text-primary" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Em Trânsito</CardDescription>
              <CardTitle className="text-3xl">{inTransit}</CardTitle>
            </CardHeader>
            <CardContent>
              <Truck className="w-5 h-5 text-primary" />
            </CardContent>
          </Card>
        </div>

        <h2 className="text-xl font-display font-bold text-foreground">Minhas Encomendas</h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Ainda não fez nenhuma encomenda.</p>
              <Link to="/marketplace">
                <Button>Ir ao Marketplace</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{order.title}</CardTitle>
                    <Badge>{order.status}</Badge>
                  </div>
                  <CardDescription>
                    {order.quantity_kg} kg • {formatCurrency(order.total_product_amount)} • {order.seller_name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Transporte: {formatCurrency(order.shipping_amount)}</p>
                  <p>Pagamento: {order.payment_status}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default BuyerDashboard;
