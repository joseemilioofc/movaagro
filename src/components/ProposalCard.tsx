import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  DollarSign, 
  CreditCard, 
  Upload, 
  Check, 
  X, 
  Clock,
  CheckCircle2,
  Image as ImageIcon
} from "lucide-react";

interface Proposal {
  id: string;
  transport_request_id: string;
  transporter_id: string;
  description: string;
  price: number;
  mova_account: string;
  status: string;
  payment_proof_url: string | null;
  payment_code: string | null;
  admin_confirmed_at: string | null;
  created_at: string;
  transporter_name?: string;
}

interface ProposalCardProps {
  proposal: Proposal;
  onUpdate: () => void;
  requestId: string;
}

export const ProposalCard = ({ proposal, onUpdate, requestId }: ProposalCardProps) => {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [paymentCode, setPaymentCode] = useState("");
  const [paymentFile, setPaymentFile] = useState<File | null>(null);

  const handlePaymentSubmit = async () => {
    if (!paymentCode && !paymentFile) {
      toast({
        title: "Erro",
        description: "Por favor, insira o código de confirmação ou envie uma foto.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      let paymentProofUrl = null;

      if (paymentFile) {
        const fileExt = paymentFile.name.split(".").pop();
        const filePath = `${requestId}/${proposal.id}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("payment-proofs")
          .upload(filePath, paymentFile, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("payment-proofs")
          .getPublicUrl(filePath);

        paymentProofUrl = urlData.publicUrl;
      }

      const { error } = await supabase
        .from("transport_proposals")
        .update({
          status: "paid",
          payment_code: paymentCode || null,
          payment_proof_url: paymentProofUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", proposal.id);

      if (error) throw error;

      // Send notification email
      await supabase.functions.invoke("send-transport-confirmation", {
        body: {
          type: "payment_submitted",
          proposalId: proposal.id,
          requestId: requestId,
        },
      });

      toast({
        title: "Pagamento enviado!",
        description: "Aguarde a confirmação do administrador.",
      });

      onUpdate();
    } catch (error: any) {
      toast({
        title: "Erro ao enviar pagamento",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAdminConfirm = async () => {
    setConfirming(true);
    try {
      const { error } = await supabase
        .from("transport_proposals")
        .update({
          status: "confirmed",
          admin_confirmed_at: new Date().toISOString(),
          admin_confirmed_by: user?.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", proposal.id);

      if (error) throw error;

      // Send notification email
      await supabase.functions.invoke("send-transport-confirmation", {
        body: {
          type: "payment_confirmed",
          proposalId: proposal.id,
          requestId: requestId,
        },
      });

      toast({
        title: "Pagamento confirmado!",
        description: "As partes foram notificadas.",
      });

      onUpdate();
    } catch (error: any) {
      toast({
        title: "Erro ao confirmar pagamento",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setConfirming(false);
    }
  };

  const getStatusBadge = () => {
    switch (proposal.status) {
      case "pending":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Aguardando Pagamento</Badge>;
      case "paid":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-600"><Clock className="w-3 h-3 mr-1" />Aguardando Confirmação</Badge>;
      case "confirmed":
        return <Badge variant="default" className="bg-green-600"><CheckCircle2 className="w-3 h-3 mr-1" />Confirmado</Badge>;
      default:
        return <Badge variant="secondary">{proposal.status}</Badge>;
    }
  };

  return (
    <Card className="border-2 border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Proposta de Transporte
          </CardTitle>
          {getStatusBadge()}
        </div>
        <p className="text-sm text-muted-foreground">
          Enviada por: {proposal.transporter_name || "Transportador"}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Proposal Details */}
        <div className="bg-background rounded-lg p-4 space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">Descrição do Serviço</Label>
            <p className="text-sm font-medium">{proposal.description}</p>
          </div>
          <div className="flex items-center justify-between border-t pt-3">
            <div>
              <Label className="text-xs text-muted-foreground">Valor do Serviço</Label>
              <p className="text-2xl font-bold text-primary">
                {proposal.price.toLocaleString("pt-MZ", { style: "currency", currency: "MZN" })}
              </p>
            </div>
          </div>
        </div>

        {/* Mova Account Info */}
        <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="w-4 h-4 text-yellow-600" />
            <Label className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Dados para Pagamento (MOVA)
            </Label>
          </div>
          <p className="font-mono text-lg font-bold text-yellow-900 dark:text-yellow-100">
            {proposal.mova_account}
          </p>
        </div>

        {/* Payment Proof Section for Cooperative */}
        {role === "cooperative" && proposal.status === "pending" && (
          <div className="border-t pt-4 space-y-3">
            <Label className="text-sm font-medium">Comprovativo de Pagamento</Label>
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Código de Confirmação</Label>
                <Input
                  placeholder="Digite o código da transação..."
                  value={paymentCode}
                  onChange={(e) => setPaymentCode(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Foto do Comprovativo</Label>
                <div className="flex gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPaymentFile(e.target.files?.[0] || null)}
                    className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-primary file:text-primary-foreground"
                  />
                </div>
              </div>
              <Button 
                onClick={handlePaymentSubmit} 
                disabled={uploading || (!paymentCode && !paymentFile)}
                className="w-full"
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                Enviar Comprovativo
              </Button>
            </div>
          </div>
        )}

        {/* Payment Proof Display */}
        {(proposal.payment_code || proposal.payment_proof_url) && (
          <div className="border-t pt-4 space-y-3">
            <Label className="text-sm font-medium">Comprovativo Enviado</Label>
            {proposal.payment_code && (
              <div className="bg-muted rounded-lg p-3">
                <Label className="text-xs text-muted-foreground">Código</Label>
                <p className="font-mono font-bold">{proposal.payment_code}</p>
              </div>
            )}
            {proposal.payment_proof_url && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Foto do Comprovativo</Label>
                <a 
                  href={proposal.payment_proof_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img 
                    src={proposal.payment_proof_url} 
                    alt="Comprovativo de pagamento"
                    className="rounded-lg max-h-48 object-cover border"
                  />
                </a>
              </div>
            )}
          </div>
        )}

        {/* Admin Confirmation Button */}
        {role === "admin" && proposal.status === "paid" && (
          <div className="border-t pt-4">
            <Button 
              onClick={handleAdminConfirm} 
              disabled={confirming}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {confirming ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Confirmar Pagamento
            </Button>
          </div>
        )}

        {/* Confirmed Status */}
        {proposal.status === "confirmed" && (
          <div className="border-t pt-4">
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
              <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="font-medium text-green-800 dark:text-green-200">
                Pagamento Confirmado!
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                O transporte pode ser realizado.
              </p>
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-right">
          {new Date(proposal.created_at).toLocaleString("pt-BR")}
        </p>
      </CardContent>
    </Card>
  );
};