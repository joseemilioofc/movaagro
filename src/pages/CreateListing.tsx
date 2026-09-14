import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ProductListingForm, ProductListingFormData } from "@/components/ProductListingForm";
import { useToast } from "@/hooks/use-toast";

const CreateListing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: ProductListingFormData) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Precisa iniciar sessão para publicar.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const { error } = await supabase.from("product_listings").insert({
        seller_id: user.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        product_type: formData.product_type,
        quantity_kg: Number(formData.quantity_kg),
        min_order_kg: Number(formData.min_order_kg),
        price_per_kg: Number(formData.price_per_kg),
        province: formData.province || null,
        district: formData.district || null,
        location: formData.location,
        quality_grade: formData.quality_grade || null,
        harvest_date: formData.harvest_date || null,
        photos: [],
        status: "active",
      });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Listagem publicada com sucesso.",
      });

      navigate("/seller");
    } catch (error: any) {
      console.error("Error creating listing:", error);
      toast({
        title: "Erro ao publicar",
        description: error.message || "Ocorreu um erro ao publicar a listagem.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Nova Listagem</h1>
          <p className="text-muted-foreground">Publique o seu produto no marketplace da MOVA AGRO</p>
        </div>
        <ProductListingForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </DashboardLayout>
  );
};

export default CreateListing;
