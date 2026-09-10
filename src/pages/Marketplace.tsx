import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, ShoppingCart, MapPin, Package, Store } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/currency";

interface ProductListing {
  id: string;
  seller_id: string;
  title: string;
  description: string | null;
  category: string;
  product_type: string;
  quantity_kg: number;
  min_order_kg: number;
  price_per_kg: number;
  province: string | null;
  district: string | null;
  location: string | null;
  quality_grade: string | null;
  harvest_date: string | null;
  photos: string[];
  status: string;
  created_at: string;
  seller_name?: string;
}

const CATEGORIES = ["Todos", "Grãos", "Hortícolas", "Frutas", "Fertilizantes", "Outros"];

const Marketplace = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState<ProductListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [sellerNames, setSellerNames] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("product_listings")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const activeListings = data || [];
      setListings(activeListings);

      const sellerIds = [...new Set(activeListings.map((l) => l.seller_id))];
      if (sellerIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, name")
          .in("user_id", sellerIds);

        const names: Record<string, string> = {};
        profiles?.forEach((p) => {
          names[p.user_id] = p.name;
        });
        setSellerNames(names);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(search.toLowerCase()) ||
      listing.product_type.toLowerCase().includes(search.toLowerCase()) ||
      (listing.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchesCategory = category === "Todos" || listing.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Marketplace</h1>
            <p className="text-muted-foreground">Encontre produtos agrícolas a granel de vendedores certificados</p>
          </div>
          <Link to="/seller/listings/new">
            <Button className="bg-gradient-primary text-primary-foreground">
              <Store className="w-4 h-4 mr-2" />
              Publicar Produto
            </Button>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar produto, tipo, localização..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                variant={category === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setCategory(cat)}
                className={category === cat ? "bg-gradient-primary text-primary-foreground" : ""}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredListings.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <Package className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground">Nenhum produto encontrado</h3>
              <p className="text-muted-foreground max-w-sm mt-2">
                Ainda não há produtos publicados nesta categoria. Seja o primeiro a publicar.
              </p>
              <Link to="/seller/listings/new" className="mt-6">
                <Button variant="outline">Publicar Produto</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-40 bg-muted flex items-center justify-center">
                  {listing.photos && listing.photos.length > 0 ? (
                    <img
                      src={listing.photos[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{listing.title}</CardTitle>
                    <Badge variant="secondary">{listing.category}</Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {listing.description || `${listing.product_type} disponível a granel`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-primary">
                      {formatCurrency(listing.price_per_kg)}
                    </span>
                    <span className="text-muted-foreground">/kg</span>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      <span>Min: {listing.min_order_kg} kg | Disp: {listing.quantity_kg} kg</span>
                    </div>
                    {listing.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{listing.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4" />
                      <span>{sellerNames[listing.seller_id] || "Vendedor"}</span>
                    </div>
                  </div>
                  <Link to={`/buyer/orders/new?listing=${listing.id}`}>
                    <Button className="w-full bg-gradient-primary text-primary-foreground">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Encomendar
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Marketplace;
