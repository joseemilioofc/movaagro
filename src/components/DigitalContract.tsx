import { useState, useRef, useMemo } from "react";
import DOMPurify from "dompurify";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
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

// Deterministic client-side verification code (FNV-1a based, no storage involved)
const computeHash = (input: string) => {
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < input.length; i++) {
    const c = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193) >>> 0;
    h2 = Math.imul(h2 + c + 0x9e3779b9, 0x85ebca6b) >>> 0;
  }
  return (h1.toString(16).padStart(8, "0") + h2.toString(16).padStart(8, "0")).toUpperCase();
};

export const DigitalContract = ({ 
  contract, 
  cooperativeName, 
  transporterName, 
  onUpdate 
}: DigitalContractProps) => {
  const { role } = useAuth();
  const { toast } = useToast();
  const [signature, setSignature] = useState("");
  const [signing, setSigning] = useState(false);
  const contractRef = useRef<HTMLDivElement>(null);

  const contractHash = useMemo(
    () => computeHash(`${contract.id}|${contract.contract_number}|${contract.terms}|${contract.price}`),
    [contract.id, contract.contract_number, contract.terms, contract.price]
  );

  const tripCode = useMemo(
    () => `VG-${contract.transport_request_id.replace(/-/g, "").slice(0, 8).toUpperCase()}`,
    [contract.transport_request_id]
  );

  const statusLabel = contract.status === "signed" ? "ASSINADO" : contract.status === "pending" ? "AGUARDANDO ASSINATURAS" : contract.status.toUpperCase();

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
      ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'p', 'div', 'span', 'strong', 'em', 'br', 'hr', 'table', 'tbody', 'tr', 'td'],
      ALLOWED_ATTR: ['style', 'class'],
    });

    const safeContractNumber = DOMPurify.sanitize(contract.contract_number);
    const safeHash = DOMPurify.sanitize(contractHash);
    const safeTrip = DOMPurify.sanitize(tripCode);
    const now = new Date();
    const printedDate = now.toLocaleDateString("pt-MZ");
    const printedTime = now.toLocaleTimeString("pt-MZ", { hour: "2-digit", minute: "2-digit" });

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="pt">
        <head>
          <meta charset="utf-8" />
          <title>Contrato ${safeContractNumber}</title>
          <style>
            @page {
              size: A4;
              margin: 18mm 16mm 22mm 16mm;
              @bottom-center {
                content: "Página " counter(page) " de " counter(pages);
                font-family: Georgia, 'Times New Roman', serif;
                font-size: 9pt;
                color: #6b7280;
              }
            }
            * { box-sizing: border-box; }
            body {
              font-family: Georgia, 'Times New Roman', serif;
              font-size: 10.5pt;
              line-height: 1.65;
              color: #111827;
              margin: 0;
            }
            h1 { font-size: 15pt; text-align: center; color: #14532d; margin: 0 0 4mm; letter-spacing: .3px; }
            h3 { font-size: 11pt; color: #14532d; margin: 6mm 0 2mm; text-transform: uppercase; letter-spacing: .5px; }
            p { margin: 0 0 2mm; text-align: justify; }
            .doc-header {
              border-bottom: 2px solid #16a34a;
              padding-bottom: 4mm;
              margin-bottom: 6mm;
            }
            .brand { font-size: 18pt; font-weight: bold; color: #16a34a; letter-spacing: 1px; }
            .brand-sub { font-size: 8.5pt; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; }
            .meta { font-size: 9pt; color: #374151; margin-top: 3mm; }
            .meta span { display: inline-block; margin-right: 8mm; }
            .info-section {
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 3mm;
              padding: 4mm 5mm;
              margin-bottom: 5mm;
            }
            .terms { white-space: pre-wrap; line-height: 1.7; text-align: justify; }
            .signature-section { margin-top: 12mm; page-break-inside: avoid; }
            .signature-box {
              width: 31%;
              display: inline-block;
              vertical-align: top;
              text-align: center;
              margin-right: 2%;
              page-break-inside: avoid;
            }
            .doc-footer {
              margin-top: 10mm;
              padding-top: 3mm;
              border-top: 1px solid #d1d5db;
              font-size: 8.5pt;
              color: #6b7280;
              page-break-inside: avoid;
            }
            .no-print { display: none !important; }
          </style>
        </head>
        <body>
          ${printContent}
          <div class="doc-footer">
            Hash de verificação: ${safeHash} &nbsp;|&nbsp; Contrato Nº ${safeContractNumber} &nbsp;|&nbsp; Viagem ${safeTrip} &nbsp;|&nbsp; Emitido em ${printedDate} às ${printedTime}
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  const emissionDate = new Date(contract.created_at);

  return (
    <Card className="border-2 border-primary/20">
      <CardContent className="space-y-4 pt-6">
        <div ref={contractRef} className="text-[13px] leading-relaxed">
          {/* Professional header */}
          <div className="doc-header" style={{ borderBottom: "2px solid #16a34a", paddingBottom: "12px", marginBottom: "20px" }}>
            <div className="brand" style={{ fontSize: "22px", fontWeight: "bold", color: "#16a34a", letterSpacing: "1px" }}>
              MOVA AGRO
            </div>
            <div className="brand-sub" style={{ fontSize: "10px", color: "#6b7280", textTransform: "uppercase", letterSpacing: "1px" }}>
              Plataforma tecnológica de intermediação de transporte agrícola
            </div>
            <div className="meta" style={{ fontSize: "11px", color: "#374151", marginTop: "10px" }}>
              <span style={{ marginRight: "24px" }}><strong>Contrato:</strong> {contract.contract_number}</span>
              <span style={{ marginRight: "24px" }}><strong>Viagem:</strong> {tripCode}</span>
              <span style={{ marginRight: "24px" }}><strong>Estado:</strong> {statusLabel}</span>
              <span><strong>Emissão:</strong> {emissionDate.toLocaleDateString("pt-MZ")}</span>
            </div>
          </div>

          <h1 style={{ textAlign: "center", color: "#14532d", marginBottom: "20px" }}>
            CONTRATO ELECTRÓNICO DE INTERMEDIAÇÃO E PRESTAÇÃO DE SERVIÇOS DE TRANSPORTE DE CARGA AGRÍCOLA
          </h1>

          <div className="info-section" style={{ background: "#f9fafb", border: "1px solid #e5e7eb", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
            <h3 style={{ marginTop: 0 }}>PARTES</h3>
            <p><strong>PLATAFORMA INTERMEDIÁRIA:</strong> MOVA AGRO, LDA — Província da Zambézia, Distrito de Quelimane, Bairro Cimento, Avenida Eduardo Mondlane, Moçambique — movaagro@gmail.com</p>
            <p><strong>CONTRATANTE (Cooperativa):</strong> {cooperativeName || "N/A"}</p>
            <p><strong>TRANSPORTADOR:</strong> {transporterName || "N/A"}</p>
          </div>

          <div className="info-section" style={{ background: "#f9fafb", border: "1px solid #e5e7eb", padding: "15px", borderRadius: "8px", marginBottom: "20px" }}>
            <h3 style={{ marginTop: 0 }}>RESUMO DO TRANSPORTE</h3>
            <p><strong>Origem:</strong> {contract.origin_address}</p>
            <p><strong>Destino:</strong> {contract.destination_address}</p>
            <p><strong>Tipo de Carga:</strong> {contract.cargo_type}</p>
            {contract.weight_kg && <p><strong>Peso:</strong> {contract.weight_kg} kg</p>}
            <p><strong>Data de Recolha:</strong> {new Date(contract.pickup_date).toLocaleDateString("pt-MZ")}</p>
            <p><strong>Valor do Transporte:</strong> {formatMZN(contract.price)}</p>
          </div>

          <div style={{ marginBottom: "30px" }}>
            <div className="terms" style={{ whiteSpace: "pre-wrap", lineHeight: 1.7, textAlign: "justify" }}>
              {contract.terms}
            </div>
          </div>

          {/* Signatures: Contratante, Transportador, MOVA AGRO */}
          <div className="signature-section" style={{ marginTop: "40px" }}>
            <div className="signature-box" style={{ width: "31%", display: "inline-block", verticalAlign: "top", textAlign: "center", marginRight: "2%" }}>
              {contract.cooperative_signature ? (
                <>
                  <p style={{ fontStyle: "italic", marginBottom: "5px" }}>{contract.cooperative_signature}</p>
                  <p style={{ fontSize: "11px", color: "#6b7280" }}>
                    {new Date(contract.cooperative_signed_at!).toLocaleDateString("pt-MZ")}
                  </p>
                </>
              ) : (
                <p style={{ color: "#9ca3af" }}>Aguardando assinatura</p>
              )}
              <div style={{ borderTop: "2px solid #000", paddingTop: "8px", marginTop: "10px" }}>
                <strong>Contratante</strong>
              </div>
            </div>
            <div className="signature-box" style={{ width: "31%", display: "inline-block", verticalAlign: "top", textAlign: "center", marginRight: "2%" }}>
              {contract.transporter_signature ? (
                <>
                  <p style={{ fontStyle: "italic", marginBottom: "5px" }}>{contract.transporter_signature}</p>
                  <p style={{ fontSize: "11px", color: "#6b7280" }}>
                    {new Date(contract.transporter_signed_at!).toLocaleDateString("pt-MZ")}
                  </p>
                </>
              ) : (
                <p style={{ color: "#9ca3af" }}>Aguardando assinatura</p>
              )}
              <div style={{ borderTop: "2px solid #000", paddingTop: "8px", marginTop: "10px" }}>
                <strong>Transportador</strong>
              </div>
            </div>
            <div className="signature-box" style={{ width: "31%", display: "inline-block", verticalAlign: "top", textAlign: "center" }}>
              <p style={{ fontStyle: "italic", marginBottom: "5px" }}>MOVA AGRO, LDA</p>
              <p style={{ fontSize: "11px", color: "#6b7280" }}>Registo electrónico {contractHash.slice(0, 8)}</p>
              <div style={{ borderTop: "2px solid #000", paddingTop: "8px", marginTop: "10px" }}>
                <strong>MOVA AGRO</strong>
                <div style={{ fontSize: "10px", color: "#6b7280" }}>Plataforma interveniente (intermediação tecnológica)</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="doc-footer" style={{ marginTop: "32px", paddingTop: "10px", borderTop: "1px solid #d1d5db", fontSize: "11px", color: "#6b7280" }}>
            Hash de verificação: {contractHash} &nbsp;|&nbsp; Contrato Nº {contract.contract_number} &nbsp;|&nbsp; {emissionDate.toLocaleDateString("pt-MZ")} às {emissionDate.toLocaleTimeString("pt-MZ", { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-4">
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" /> Contrato Digital
          </span>
          {getStatusBadge()}
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
