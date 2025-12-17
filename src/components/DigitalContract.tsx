import { useState, useRef } from "react";
import DOMPurify from "dompurify";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { formatMZN } from "@/lib/currency";
import { 
  FileText, 
  Pen, 
  CheckCircle2, 
  Clock, 
  Download,
  Loader2
} from "lucide-react";

interface Contract {
  id: string;
  contract_number: string;
  transport_request_id: string;
  proposal_id: string;
  cooperative_id: string;
  transporter_id: string;
  terms: string;
  price: number;
  pickup_date: string;
  origin_address: string;
  destination_address: string;
  cargo_type: string;
  weight_kg: number | null;
  cooperative_signature: string | null;
  cooperative_signed_at: string | null;
  transporter_signature: string | null;
  transporter_signed_at: string | null;
  status: string;
  created_at: string;
}

interface DigitalContractProps {
  contract: Contract;
  cooperativeName?: string;
  transporterName?: string;
  onUpdate: () => void;
}

export const DigitalContract = ({ 
  contract, 
  cooperativeName, 
  transporterName, 
  onUpdate 
}: DigitalContractProps) => {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [signature, setSignature] = useState("");
  const [signing, setSigning] = useState(false);
  const contractRef = useRef<HTMLDivElement>(null);

  const canSign = () => {
    if (role === "cooperative" && !contract.cooperative_signature) return true;
    if (role === "transporter" && !contract.transporter_signature) return true;
    return false;
  };

  const handleSign = async () => {
    if (!signature.trim()) {
      toast({
        title: "Assinatura obrigatória",
        description: "Por favor, digite seu nome completo para assinar.",
        variant: "destructive",
      });
      return;
    }

    setSigning(true);
    try {
      const updateData: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };

      if (role === "cooperative") {
        updateData.cooperative_signature = signature;
        updateData.cooperative_signed_at = new Date().toISOString();
      } else if (role === "transporter") {
        updateData.transporter_signature = signature;
        updateData.transporter_signed_at = new Date().toISOString();
      }

      // Check if both parties have signed
      const willBeFullySigned = 
        (role === "cooperative" && contract.transporter_signature) ||
        (role === "transporter" && contract.cooperative_signature);
      
      if (willBeFullySigned) {
        updateData.status = "signed";
      }

      const { error } = await supabase
        .from("digital_contracts")
        .update(updateData)
        .eq("id", contract.id);

      if (error) throw error;

      toast({
        title: "Contrato assinado!",
        description: willBeFullySigned 
          ? "O contrato foi assinado por ambas as partes." 
          : "Aguardando assinatura da outra parte.",
      });

      setSignature("");
      onUpdate();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
      toast({
        title: "Erro ao assinar",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setSigning(false);
    }
  };

  const getStatusBadge = () => {
    switch (contract.status) {
      case "pending":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Aguardando Assinaturas</Badge>;
      case "signed":
        return <Badge className="bg-green-600"><CheckCircle2 className="w-3 h-3 mr-1" />Assinado</Badge>;
      default:
        return <Badge variant="secondary">{contract.status}</Badge>;
    }
  };

  const handleDownload = () => {
    // Sanitize innerHTML to prevent XSS attacks
    const rawContent = contractRef.current?.innerHTML || "";
    const printContent = DOMPurify.sanitize(rawContent, {
      ALLOWED_TAGS: ['h1', 'h2', 'h3', 'p', 'div', 'span', 'strong', 'em', 'br', 'hr'],
      ALLOWED_ATTR: ['style', 'class'],
    });
    
    // Also sanitize the contract number for the title
    const safeContractNumber = DOMPurify.sanitize(contract.contract_number);
    
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Contrato ${safeContractNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { text-align: center; color: #16a34a; }
            .info-section { margin: 20px 0; padding: 15px; background: #f9fafb; border-radius: 8px; }
            .terms { white-space: pre-wrap; line-height: 1.6; }
            .signature-section { margin-top: 40px; display: flex; justify-content: space-between; }
            .signature-box { width: 45%; text-align: center; border-top: 2px solid #000; padding-top: 10px; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Contrato Digital
          </CardTitle>
          {getStatusBadge()}
        </div>
        <p className="text-sm text-muted-foreground font-mono">
          Nº {contract.contract_number}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div ref={contractRef}>
          <h1 style={{ textAlign: "center", color: "#16a34a", marginBottom: "20px" }}>
            CONTRATO DE TRANSPORTE DE CARGA
          </h1>
          <p style={{ textAlign: "center", marginBottom: "30px" }}>
            Contrato Nº: <strong>{contract.contract_number}</strong>
          </p>

          <div className="info-section" style={{ background: "#f9fafb", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
            <h3 style={{ marginTop: 0 }}>PARTES CONTRATANTES</h3>
            <p><strong>CONTRATANTE (Cooperativa):</strong> {cooperativeName || "N/A"}</p>
            <p><strong>CONTRATADO (Transportador):</strong> {transporterName || "N/A"}</p>
          </div>

          <div className="info-section" style={{ background: "#f9fafb", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
            <h3 style={{ marginTop: 0 }}>DETALHES DO TRANSPORTE</h3>
            <p><strong>Origem:</strong> {contract.origin_address}</p>
            <p><strong>Destino:</strong> {contract.destination_address}</p>
            <p><strong>Tipo de Carga:</strong> {contract.cargo_type}</p>
            {contract.weight_kg && <p><strong>Peso:</strong> {contract.weight_kg} kg</p>}
            <p><strong>Data de Coleta:</strong> {new Date(contract.pickup_date).toLocaleDateString("pt-MZ")}</p>
            <p><strong>Valor:</strong> {formatMZN(contract.price)}</p>
          </div>

          <div style={{ marginBottom: "30px" }}>
            <h3>TERMOS E CONDIÇÕES</h3>
            <div className="terms" style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
              {contract.terms}
            </div>
          </div>

          <div className="signature-section" style={{ marginTop: "40px", display: "flex", justifyContent: "space-between" }}>
            <div className="signature-box" style={{ width: "45%", textAlign: "center" }}>
              {contract.cooperative_signature ? (
                <>
                  <p style={{ fontStyle: "italic", marginBottom: "5px" }}>{contract.cooperative_signature}</p>
                  <p style={{ fontSize: "12px", color: "#6b7280" }}>
                    {new Date(contract.cooperative_signed_at!).toLocaleDateString("pt-MZ")}
                  </p>
                </>
              ) : (
                <p style={{ color: "#9ca3af" }}>Aguardando assinatura</p>
              )}
              <div style={{ borderTop: "2px solid #000", paddingTop: "10px", marginTop: "10px" }}>
                <strong>Cooperativa</strong>
              </div>
            </div>
            <div className="signature-box" style={{ width: "45%", textAlign: "center" }}>
              {contract.transporter_signature ? (
                <>
                  <p style={{ fontStyle: "italic", marginBottom: "5px" }}>{contract.transporter_signature}</p>
                  <p style={{ fontSize: "12px", color: "#6b7280" }}>
                    {new Date(contract.transporter_signed_at!).toLocaleDateString("pt-MZ")}
                  </p>
                </>
              ) : (
                <p style={{ color: "#9ca3af" }}>Aguardando assinatura</p>
              )}
              <div style={{ borderTop: "2px solid #000", paddingTop: "10px", marginTop: "10px" }}>
                <strong>Transportador</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Sign Section */}
        {canSign() && (
          <div className="border-t pt-4 space-y-3">
            <Label className="flex items-center gap-2">
              <Pen className="w-4 h-4" />
              Assinar Contrato
            </Label>
            <p className="text-sm text-muted-foreground">
              Digite seu nome completo para assinar eletronicamente este contrato.
            </p>
            <Input
              placeholder="Seu nome completo..."
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
            />
            <Button 
              onClick={handleSign} 
              disabled={signing || !signature.trim()}
              className="w-full"
            >
              {signing ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Pen className="w-4 h-4 mr-2" />
              )}
              Assinar Contrato
            </Button>
          </div>
        )}

        {/* Download Button */}
        <Button 
          variant="outline" 
          onClick={handleDownload}
          className="w-full"
        >
          <Download className="w-4 h-4 mr-2" />
          Baixar/Imprimir Contrato
        </Button>

        <p className="text-xs text-muted-foreground text-right">
          Criado em: {new Date(contract.created_at).toLocaleString("pt-MZ")}
        </p>
      </CardContent>
    </Card>
  );
};
