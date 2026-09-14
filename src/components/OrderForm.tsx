import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MapPin, Truck } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface ProductListing {
  id: string;
  title: string;
  price_per_kg: number;
  quantity_kg: number;
  min_order_kg: number;
  seller_id: string;
  location: string;
}

interface OrderFormData {
  quantity_kg: string;
  delivery_address: string;
  delivery_province: string;
  delivery_district: string;
  needs_transport: boolean;
  notes: string;
}

interface OrderFormProps {
  listing: ProductListing;
  onSubmit: (data: OrderFormData) => Promise<void>;
  isSubmitting: boolean;
}

export const OrderForm = ({ listing, onSubmit, isSubmitting }: OrderFormProps) => {
  const [formData, setFormData] = useState<OrderFormData>({
    quantity_kg: String(listing.min_order_kg),
    delivery_address: "",
    delivery_province: "",
    delivery_district: "",
    needs_transport: true,
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const quantity = Number(formData.quantity_kg) || 0;
  const productAmount = quantity * listing.price_per_kg;
  const estimatedShipping = quantity * 5; // simplified estimate
  const totalAmount = productAmount + (formData.needs_transport ? estimatedShipping : 0);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      quantity_kg: String(listing.min_order_kg),
    }));
  }, [listing.min_order_kg]);

  const updateField = (field: keyof OrderFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!quantity || quantity <= 0) newErrors.quantity_kg = "Quantidade inválida";
    if (quantity < listing.min_order_kg) newErrors.quantity_kg = `Mínimo de ${listing.min_order_kg} kg`;
    if (quantity > listing.quantity_kg) newErrors.quantity_kg = `Máximo disponível: ${listing.quantity_kg} kg`;
    if (!formData.delivery_address.trim()) newErrors.delivery_address = "Endereço de entrega obrigatório";
    if (!formData.delivery_province.trim()) newErrors.delivery_province = "Província obrigatória";
    if (!formData.delivery_district.trim()) newErrors.delivery_district = "Distrito obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resumo da Listagem</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="font-semibold text-foreground">{listing.title}</p>
          <p className="text-sm text-muted-foreground">
            Preço: {formatCurrency(listing.price_per_kg)}/kg • Disponível: {listing.quantity_kg} kg • Mínimo: {listing.min_order_kg} kg
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {listing.location}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Encomenda</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quantity_kg">Quantidade (kg)</Label>
            <Input
              id="quantity_kg"
              type="number"
              value={formData.quantity_kg}
              onChange={(e) => updateField("quantity_kg", e.target.value)}
            />
            {errors.quantity_kg && <p className="text-sm text-destructive">{errors.quantity_kg}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="delivery_address">Endereço de entrega</Label>
            <Input
              id="delivery_address"
              placeholder="Rua/Avenida, número, bairro"
              value={formData.delivery_address}
              onChange={(e) => updateField("delivery_address", e.target.value)}
            />
            {errors.delivery_address && <p className="text-sm text-destructive">{errors.delivery_address}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="delivery_province">Província</Label>
              <Input
                id="delivery_province"
                placeholder="Zambézia"
                value={formData.delivery_province}
                onChange={(e) => updateField("delivery_province", e.target.value)}
              />
              {errors.delivery_province && <p className="text-sm text-destructive">{errors.delivery_province}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="delivery_district">Distrito</Label>
              <Input
                id="delivery_district"
                placeholder="Quelimane"
                value={formData.delivery_district}
                onChange={(e) => updateField("delivery_district", e.target.value)}
              />
              {errors.delivery_district && <p className="text-sm text-destructive">{errors.delivery_district}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas adicionais</Label>
            <Input
              id="notes"
              placeholder="Instruções especiais de entrega, horário preferido, etc."
              value={formData.notes}
              onChange={(e) => updateField("notes", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transporte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-lg border border-border cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => updateField("needs_transport", !formData.needs_transport)}>
            <Truck className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <p className="font-medium">Preciso de transporte</p>
              <p className="text-sm text-muted-foreground">A MOVA AGRO organiza o frete entre o vendedor e o seu endereço</p>
            </div>
            <input
              type="checkbox"
              checked={formData.needs_transport}
              onChange={(e) => updateField("needs_transport", e.target.checked)}
              className="w-5 h-5"
            />
          </div>

          <div className="space-y-2 pt-4 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Produto</span>
              <span>{formatCurrency(productAmount)}</span>
            </div>
            {formData.needs_transport && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Transporte estimado</span>
                <span>{formatCurrency(estimatedShipping)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
              <span>Total estimado</span>
              <span className="text-primary">{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        Confirmar Encomenda
      </Button>
    </form>
  );
};
