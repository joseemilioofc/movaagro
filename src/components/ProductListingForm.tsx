import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload } from "lucide-react";

export interface ProductListingFormData {
  title: string;
  description: string;
  category: string;
  product_type: string;
  quantity_kg: string;
  min_order_kg: string;
  price_per_kg: string;
  province: string;
  district: string;
  location: string;
  quality_grade: string;
  harvest_date: string;
}

interface ProductListingFormProps {
  onSubmit: (data: ProductListingFormData) => Promise<void>;
  isSubmitting: boolean;
}

const CATEGORIES = ["Grãos", "Hortícolas", "Frutas", "Fertilizantes", "Outros"];
const PRODUCT_TYPES = ["Milho", "Soja", "Arroz", "Trigo", "Café", "Açúcar", "Tomate", "Cebola", "Batata", "Outro"];
const QUALITY_GRADES = ["Premium", "A", "B", "C"];

const initialFormData: ProductListingFormData = {
  title: "",
  description: "",
  category: "",
  product_type: "",
  quantity_kg: "",
  min_order_kg: "100",
  price_per_kg: "",
  province: "",
  district: "",
  location: "",
  quality_grade: "",
  harvest_date: "",
};

export const ProductListingForm = ({ onSubmit, isSubmitting }: ProductListingFormProps) => {
  const [formData, setFormData] = useState<ProductListingFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: keyof ProductListingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Título é obrigatório";
    if (!formData.category) newErrors.category = "Categoria é obrigatória";
    if (!formData.product_type) newErrors.product_type = "Tipo de produto é obrigatório";
    if (!formData.quantity_kg || Number(formData.quantity_kg) <= 0) newErrors.quantity_kg = "Quantidade inválida";
    if (!formData.min_order_kg || Number(formData.min_order_kg) <= 0) newErrors.min_order_kg = "Quantidade mínima inválida";
    if (!formData.price_per_kg || Number(formData.price_per_kg) <= 0) newErrors.price_per_kg = "Preço inválido";
    if (!formData.location.trim()) newErrors.location = "Localização é obrigatória";

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
          <CardTitle>Informações do Produto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título da listagem</Label>
            <Input
              id="title"
              placeholder="Ex: Milho branco premium da Zambézia"
              value={formData.title}
              onChange={(e) => updateField("title", e.target.value)}
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva o produto, qualidade, origem, etc."
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={formData.category} onValueChange={(value) => updateField("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
            </div>

            <div className="space-y-2">
              <Label>Tipo de Produto</Label>
              <Select value={formData.product_type} onValueChange={(value) => updateField("product_type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.product_type && <p className="text-sm text-destructive">{errors.product_type}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity_kg">Quantidade disponível (kg)</Label>
              <Input
                id="quantity_kg"
                type="number"
                placeholder="5000"
                value={formData.quantity_kg}
                onChange={(e) => updateField("quantity_kg", e.target.value)}
              />
              {errors.quantity_kg && <p className="text-sm text-destructive">{errors.quantity_kg}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="min_order_kg">Quantidade mínima (kg)</Label>
              <Input
                id="min_order_kg"
                type="number"
                placeholder="100"
                value={formData.min_order_kg}
                onChange={(e) => updateField("min_order_kg", e.target.value)}
              />
              {errors.min_order_kg && <p className="text-sm text-destructive">{errors.min_order_kg}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price_per_kg">Preço por kg (MZN)</Label>
              <Input
                id="price_per_kg"
                type="number"
                placeholder="25"
                value={formData.price_per_kg}
                onChange={(e) => updateField("price_per_kg", e.target.value)}
              />
              {errors.price_per_kg && <p className="text-sm text-destructive">{errors.price_per_kg}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Localização e Qualidade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Localização</Label>
              <Input
                id="location"
                placeholder="Ex: Quelimane, Zambézia"
                value={formData.location}
                onChange={(e) => updateField("location", e.target.value)}
              />
              {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
            </div>

            <div className="space-y-2">
              <Label>Qualidade</Label>
              <Select value={formData.quality_grade} onValueChange={(value) => updateField("quality_grade", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  {QUALITY_GRADES.map((grade) => (
                    <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="harvest_date">Data de colheita</Label>
            <Input
              id="harvest_date"
              type="date"
              value={formData.harvest_date}
              onChange={(e) => updateField("harvest_date", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
        Publicar Listagem
      </Button>
    </form>
  );
};
