import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ChevronLeft, ChevronRight, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransportFormData {
  // Page 1
  fullName: string;
  contact: string;
  pickupLocation: string;
  contactPerson: string;
  // Page 2
  productType: string;
  quantity: string;
  volume: string;
  hasSpecialConditions: string;
  specialConditions: string;
  pickupDate: string;
  urgency: string;
  // Page 3
  deliveryLocation: string;
  responsiblePerson: string;
  destinationContact: string;
  // Page 4
  paymentMethod: string;
  whoPays: string;
  // Page 5
  observations: string;
}

interface TransportRequestFormProps {
  onSubmit: (data: TransportFormData) => Promise<void>;
  isSubmitting: boolean;
}

const initialFormData: TransportFormData = {
  fullName: "",
  contact: "",
  pickupLocation: "",
  contactPerson: "",
  productType: "",
  quantity: "",
  volume: "",
  hasSpecialConditions: "nao",
  specialConditions: "",
  pickupDate: "",
  urgency: "media",
  deliveryLocation: "",
  responsiblePerson: "",
  destinationContact: "",
  paymentMethod: "",
  whoPays: "remetente",
  observations: "",
};

export const TransportRequestForm = ({ onSubmit, isSubmitting }: TransportRequestFormProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState<TransportFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalPages = 5;

  const updateField = (field: keyof TransportFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validatePage = (page: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (page) {
      case 1:
        if (!formData.fullName.trim()) newErrors.fullName = "Nome completo é obrigatório";
        if (!formData.contact.trim()) newErrors.contact = "Contacto é obrigatório";
        if (!formData.pickupLocation.trim()) newErrors.pickupLocation = "Local de recolha é obrigatório";
        if (!formData.contactPerson.trim()) newErrors.contactPerson = "Pessoa de contacto é obrigatória";
        break;
      case 2:
        if (!formData.productType.trim()) newErrors.productType = "Tipo de produto é obrigatório";
        if (!formData.quantity.trim()) newErrors.quantity = "Quantidade/peso é obrigatório";
        if (!formData.pickupDate) newErrors.pickupDate = "Data de recolha é obrigatória";
        if (!formData.urgency) newErrors.urgency = "Urgência é obrigatória";
        if (formData.hasSpecialConditions === "sim" && !formData.specialConditions.trim()) {
          newErrors.specialConditions = "Descreva as condições especiais";
        }
        break;
      case 3:
        if (!formData.deliveryLocation.trim()) newErrors.deliveryLocation = "Local de entrega é obrigatório";
        if (!formData.responsiblePerson.trim()) newErrors.responsiblePerson = "Pessoa responsável é obrigatória";
        if (!formData.destinationContact.trim()) newErrors.destinationContact = "Contacto no destino é obrigatório";
        break;
      case 4:
        if (!formData.paymentMethod) newErrors.paymentMethod = "Método de pagamento é obrigatório";
        if (!formData.whoPays) newErrors.whoPays = "Indique quem paga";
        break;
      case 5:
        // No required fields on page 5
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validatePage(currentPage)) {
      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    }
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (validatePage(currentPage)) {
      await onSubmit(formData);
      setFormData(initialFormData);
      setCurrentPage(1);
    }
  };

  const renderProgressBar = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <div
          key={page}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
            currentPage === page
              ? "bg-primary text-primary-foreground"
              : currentPage > page
              ? "bg-primary/20 text-primary"
              : "bg-muted text-muted-foreground"
          )}
        >
          {page}
        </div>
      ))}
    </div>
  );

  const renderField = (
    id: string,
    label: string,
    field: keyof TransportFormData,
    placeholder: string,
    required: boolean = false,
    type: string = "text"
  ) => (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={formData[field]}
        onChange={(e) => updateField(field, e.target.value)}
        className={errors[field] ? "border-destructive" : ""}
      />
      {errors[field] && <p className="text-xs text-destructive">{errors[field]}</p>}
    </div>
  );

  const renderPage1 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Truck className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-primary">PEDE AQUI O TRANSPORTE DA TUA CARGA COM A MOVA!!</h3>
        <p className="text-sm text-muted-foreground">
          Preencha o formulário abaixo para solicitar o transporte da sua carga. 
          A MOVA conecta cooperativas e agricultores às melhores transportadoras.
        </p>
      </div>
      <div className="space-y-4">
        {renderField("fullName", "Nome completo / Cooperativa", "fullName", "Ex: João Silva ou Cooperativa Agrícola X", true)}
        {renderField("contact", "Contacto", "contact", "Ex: +258 84 123 4567", true)}
        {renderField("pickupLocation", "Local de recolha", "pickupLocation", "Ex: Maputo, Matola", true)}
        {renderField("contactPerson", "Pessoa de contacto", "contactPerson", "Nome da pessoa responsável no local", true)}
      </div>
    </div>
  );

  const renderPage2 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center">Informações da Carga</h3>
      {renderField("productType", "Tipo de produto", "productType", "Ex: Milho, Tomate, Feijão", true)}
      <div className="grid grid-cols-2 gap-4">
        {renderField("quantity", "Quantidade / Peso", "quantity", "Ex: 500 kg", true)}
        {renderField("volume", "Volume", "volume", "Ex: 2 m³")}
      </div>
      
      <div className="space-y-2">
        <Label>Condições especiais de transporte? <span className="text-destructive">*</span></Label>
        <RadioGroup
          value={formData.hasSpecialConditions}
          onValueChange={(value) => updateField("hasSpecialConditions", value)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sim" id="special-yes" />
            <Label htmlFor="special-yes" className="cursor-pointer">Sim</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="nao" id="special-no" />
            <Label htmlFor="special-no" className="cursor-pointer">Não</Label>
          </div>
        </RadioGroup>
      </div>

      {formData.hasSpecialConditions === "sim" && (
        <div className="space-y-2">
          <Label htmlFor="specialConditions">
            Descreva as condições especiais <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="specialConditions"
            placeholder="Ex: Refrigeração, manuseio cuidadoso, etc."
            value={formData.specialConditions}
            onChange={(e) => updateField("specialConditions", e.target.value)}
            className={errors.specialConditions ? "border-destructive" : ""}
          />
          {errors.specialConditions && <p className="text-xs text-destructive">{errors.specialConditions}</p>}
        </div>
      )}

      {renderField("pickupDate", "Data de recolha", "pickupDate", "", true, "date")}

      <div className="space-y-2">
        <Label>Urgência <span className="text-destructive">*</span></Label>
        <Select value={formData.urgency} onValueChange={(value) => updateField("urgency", value)}>
          <SelectTrigger className={errors.urgency ? "border-destructive" : ""}>
            <SelectValue placeholder="Selecione a urgência" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="baixa">Baixa</SelectItem>
            <SelectItem value="media">Média</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
          </SelectContent>
        </Select>
        {errors.urgency && <p className="text-xs text-destructive">{errors.urgency}</p>}
      </div>
    </div>
  );

  const renderPage3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center">Informações de Entrega</h3>
      {renderField("deliveryLocation", "Local de entrega", "deliveryLocation", "Ex: Beira, Sofala", true)}
      {renderField("responsiblePerson", "Pessoa responsável", "responsiblePerson", "Nome do responsável pela recepção", true)}
      {renderField("destinationContact", "Contacto no destino", "destinationContact", "Ex: +258 84 987 6543", true)}
    </div>
  );

  const renderPage4 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center">Informações de Pagamento</h3>
      
      <div className="space-y-2">
        <Label>Método de pagamento <span className="text-destructive">*</span></Label>
        <Select value={formData.paymentMethod} onValueChange={(value) => updateField("paymentMethod", value)}>
          <SelectTrigger className={errors.paymentMethod ? "border-destructive" : ""}>
            <SelectValue placeholder="Selecione o método" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="carteira_movel">Carteira Móvel (M-Pesa, e-Mola)</SelectItem>
            <SelectItem value="transferencia">Transferência Bancária</SelectItem>
            <SelectItem value="outra">Outra forma</SelectItem>
          </SelectContent>
        </Select>
        {errors.paymentMethod && <p className="text-xs text-destructive">{errors.paymentMethod}</p>}
      </div>

      <div className="space-y-2">
        <Label>Quem paga o transporte? <span className="text-destructive">*</span></Label>
        <RadioGroup
          value={formData.whoPays}
          onValueChange={(value) => updateField("whoPays", value)}
          className="space-y-2"
        >
          <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="remetente" id="pay-sender" />
            <Label htmlFor="pay-sender" className="cursor-pointer flex-1">Remetente (quem envia)</Label>
          </div>
          <div className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="destinatario" id="pay-receiver" />
            <Label htmlFor="pay-receiver" className="cursor-pointer flex-1">Destinatário (quem recebe)</Label>
          </div>
        </RadioGroup>
        {errors.whoPays && <p className="text-xs text-destructive">{errors.whoPays}</p>}
      </div>
    </div>
  );

  const renderPage5 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center">Observações e Finalização</h3>
      
      <div className="space-y-2">
        <Label htmlFor="observations">Observações adicionais</Label>
        <Textarea
          id="observations"
          placeholder="Informações extras que possam ser úteis para a transportadora..."
          value={formData.observations}
          onChange={(e) => updateField("observations", e.target.value)}
          rows={4}
        />
      </div>

      <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
        <h4 className="font-medium">Resumo do Pedido:</h4>
        <p><strong>Nome:</strong> {formData.fullName || "-"}</p>
        <p><strong>Produto:</strong> {formData.productType || "-"} ({formData.quantity || "-"})</p>
        <p><strong>Rota:</strong> {formData.pickupLocation || "-"} → {formData.deliveryLocation || "-"}</p>
        <p><strong>Data:</strong> {formData.pickupDate ? new Date(formData.pickupDate).toLocaleDateString("pt-BR") : "-"}</p>
        <p><strong>Urgência:</strong> {formData.urgency === "baixa" ? "Baixa" : formData.urgency === "media" ? "Média" : "Alta"}</p>
      </div>
    </div>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 1:
        return renderPage1();
      case 2:
        return renderPage2();
      case 3:
        return renderPage3();
      case 4:
        return renderPage4();
      case 5:
        return renderPage5();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {renderProgressBar()}
      {renderCurrentPage()}
      
      <div className="flex justify-between pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </Button>
        
        {currentPage < totalPages ? (
          <Button type="button" onClick={handleNext} className="gap-2 bg-gradient-primary">
            Próximo
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            className="bg-gradient-primary"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Criar Pedido
          </Button>
        )}
      </div>
    </div>
  );
};

export type { TransportFormData };
