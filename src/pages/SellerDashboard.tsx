import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Package, ShoppingCart, TrendingUp, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/currency";

interface ProductListing {
  id: string;
  title: string;
  category: string;
  product_type: string;
  quantity_kg: number;
  min_order_kg: number;
  price_per_kg: number;
  status: string;
  created_at: string;
}

interface Order {
  id: string;
  buyer_id: string;
  listing_id: string;
  quantity_kg: number;
  total_product_amount: number;
  shipping_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  buyer_name?: string;
}

const SellerDashboard = () => {
  const { user, role } = useAuth();
  const [listings, setListings] = useState<ProductListing[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wallet, setWallet] = useState<{ available_balance: number; pending_balance: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [listingsRes, ordersRes, walletRes] = await Promise.all([
        supabase.from("product_listings").select("*").eq("seller_id", user?.id).order("created_at", { ascending: false }),
        supabase.from("orders").select("*").eq("seller_id", user?.id).order("created_at", { ascending: false }),
        supabase.from("seller_wallets").select("*").eq("seller_id", user?.id).single(),
      ]);

      if (listingsRes.error) throw listingsRes.error;
      if (ordersRes.error) throw ordersRes.error;

      setListings(listingsRes.data || []);
      setOrders(ordersRes.data || []);
      setWallet(walletRes.data || { available_balance: 0, pending_balance: 0 });
    } catch (error) {
      console.error("Error fetching seller data:", error);
    } finally {
      setLoading(false);
    }
  };

  const activeListings = listings.filter((l) => l.status === "active").length;
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending_payment" || o.status === "paid").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Painel do Vendedor</h1>
            <p className="text-muted-foreground">Gerencie as suas listagens e encomendas</p>
          </div>
          <Link to="/seller/listings/new">
            <Button className="bg-gradient-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Nova Listagem
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Listagens Ativas</CardDescription>
              <CardTitle className="text-3xl">{activeListings}</CardTitle>
            </CardHeader>
            <CardContent>
              <Package className="w-5 h-5 text-primary" />
            </CardContent>
          </Card>
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
              <CardDescription>Encomendas Pendentes</CardDescription>
              <CardTitle className="text-3xl">{pendingOrders}</CardTitle>
            </CardHeader>
            <CardContent>
              <TrendingUp className="w-5 h-5 text-primary" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Saldo Disponível</CardDescription>
              <CardTitle className="text-3xl">{formatCurrency(wallet?.available_balance || 0)}</CardTitle>
            </CardHeader>
            <CardContent>
              <Wallet className="w-5 h-5 text-primary" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="listings">
          <TabsList>
            <TabsTrigger value="listings">Minhas Listagens</TabsTrigger>
            <TabsTrigger value="orders">Encomendas Recebidas</TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : listings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">Ainda não publicou nenhum produto.</p>
                  <Link to="/seller/listings/new">
                    <Button>Publicar Produto</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listings.map((listing) => (
                  <Card key={listing.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{listing.title}</CardTitle>
                        <Badge variant={listing.status === "active" ? "default" : "secondary"}>
                          {listing.status === "active" ? "Ativo" : listing.status}
                        </Badge>
                      </div>
                      <CardDescription>{listing.product_type} | {listing.category}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Preço/kg</p>
                          <p className="font-semibold">{formatCurrency(listing.price_per_kg)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Stock</p>
                          <p className="font-semibold">{listing.quantity_kg} kg</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : orders.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Ainda não recebeu nenhuma encomenda.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <Card key={order.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">Encomenda #{order.id.slice(0, 8)}</CardTitle>
                        <Badge>{order.status}</Badge>
                      </div>
                      <CardDescription>
                        {order.quantity_kg} kg • {formatCurrency(order.total_product_amount)}
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
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SellerDashboard;
