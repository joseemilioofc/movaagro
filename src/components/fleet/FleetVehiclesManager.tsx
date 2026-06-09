import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Truck, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { FileUploadField } from "./FileUploadField";

const VEHICLE_TYPES = [
  { value: "aberta", label: "Aberta" },
  { value: "fechada_bau", label: "Fechada / Baú" },
  { value: "frigorifica", label: "Frigorífica" },
  { value: "graneleiro", label: "Graneleiro" },
  { value: "cisterna", label: "Cisterna" },
];

const STATUSES = [
  { value: "active", label: "Ativa" },
  { value: "maintenance", label: "Manutenção" },
  { value: "inactive", label: "Inativa" },
];

const EMPTY = {
  plate: "", vehicle_type: "aberta", capacity_kg: "", year: "",
  brand: "", model: "", status: "active",
  photo_url: "" as string | null,
  livrete_number: "", livrete_url: "" as string | null,
  ownership_doc_url: "" as string | null,
  transport_license_number: "", transport_license_expiry: "",
  transport_license_url: "" as string | null,
  inspection_date: "", inspection_expiry: "",
  inspection_url: "" as string | null,
  insurance_company: "", insurance_number: "", insurance_expiry: "",
  insurance_url: "" as string | null,
  photo_front_url: "" as string | null,
  photo_side_url: "" as string | null,
  photo_rear_url: "" as string | null,
  photo_plate_url: "" as string | null,
  binding_declaration_url: "" as string | null,
};

const expiryBadge = (date: string | null) => {
  if (!date) return null;
  const days = Math.floor((new Date(date).getTime() - Date.now()) / 86400000);
  if (days < 0) return <Badge variant="destructive" className="text-[10px]"><AlertTriangle className="w-2.5 h-2.5 mr-0.5" />Expirado</Badge>;
  if (days < 30) return <Badge className="text-[10px] bg-amber-500 hover:bg-amber-500"><AlertTriangle className="w-2.5 h-2.5 mr-0.5" />{days}d</Badge>;
  return null;
};

export const FleetVehiclesManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>(EMPTY);

  useEffect(() => { if (user) fetchVehicles(); }, [user]);

  const fetchVehicles = async () => {
    setLoading(true);
    const { data } = await (supabase as any)
      .from("fleet_vehicles").select("*")
      .eq("transporter_id", user!.id).order("created_at", { ascending: false });
    setVehicles(data || []);
    setLoading(false);
  };

  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  const openNew = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (v: any) => {
    setEditing(v);
    setForm({
      ...EMPTY, ...v,
      capacity_kg: String(v.capacity_kg || ""),
      year: v.year ? String(v.year) : "",
      brand: v.brand || "", model: v.model || "",
      transport_license_expiry: v.transport_license_expiry || "",
      inspection_date: v.inspection_date || "",
      inspection_expiry: v.inspection_expiry || "",
      insurance_expiry: v.insurance_expiry || "",
      insurance_company: v.insurance_company || "",
      insurance_number: v.insurance_number || "",
      transport_license_number: v.transport_license_number || "",
      livrete_number: v.livrete_number || "",
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.plate.trim() || !form.capacity_kg) {
      toast({ title: "Matrícula e capacidade obrigatórias", variant: "destructive" }); return;
    }
    setSaving(true);
    try {
      const payload: any = {
        plate: form.plate.trim().toUpperCase(),
        vehicle_type: form.vehicle_type,
        capacity_kg: parseFloat(form.capacity_kg),
        year: form.year ? parseInt(form.year) : null,
        brand: form.brand || null, model: form.model || null,
        status: form.status, photo_url: form.photo_url || null,
        livrete_number: form.livrete_number || null,
        livrete_url: form.livrete_url || null,
        ownership_doc_url: form.ownership_doc_url || null,
        transport_license_number: form.transport_license_number || null,
        transport_license_expiry: form.transport_license_expiry || null,
        transport_license_url: form.transport_license_url || null,
        inspection_date: form.inspection_date || null,
        inspection_expiry: form.inspection_expiry || null,
        inspection_url: form.inspection_url || null,
        insurance_company: form.insurance_company || null,
        insurance_number: form.insurance_number || null,
        insurance_expiry: form.insurance_expiry || null,
        insurance_url: form.insurance_url || null,
        photo_front_url: form.photo_front_url || null,
        photo_side_url: form.photo_side_url || null,
        photo_rear_url: form.photo_rear_url || null,
        photo_plate_url: form.photo_plate_url || null,
        binding_declaration_url: form.binding_declaration_url || null,
      };
      if (editing) {
        const { error } = await (supabase as any).from("fleet_vehicles").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any).from("fleet_vehicles").insert({ ...payload, transporter_id: user!.id });
        if (error) throw error;
      }
      toast({ title: editing ? "Viatura atualizada" : "Viatura cadastrada" });
      setOpen(false); fetchVehicles();
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remover esta viatura?")) return;
    const { error } = await (supabase as any).from("fleet_vehicles").delete().eq("id", id);
    if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    fetchVehicles();
  };

  const prefix = editing ? `${user!.id}/vehicles/${editing.id}` : `${user!.id}/vehicles/new-${Date.now()}`;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2"><Truck className="w-5 h-5 text-primary" /> Viaturas</CardTitle>
          <CardDescription>Gerencie a frota e a documentação de cada viatura</CardDescription>
        </div>
        <Button onClick={openNew} className="bg-gradient-primary"><Plus className="w-4 h-4 mr-1" /> Nova</Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : vehicles.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Sem viaturas cadastradas.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {vehicles.map((v) => (
              <Card key={v.id}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="font-semibold">{v.plate}</p>
                      <p className="text-xs text-muted-foreground">{v.brand} {v.model} {v.year ? `(${v.year})` : ""}</p>
                    </div>
                    <Badge variant={v.status === "active" ? "default" : "secondary"}>
                      {STATUSES.find(s => s.value === v.status)?.label || v.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {VEHICLE_TYPES.find(t => t.value === v.vehicle_type)?.label} • {v.capacity_kg} kg
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {v.inspection_expiry && <div className="flex items-center gap-1 text-[10px]">Inspeção {expiryBadge(v.inspection_expiry)}</div>}
                    {v.insurance_expiry && <div className="flex items-center gap-1 text-[10px]">Seguro {expiryBadge(v.insurance_expiry)}</div>}
                    {v.transport_license_expiry && <div className="flex items-center gap-1 text-[10px]">Licença {expiryBadge(v.transport_license_expiry)}</div>}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(v)}><Pencil className="w-3 h-3 mr-1" /> Editar</Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(v.id)}><Trash2 className="w-3 h-3 text-destructive" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Editar viatura" : "Nova viatura"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Matrícula *</Label><Input value={form.plate} onChange={(e) => set("plate", e.target.value)} placeholder="ABC 123 MP" /></div>
              <div className="space-y-1"><Label>Capacidade (kg) *</Label><Input type="number" value={form.capacity_kg} onChange={(e) => set("capacity_kg", e.target.value)} /></div>
              <div className="space-y-1">
                <Label>Tipo</Label>
                <Select value={form.vehicle_type} onValueChange={(v) => set("vehicle_type", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{VEHICLE_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Estado</Label>
                <Select value={form.status} onValueChange={(v) => set("status", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>Marca</Label><Input value={form.brand} onChange={(e) => set("brand", e.target.value)} /></div>
              <div className="space-y-1"><Label>Modelo</Label><Input value={form.model} onChange={(e) => set("model", e.target.value)} /></div>
              <div className="space-y-1"><Label>Ano</Label><Input type="number" value={form.year} onChange={(e) => set("year", e.target.value)} /></div>
            </div>

            <Accordion type="multiple" defaultValue={["docs"]} className="space-y-2">
              <AccordionItem value="docs" className="border rounded-lg px-3">
                <AccordionTrigger className="text-sm font-semibold">Documentos da Viatura</AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2">
                  <div className="space-y-1"><Label>Nº do Livrete / DUA</Label><Input value={form.livrete_number} onChange={(e) => set("livrete_number", e.target.value)} /></div>
                  <FileUploadField label="Livrete / DUA" bucket="fleet-assets" pathPrefix={`${prefix}/livrete`} value={form.livrete_url} onChange={(v) => set("livrete_url", v)} />
                  <FileUploadField label="Título de Propriedade / Prova de Posse" bucket="fleet-assets" pathPrefix={`${prefix}/ownership`} value={form.ownership_doc_url} onChange={(v) => set("ownership_doc_url", v)} />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><Label>Nº Licença de Transporte</Label><Input value={form.transport_license_number} onChange={(e) => set("transport_license_number", e.target.value)} /></div>
                    <div className="space-y-1"><Label>Validade Licença</Label><Input type="date" value={form.transport_license_expiry} onChange={(e) => set("transport_license_expiry", e.target.value)} /></div>
                  </div>
                  <FileUploadField label="Licença de Transporte da Viatura" bucket="fleet-assets" pathPrefix={`${prefix}/license`} value={form.transport_license_url} onChange={(v) => set("transport_license_url", v)} />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1"><Label>Data da Inspeção</Label><Input type="date" value={form.inspection_date} onChange={(e) => set("inspection_date", e.target.value)} /></div>
                    <div className="space-y-1"><Label>Validade Inspeção</Label><Input type="date" value={form.inspection_expiry} onChange={(e) => set("inspection_expiry", e.target.value)} /></div>
                  </div>
                  <FileUploadField label="Ficha de Inspeção Técnica" bucket="fleet-assets" pathPrefix={`${prefix}/inspection`} value={form.inspection_url} onChange={(v) => set("inspection_url", v)} />
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1"><Label>Seguradora</Label><Input value={form.insurance_company} onChange={(e) => set("insurance_company", e.target.value)} /></div>
                    <div className="space-y-1"><Label>Nº Apólice</Label><Input value={form.insurance_number} onChange={(e) => set("insurance_number", e.target.value)} /></div>
                    <div className="space-y-1"><Label>Validade</Label><Input type="date" value={form.insurance_expiry} onChange={(e) => set("insurance_expiry", e.target.value)} /></div>
                  </div>
                  <FileUploadField label="Apólice de Seguro" bucket="fleet-assets" pathPrefix={`${prefix}/insurance`} value={form.insurance_url} onChange={(v) => set("insurance_url", v)} />
                  <FileUploadField
                    label="Declaração de Vinculação à Transportadora"
                    bucket="fleet-assets" pathPrefix={`${prefix}/binding`}
                    value={form.binding_declaration_url} onChange={(v) => set("binding_declaration_url", v)}
                    hint="Documento assinado e carimbado pela empresa contendo matrícula, marca/modelo, proprietário e confirmação de autorização sob o alvará."
                  />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="photos" className="border rounded-lg px-3">
                <AccordionTrigger className="text-sm font-semibold">Fotografias da Viatura</AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2">
                  <FileUploadField label="Foto Principal" bucket="fleet-assets" pathPrefix={`${prefix}/photo-main`} value={form.photo_url} onChange={(v) => set("photo_url", v)} accept="image/*" />
                  <div className="grid grid-cols-2 gap-3">
                    <FileUploadField label="Frente" bucket="fleet-assets" pathPrefix={`${prefix}/photo-front`} value={form.photo_front_url} onChange={(v) => set("photo_front_url", v)} accept="image/*" />
                    <FileUploadField label="Lateral" bucket="fleet-assets" pathPrefix={`${prefix}/photo-side`} value={form.photo_side_url} onChange={(v) => set("photo_side_url", v)} accept="image/*" />
                    <FileUploadField label="Traseira" bucket="fleet-assets" pathPrefix={`${prefix}/photo-rear`} value={form.photo_rear_url} onChange={(v) => set("photo_rear_url", v)} accept="image/*" />
                    <FileUploadField label="Matrícula" bucket="fleet-assets" pathPrefix={`${prefix}/photo-plate`} value={form.photo_plate_url} onChange={(v) => set("photo_plate_url", v)} accept="image/*" />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving}>{saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
