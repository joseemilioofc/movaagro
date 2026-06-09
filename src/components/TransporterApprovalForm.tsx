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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldCheck, ShieldAlert, Clock, FileCheck2, Building2 } from "lucide-react";
import { FileUploadField } from "@/components/fleet/FileUploadField";

const BODY_TYPES = [
  { value: "aberta", label: "Aberta" },
  { value: "fechada_bau", label: "Fechada / Baú" },
  { value: "frigorifica", label: "Frigorífica" },
  { value: "graneleiro", label: "Graneleiro" },
];

const DOC_TYPES = [
  { value: "bi", label: "BI" },
  { value: "passaporte", label: "Passaporte" },
  { value: "dire", label: "DIRE" },
];

export const TransporterApprovalForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [details, setDetails] = useState<any>(null);
  const [form, setForm] = useState<any>({
    is_company: false,
    company_name: "", company_nuit: "", company_address: "",
    alvara_number: "", alvara_document_url: "", alvara_expiry: "",
    commercial_registry_number: "", commercial_registry_url: "",
    legal_rep_name: "", legal_rep_role: "", legal_rep_doc_type: "bi",
    legal_rep_doc_number: "", legal_rep_doc_url: "",
    tax_clearance_url: "", tax_clearance_expiry: "",
    civil_insurance_company: "", civil_insurance_number: "",
    civil_insurance_expiry: "", civil_insurance_url: "",
    truck_plate: "", capacity_tons: "", body_type: "",
  });

  useEffect(() => { if (user) fetchDetails(); }, [user]);

  const fetchDetails = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("transporter_details")
      .select("*")
      .eq("user_id", user!.id)
      .maybeSingle();
    if (data) {
      setDetails(data);
      const d: any = data;
      setForm({
        is_company: !!d.is_company,
        company_name: d.company_name || "",
        company_nuit: d.company_nuit || "",
        company_address: d.company_address || "",
        alvara_number: d.alvara_number || "",
        alvara_document_url: d.alvara_document_url || "",
        alvara_expiry: d.alvara_expiry || "",
        commercial_registry_number: d.commercial_registry_number || "",
        commercial_registry_url: d.commercial_registry_url || "",
        legal_rep_name: d.legal_rep_name || "",
        legal_rep_role: d.legal_rep_role || "",
        legal_rep_doc_type: d.legal_rep_doc_type || "bi",
        legal_rep_doc_number: d.legal_rep_doc_number || "",
        legal_rep_doc_url: d.legal_rep_doc_url || "",
        tax_clearance_url: d.tax_clearance_url || "",
        tax_clearance_expiry: d.tax_clearance_expiry || "",
        civil_insurance_company: d.civil_insurance_company || "",
        civil_insurance_number: d.civil_insurance_number || "",
        civil_insurance_expiry: d.civil_insurance_expiry || "",
        civil_insurance_url: d.civil_insurance_url || "",
        truck_plate: d.truck_plate || "",
        capacity_tons: d.capacity_tons ? String(d.capacity_tons) : "",
        body_type: d.body_type || "",
      });
    }
    setLoading(false);
  };

  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.alvara_number.trim()) {
      toast({ title: "Nº do alvará é obrigatório", variant: "destructive" }); return;
    }
    if (!form.alvara_document_url) {
      toast({ title: "Foto do alvará é obrigatória", variant: "destructive" }); return;
    }
    if (form.is_company) {
      if (!form.company_name.trim() || !form.company_nuit.trim()) {
        toast({ title: "Nome e NUIT da empresa são obrigatórios", variant: "destructive" }); return;
      }
      if (!form.legal_rep_name.trim() || !form.legal_rep_doc_url) {
        toast({ title: "Dados do representante legal incompletos", description: "Indique o nome e anexe o documento.", variant: "destructive" }); return;
      }
      if (!form.commercial_registry_url) {
        toast({ title: "Certidão comercial é obrigatória", variant: "destructive" }); return;
      }
    } else {
      if (!form.truck_plate.trim() || !form.capacity_tons || !form.body_type) {
        toast({ title: "Preencha os dados da viatura", variant: "destructive" }); return;
      }
    }

    setSaving(true);
    try {
      const payload: any = {
        is_company: form.is_company,
        company_name: form.is_company ? form.company_name.trim() : null,
        company_nuit: form.is_company ? form.company_nuit.trim() : null,
        company_address: form.is_company ? form.company_address.trim() || null : null,
        alvara_number: form.alvara_number.trim(),
        alvara_document_url: form.alvara_document_url,
        alvara_expiry: form.alvara_expiry || null,
        commercial_registry_number: form.commercial_registry_number.trim() || null,
        commercial_registry_url: form.commercial_registry_url || null,
        legal_rep_name: form.legal_rep_name.trim() || null,
        legal_rep_role: form.legal_rep_role.trim() || null,
        legal_rep_doc_type: form.legal_rep_doc_type || null,
        legal_rep_doc_number: form.legal_rep_doc_number.trim() || null,
        legal_rep_doc_url: form.legal_rep_doc_url || null,
        tax_clearance_url: form.tax_clearance_url || null,
        tax_clearance_expiry: form.tax_clearance_expiry || null,
        civil_insurance_company: form.civil_insurance_company.trim() || null,
        civil_insurance_number: form.civil_insurance_number.trim() || null,
        civil_insurance_expiry: form.civil_insurance_expiry || null,
        civil_insurance_url: form.civil_insurance_url || null,
        truck_plate: (form.truck_plate || "PENDING").trim().toUpperCase(),
        capacity_tons: form.capacity_tons ? parseFloat(form.capacity_tons) : 0,
        body_type: form.body_type || "aberta",
        approval_status: "pending",
        rejection_reason: null,
      };

      if (details) {
        const { error } = await (supabase as any)
          .from("transporter_details").update(payload).eq("id", details.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any)
          .from("transporter_details").insert({ user_id: user.id, ...payload });
        if (error) throw error;
      }

      toast({ title: "Enviado para aprovação", description: "Aguarde a validação do administrador." });
      await fetchDetails();
    } catch (err: any) {
      toast({ title: "Erro ao guardar", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Card><CardContent className="py-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></CardContent></Card>;
  }

  const status = details?.approval_status;
  const isApproved = status === "approved";
  const isLocked = isApproved;
  const prefix = `${user!.id}/company`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" /> Aprovação de Transportador
            </CardTitle>
            <CardDescription>Só ficará visível para os agricultores após validação do administrador.</CardDescription>
          </div>
          {status === "pending" && <Badge variant="secondary" className="gap-1"><Clock className="w-3 h-3" /> Em análise</Badge>}
          {status === "approved" && <Badge className="gap-1 bg-green-600 hover:bg-green-600"><FileCheck2 className="w-3 h-3" /> Aprovado</Badge>}
          {status === "rejected" && <Badge variant="destructive" className="gap-1"><ShieldAlert className="w-3 h-3" /> Rejeitado</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        {status === "rejected" && details?.rejection_reason && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Motivo da rejeição</AlertTitle>
            <AlertDescription>{details.rejection_reason}</AlertDescription>
          </Alert>
        )}
        {isApproved && (
          <Alert className="mb-4 border-green-600/40">
            <AlertDescription>Os seus dados foram validados. Já pode submeter propostas aos agricultores.</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-lg border p-4 space-y-3 bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                <Label htmlFor="is-company" className="cursor-pointer">Sou empresa de transporte com frota</Label>
              </div>
              <Switch id="is-company" checked={form.is_company} onCheckedChange={(v) => set("is_company", v)} disabled={isLocked} />
            </div>
            {form.is_company && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="space-y-1"><Label>Nome da Empresa *</Label><Input value={form.company_name} onChange={(e) => set("company_name", e.target.value)} disabled={isLocked} placeholder="Ex: MOVA AGRO, LDA" /></div>
                <div className="space-y-1"><Label>NUIT *</Label><Input value={form.company_nuit} onChange={(e) => set("company_nuit", e.target.value)} disabled={isLocked} placeholder="9 dígitos" /></div>
                <div className="space-y-1 md:col-span-2"><Label>Endereço da sede</Label><Input value={form.company_address} onChange={(e) => set("company_address", e.target.value)} disabled={isLocked} /></div>
              </div>
            )}
          </div>

          <Accordion type="multiple" defaultValue={["alvara", form.is_company ? "company-docs" : "vehicle"]} className="space-y-2">
            {/* Alvará */}
            <AccordionItem value="alvara" className="border rounded-lg px-3">
              <AccordionTrigger className="text-sm font-semibold">Alvará / Licença de Transporte *</AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1"><Label>Número do Alvará *</Label><Input value={form.alvara_number} onChange={(e) => set("alvara_number", e.target.value)} disabled={isLocked} placeholder="Ex: 64/04/01/PS/2026" /></div>
                  <div className="space-y-1"><Label>Validade</Label><Input type="date" value={form.alvara_expiry} onChange={(e) => set("alvara_expiry", e.target.value)} disabled={isLocked} /></div>
                </div>
                <FileUploadField label="Cópia do Alvará" bucket="transporter-documents" pathPrefix={`${prefix}/alvara`} value={form.alvara_document_url} onChange={(v) => set("alvara_document_url", v)} disabled={isLocked} required />
              </AccordionContent>
            </AccordionItem>

            {form.is_company && (
              <>
                {/* Empresa - documentos */}
                <AccordionItem value="company-docs" className="border rounded-lg px-3">
                  <AccordionTrigger className="text-sm font-semibold">Documentos da Empresa *</AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-2">
                    <div className="space-y-1"><Label>Nº da Certidão de Registo Comercial</Label><Input value={form.commercial_registry_number} onChange={(e) => set("commercial_registry_number", e.target.value)} disabled={isLocked} /></div>
                    <FileUploadField label="Certidão de Registo Comercial" bucket="transporter-documents" pathPrefix={`${prefix}/commercial`} value={form.commercial_registry_url} onChange={(v) => set("commercial_registry_url", v)} disabled={isLocked} required />
                    <FileUploadField label="Comprovativo de Situação Fiscal Regular" bucket="transporter-documents" pathPrefix={`${prefix}/tax`} value={form.tax_clearance_url} onChange={(v) => set("tax_clearance_url", v)} disabled={isLocked} hint="Opcional, quando aplicável" />
                    {form.tax_clearance_url && (
                      <div className="space-y-1"><Label>Validade da Situação Fiscal</Label><Input type="date" value={form.tax_clearance_expiry} onChange={(e) => set("tax_clearance_expiry", e.target.value)} disabled={isLocked} /></div>
                    )}
                  </AccordionContent>
                </AccordionItem>

                {/* Representante Legal */}
                <AccordionItem value="legal-rep" className="border rounded-lg px-3">
                  <AccordionTrigger className="text-sm font-semibold">Representante Legal *</AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1"><Label>Nome completo *</Label><Input value={form.legal_rep_name} onChange={(e) => set("legal_rep_name", e.target.value)} disabled={isLocked} /></div>
                      <div className="space-y-1"><Label>Cargo</Label><Input value={form.legal_rep_role} onChange={(e) => set("legal_rep_role", e.target.value)} disabled={isLocked} placeholder="Ex: Sócio Gerente" /></div>
                      <div className="space-y-1">
                        <Label>Tipo de Documento</Label>
                        <Select value={form.legal_rep_doc_type} onValueChange={(v) => set("legal_rep_doc_type", v)} disabled={isLocked}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{DOC_TYPES.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1"><Label>Nº do Documento</Label><Input value={form.legal_rep_doc_number} onChange={(e) => set("legal_rep_doc_number", e.target.value)} disabled={isLocked} /></div>
                    </div>
                    <FileUploadField label="Cópia do Documento de Identificação" bucket="transporter-documents" pathPrefix={`${prefix}/legal-rep`} value={form.legal_rep_doc_url} onChange={(v) => set("legal_rep_doc_url", v)} disabled={isLocked} required />
                  </AccordionContent>
                </AccordionItem>

                {/* Seguro */}
                <AccordionItem value="insurance" className="border rounded-lg px-3">
                  <AccordionTrigger className="text-sm font-semibold">Seguro de Responsabilidade Civil</AccordionTrigger>
                  <AccordionContent className="space-y-3 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1"><Label>Seguradora</Label><Input value={form.civil_insurance_company} onChange={(e) => set("civil_insurance_company", e.target.value)} disabled={isLocked} /></div>
                      <div className="space-y-1"><Label>Nº da Apólice</Label><Input value={form.civil_insurance_number} onChange={(e) => set("civil_insurance_number", e.target.value)} disabled={isLocked} /></div>
                      <div className="space-y-1"><Label>Validade</Label><Input type="date" value={form.civil_insurance_expiry} onChange={(e) => set("civil_insurance_expiry", e.target.value)} disabled={isLocked} /></div>
                    </div>
                    <FileUploadField label="Apólice de Seguro" bucket="transporter-documents" pathPrefix={`${prefix}/civil-insurance`} value={form.civil_insurance_url} onChange={(v) => set("civil_insurance_url", v)} disabled={isLocked} hint="Opcional, se existir" />
                  </AccordionContent>
                </AccordionItem>
              </>
            )}

            {!form.is_company && (
              <AccordionItem value="vehicle" className="border rounded-lg px-3">
                <AccordionTrigger className="text-sm font-semibold">Dados da Viatura *</AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1"><Label>Matrícula *</Label><Input value={form.truck_plate} onChange={(e) => set("truck_plate", e.target.value)} disabled={isLocked} placeholder="ABC 123 MP" /></div>
                    <div className="space-y-1"><Label>Capacidade (toneladas) *</Label><Input type="number" step="0.1" value={form.capacity_tons} onChange={(e) => set("capacity_tons", e.target.value)} disabled={isLocked} /></div>
                  </div>
                  <div className="space-y-1">
                    <Label>Tipo de Carroçaria *</Label>
                    <Select value={form.body_type} onValueChange={(v) => set("body_type", v)} disabled={isLocked}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>{BODY_TYPES.map(b => <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>

          {form.is_company && (
            <Alert>
              <AlertDescription className="text-xs">
                As viaturas e motoristas (incluindo livrete, inspeção, seguro, carta de condução, BI e declaração de vinculação) são cadastrados depois da aprovação, no painel de gestão de frota.
              </AlertDescription>
            </Alert>
          )}

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
