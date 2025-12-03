import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, DollarSign } from "lucide-react";

interface ProposalFormProps {
  requestId: string;
  onProposalSent: () => void;
}

export const ProposalForm = ({ requestId, onProposalSent }: ProposalFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim() || !price) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha a descrição e o valor.",
        variant: "destructive",
      });
      return;
    }

    const priceNumber = parseFloat(price.replace(",", "."));
    if (isNaN(priceNumber) || priceNumber <= 0) {
      toast({
        title: "Valor inválido",
        description: "Por favor, insira um valor válido.",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    try {
      const { error } = await supabase.from("transport_proposals").insert({
        transport_request_id: requestId,
        transporter_id: user?.id,
        description: description.trim(),
        price: priceNumber,
        mova_account: "863343229 J*** P**** E*****",
      });

      if (error) throw error;

      // Send notification email
      await supabase.functions.invoke("send-transport-confirmation", {
        body: {
          type: "proposal_sent",
          requestId: requestId,
          transporterId: user?.id,
          price: priceNumber,
          description: description.trim(),
        },
      });

      toast({
        title: "Proposta enviada!",
        description: "A cooperativa foi notificada da sua proposta.",
      });

      setDescription("");
      setPrice("");
      onProposalSent();
    } catch (error: any) {
      toast({
        title: "Erro ao enviar proposta",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="border-dashed border-2 border-primary/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-primary" />
          Enviar Proposta de Trabalho
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="description">Descrição do Serviço</Label>
            <Textarea
              id="description"
              placeholder="Descreva os detalhes do serviço, veículo disponível, condições, etc..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="price">Valor (AOA)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                Kz
              </span>
              <Input
                id="price"
                type="text"
                placeholder="0,00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-sm">
            <p className="font-medium">Conta MOVA para pagamento:</p>
            <p className="font-mono">863343229 J*** P**** E*****</p>
          </div>
          <Button type="submit" disabled={sending} className="w-full">
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Send className="w-4 h-4 mr-2" />
            )}
            Enviar Proposta
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};