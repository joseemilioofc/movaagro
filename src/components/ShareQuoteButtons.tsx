import { Button } from "@/components/ui/button";
import { Share2, MessageCircle, Mail, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatMZN } from "@/lib/currency";

interface ShareQuoteButtonsProps {
  origin: string;
  destination: string;
  cargoLabel: string;
  weight: number;
  distance: number;
  priceMin: number;
  priceMax: number;
  travelTime?: string;
}

export function ShareQuoteButtons({
  origin,
  destination,
  cargoLabel,
  weight,
  distance,
  priceMin,
  priceMax,
  travelTime,
}: ShareQuoteButtonsProps) {
  const [copied, setCopied] = useState(false);

  const generateQuoteText = () => {
    const avgPrice = (priceMin + priceMax) / 2;
    return `🚚 *Cotação MOVA AGRO*

📍 *Rota:* ${origin} → ${destination}
📦 *Carga:* ${cargoLabel}
⚖️ *Peso:* ${weight} toneladas
📏 *Distância:* ${distance} km
${travelTime ? `⏱️ *Tempo estimado:* ${travelTime}\n` : ""}
💰 *Preço estimado:*
• Mínimo: ${formatMZN(priceMin)}
• Máximo: ${formatMZN(priceMax)}
• Médio: ${formatMZN(avgPrice)}

_Cotação gerada em ${new Date().toLocaleDateString("pt-MZ")}_
🌾 MOVA AGRO - Conectando o agronegócio de Moçambique`;
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(generateQuoteText());
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Cotação de Frete: ${origin} → ${destination}`);
    const body = encodeURIComponent(generateQuoteText().replace(/\*/g, "").replace(/\_/g, ""));
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateQuoteText().replace(/\*/g, "").replace(/\_/g, ""));
      setCopied(true);
      toast.success("Cotação copiada para a área de transferência!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Erro ao copiar cotação");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="w-4 h-4" />
          Compartilhar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={shareViaWhatsApp} className="cursor-pointer">
          <MessageCircle className="w-4 h-4 mr-2 text-green-500" />
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareViaEmail} className="cursor-pointer">
          <Mail className="w-4 h-4 mr-2 text-blue-500" />
          Email
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copyToClipboard} className="cursor-pointer">
          {copied ? (
            <Check className="w-4 h-4 mr-2 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 mr-2" />
          )}
          {copied ? "Copiado!" : "Copiar texto"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
