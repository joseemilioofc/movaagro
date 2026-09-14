import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { OrderForm } from "@/components/OrderForm";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatMZN } from "@/lib/currency";

const COMMISSION_SALES_PERCENT = 5;
const COMMISSION_FREIGHT_PERCENT = 20;

interface ProductListing {
  id: string;
  title: string;
  description: string | null;
  price_per_kg: number;
  quantity_kg: number;
  min_order_kg: number;
  seller_id: string;
  location: string;
  category: string;
  product_type: string;
}

const CreateOrder = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [listing, setListing] = useState<ProductListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const listingId = searchParams.get("listing");

  useEffect(() => {
    if (listingId) {
      fetchListing();
    } else {
      setLoading(false);
    }
  }, [listingId]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("product_listings")
        .select("*")
        .eq("id", listingId)
        .eq("status", "active")
        .single();

      if (error) throw error;
      setListing(data);
    } catch (error) {
      console.error("Error fetching listing:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a listagem.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    if (!user || !listing) return;

    try {
      setIsSubmitting(true);

      const quantityKg = Number(formData.quantity_kg);
      const productAmount = quantityKg * listing.price_per_kg;
      const shippingAmount = formData.needs_transport ? quantityKg * 5 : 0;
      const salesCommission = productAmount * (COMMISSION_SALES_PERCENT / 100);
      const freightCommission = shippingAmount * (COMMISSION_FREIGHT_PERCENT / 100);
      const totalAmount = productAmount + shippingAmount + salesCommission + freightCommission;

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          buyer_id: user.id,
          seller_id: listing.seller_id,
          listing_id: listing.id,
          quantity_kg: quantityKg,
          price_per_kg: listing.price_per_kg,
          total_product_amount: productAmount,
          shipping_amount: shippingAmount,
          sales_commission_percent: COMMISSION_SALES_PERCENT,
          sales_commission_amount: salesCommission,
          freight_commission_percent: COMMISSION_FREIGHT_PERCENT,
          freight_commission_amount: freightCommission,
          total_amount: totalAmount,
          delivery_address: formData.delivery_address,
          delivery_province: formData.delivery_province,
          delivery_district: formData.delivery_district,
          needs_transport: formData.needs_transport,
          notes: formData.notes,
          status: formData.needs_transport ? "pending_transport" : "pending_payment",
          payment_status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      toast({
        title: "Encomenda criada",
        description: "A sua encomenda foi registada com sucesso.",
      });

      navigate("/buyer");
    } catch (error: any) {
      console.error("Error creating order:", error);
      toast({
        title: "Erro ao criar encomenda",
        description: error.message || "Ocorreu um erro ao processar a encomenda.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!listing) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Listagem não encontrada ou indisponível.</p>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Nova Encomenda</h1>
          <p className="text-muted-foreground">Preencha os detalhes para adquirir este produto</p>
        </div>
        <OrderForm
          listing={listing}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </DashboardLayout>
  );
};

export default CreateOrder;
