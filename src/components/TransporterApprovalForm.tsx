import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldCheck, ShieldAlert, Clock, Upload, FileCheck2, Building2 } from "lucide-react";

interface TransporterDetails {
  id: string;
  alvara_number: string;
  alvara_document_url: string;
  truck_plate: string;
  capacity_tons: number;
  body_type: string;
  approval_status: "pending" | "approved" | "rejected";
  rejection_reason: string | null;
  is_company?: boolean;
  company_name?: string | null;
  company_nuit?: string | null;
  company_address?: string | null;
}

const BODY_TYPES = [
  { value: "aberta", label: "Aberta" },
  { value: "fechada_bau", label: "Fechada / Baú" },
  { value: "frigorifica", label: "Frigorífica" },
  { value: "graneleiro", label: "Graneleiro" },
];

export const TransporterApprovalForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [details, setDetails] = useState<TransporterDetails | null>(null);
  const [alvaraNumber, setAlvaraNumber] = useState("");
  const [truckPlate, setTruckPlate] = useState("");
  const [capacityTons, setCapacityTons] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isCompany, setIsCompany] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [companyNuit, setCompanyNuit] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");

  useEffect(() => {
    if (user) fetchDetails();
  }, [user]);

  const fetchDetails = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("transporter_details")
      .select("*")
      .eq("user_id", user!.id)
      .maybeSingle();
    if (data) {
      setDetails(data as TransporterDetails);
      setAlvaraNumber(data.alvara_number);
      setTruckPlate(data.truck_plate);
      setCapacityTons(String(data.capacity_tons));
      setBodyType(data.body_type);
      setIsCompany(!!(data as any).is_company);
      setCompanyName((data as any).company_name || "");
      setCompanyNuit((data as any).company_nuit || "");
      setCompanyAddress((data as any).company_address || "");
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!alvaraNumber.trim() || !truckPlate.trim() || !capacityTons || !bodyType) {
      toast({ title: "Campos obrigatórios", description: "Preencha todos os campos.", variant: "destructive" });
      return;
    }
    const capacity = parseFloat(capacityTons);
    if (isNaN(capacity) || capacity <= 0) {
      toast({ title: "Capacidade inválida", description: "Indique um valor em toneladas maior que 0.", variant: "destructive" });
      return;
    }
    if (!details && !file) {
      toast({ title: "Foto do alvará", description: "Anexe a foto do alvará.", variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      let alvaraUrl = details?.alvara_document_url || "";
      if (file) {
        const ext = file.name.split(".").pop();
        const path = `${user.id}/alvara_${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("transporter-documents")
          .upload(path, file, { upsert: true });
        if (upErr) throw upErr;
        alvaraUrl = path;
      }

      if (details) {
        const { error } = await (supabase as any)
          .from("transporter_details")
          .update({
            alvara_number: alvaraNumber.trim(),
            alvara_document_url: alvaraUrl,
            truck_plate: truckPlate.trim().toUpperCase(),
            capacity_tons: capacity,
            body_type: bodyType,
            approval_status: "pending",
            rejection_reason: null,
            is_company: isCompany,
            company_name: isCompany ? companyName.trim() || null : null,
            company_nuit: isCompany ? companyNuit.trim() || null : null,
            company_address: isCompany ? companyAddress.trim() || null : null,
          })
          .eq("id", details.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any).from("transporter_details").insert({
          user_id: user.id,
          alvara_number: alvaraNumber.trim(),
          alvara_document_url: alvaraUrl,
          truck_plate: truckPlate.trim().toUpperCase(),
          capacity_tons: capacity,
          body_type: bodyType,
          is_company: isCompany,
          company_name: isCompany ? companyName.trim() || null : null,
          company_nuit: isCompany ? companyNuit.trim() || null : null,
          company_address: isCompany ? companyAddress.trim() || null : null,
        });
        if (error) throw error;
      }

      toast({ title: "Enviado para aprovação", description: "Aguarde a validação do administrador." });
      setFile(null);
      await fetchDetails();
    } catch (err: any) {
      toast({ title: "Erro ao guardar", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const status = details?.approval_status;
  const isApproved = status === "approved";
  const isLocked = status === "approved";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Aprovação de Transportador
            </CardTitle>
            <CardDescription>
              Só ficará visível para os agricultores após validação do administrador.
            </CardDescription>
          </div>
          {status === "pending" && (
            <Badge variant="secondary" className="gap-1">
              <Clock className="w-3 h-3" /> Em análise
            </Badge>
          )}
          {status === "approved" && (
            <Badge className="gap-1 bg-green-600 hover:bg-green-600">
              <FileCheck2 className="w-3 h-3" /> Aprovado
            </Badge>
          )}
          {status === "rejected" && (
            <Badge variant="destructive" className="gap-1">
              <ShieldAlert className="w-3 h-3" /> Rejeitado
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {status === "rejected" && details?.rejection_reason && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Motivo da rejeição</AlertTitle>
            <AlertDescription>{details.rejection_reason}</AlertDescription>
          </Alert>
        )}
        {status === "approved" && (
          <Alert className="mb-4 border-green-600/40">
            <AlertDescription>
              Os seus dados foram validados. Já pode submeter propostas aos agricultores.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="alvara">Número do Alvará *</Label>
            <Input
              id="alvara"
              value={alvaraNumber}
              onChange={(e) => setAlvaraNumber(e.target.value)}
              disabled={isLocked}
              placeholder="Ex: 64/04/01/PS/2026"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="alvara-file">
              Foto do Alvará {details ? "(opcional para substituir)" : "*"}
            </Label>
            <Input
              id="alvara-file"
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={isLocked}
            />
            {details?.alvara_document_url && !file && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Upload className="w-3 h-3" /> Documento já enviado.
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="plate">Matrícula do Camião *</Label>
              <Input
                id="plate"
                value={truckPlate}
                onChange={(e) => setTruckPlate(e.target.value)}
                disabled={isLocked}
                placeholder="Ex: ABC 123 MP"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacidade de Carga (Toneladas) *</Label>
              <Input
                id="capacity"
                type="number"
                step="0.1"
                min="0"
                value={capacityTons}
                onChange={(e) => setCapacityTons(e.target.value)}
                disabled={isLocked}
                placeholder="Ex: 10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Tipo de Carroçaria *</Label>
            <Select value={bodyType} onValueChange={setBodyType} disabled={isLocked}>
              <SelectTrigger id="body">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                {BODY_TYPES.map((b) => (
                  <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!isApproved && (
            <Button type="submit" disabled={saving} className="w-full">
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {details ? "Reenviar para aprovação" : "Submeter para aprovação"}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
