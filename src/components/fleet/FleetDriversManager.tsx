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
import { Loader2, Plus, Users, Pencil, Trash2 } from "lucide-react";
import { FileUploadField } from "./FileUploadField";

interface Vehicle { id: string; plate: string }

const STATUSES = [
  { value: "active", label: "Ativo" },
  { value: "inactive", label: "Inativo" },
];

const ID_DOC_TYPES = [
  { value: "bi", label: "BI" },
  { value: "passaporte", label: "Passaporte" },
  { value: "dire", label: "DIRE" },
];

const LICENSE_CATEGORIES = [
  { value: "B", label: "B - Ligeiros" },
  { value: "C", label: "C - Pesados de mercadorias" },
  { value: "D", label: "D - Pesados de passageiros" },
  { value: "CE", label: "CE - Pesados com reboque" },
  { value: "DE", label: "DE - Pesados de passageiros com reboque" },
];

const EMPTY = {
  name: "", phone: "", phone_alt: "", email: "", address: "",
  license_number: "", license_category: "C", license_expiry: "",
  license_url: "" as string | null,
  id_doc_type: "bi", id_doc_number: "", id_doc_expiry: "",
  id_doc_url: "" as string | null,
  employment_contract_url: "" as string | null,
  assigned_vehicle_id: "none", status: "active",
};

export const FleetDriversManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [drivers, setDrivers] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>(EMPTY);

  useEffect(() => { if (user) fetchAll(); }, [user]);

  const fetchAll = async () => {
    setLoading(true);
    const [d, v] = await Promise.all([
      (supabase as any).from("fleet_drivers").select("*").eq("transporter_id", user!.id).order("created_at", { ascending: false }),
      (supabase as any).from("fleet_vehicles").select("id, plate").eq("transporter_id", user!.id),
    ]);
    setDrivers(d.data || []);
    setVehicles((v.data as Vehicle[]) || []);
    setLoading(false);
  };

  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  const openNew = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (d: any) => {
    setEditing(d);
    setForm({
      ...EMPTY, ...d,
      phone: d.phone || "", phone_alt: d.phone_alt || "",
      email: d.email || "", address: d.address || "",
      license_number: d.license_number || "",
      license_category: d.license_category || "C",
      license_expiry: d.license_expiry || "",
      id_doc_type: d.id_doc_type || "bi",
      id_doc_number: d.id_doc_number || "",
      id_doc_expiry: d.id_doc_expiry || "",
      assigned_vehicle_id: d.assigned_vehicle_id || "none",
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast({ title: "Nome obrigatório", variant: "destructive" }); return; }
    setSaving(true);
    try {
      const payload: any = {
        name: form.name.trim(),
        phone: form.phone || null, phone_alt: form.phone_alt || null,
        email: form.email || null, address: form.address || null,
        license_number: form.license_number || null,
        license_category: form.license_category || null,
        license_expiry: form.license_expiry || null,
        license_url: form.license_url || null,
        id_doc_type: form.id_doc_type || null,
        id_doc_number: form.id_doc_number || null,
        id_doc_expiry: form.id_doc_expiry || null,
        id_doc_url: form.id_doc_url || null,
        employment_contract_url: form.employment_contract_url || null,
        assigned_vehicle_id: form.assigned_vehicle_id === "none" ? null : form.assigned_vehicle_id,
        status: form.status,
      };
      if (editing) {
        const { error } = await (supabase as any).from("fleet_drivers").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any).from("fleet_drivers").insert({ ...payload, transporter_id: user!.id });
        if (error) throw error;
      }
      toast({ title: editing ? "Motorista atualizado" : "Motorista cadastrado" });
      setOpen(false); fetchAll();
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remover este motorista?")) return;
    const { error } = await (supabase as any).from("fleet_drivers").delete().eq("id", id);
    if (error) { toast({ title: "Erro", description: error.message, variant: "destructive" }); return; }
    fetchAll();
  };

  const prefix = editing ? `${user!.id}/drivers/${editing.id}` : `${user!.id}/drivers/new-${Date.now()}`;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-primary" /> Motoristas</CardTitle>
          <CardDescription>Gerencie os motoristas e a sua documentação</CardDescription>
        </div>
        <Button onClick={openNew} className="bg-gradient-primary"><Plus className="w-4 h-4 mr-1" /> Novo</Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : drivers.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Sem motoristas cadastrados.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {drivers.map((d) => {
              const vehicle = vehicles.find(v => v.id === d.assigned_vehicle_id);
              return (
                <Card key={d.id}>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="font-semibold">{d.name}</p>
                        {d.phone && <p className="text-xs text-muted-foreground">{d.phone}</p>}
                      </div>
                      <Badge variant={d.status === "active" ? "default" : "secondary"}>
                        {STATUSES.find(s => s.value === d.status)?.label}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      {d.license_number && <p>Carta {d.license_category || ""}: {d.license_number}{d.license_expiry ? ` • Val. ${new Date(d.license_expiry).toLocaleDateString("pt-PT")}` : ""}</p>}
                      {vehicle && <p>Viatura: {vehicle.plate}</p>}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(d)}><Pencil className="w-3 h-3 mr-1" /> Editar</Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(d.id)}><Trash2 className="w-3 h-3 text-destructive" /></Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Editar motorista" : "Novo motorista"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1 col-span-2"><Label>Nome *</Label><Input value={form.name} onChange={(e) => set("name", e.target.value)} /></div>
              <div className="space-y-1"><Label>Telefone</Label><Input value={form.phone} onChange={(e) => set("phone", e.target.value)} /></div>
              <div className="space-y-1"><Label>Telefone alternativo</Label><Input value={form.phone_alt} onChange={(e) => set("phone_alt", e.target.value)} /></div>
              <div className="space-y-1"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} /></div>
              <div className="space-y-1">
                <Label>Estado</Label>
                <Select value={form.status} onValueChange={(v) => set("status", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1 col-span-2"><Label>Endereço</Label><Input value={form.address} onChange={(e) => set("address", e.target.value)} /></div>
              <div className="space-y-1 col-span-2">
                <Label>Viatura atribuída</Label>
                <Select value={form.assigned_vehicle_id} onValueChange={(v) => set("assigned_vehicle_id", v)}>
                  <SelectTrigger><SelectValue placeholder="Sem viatura" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sem viatura</SelectItem>
                    {vehicles.map(v => <SelectItem key={v.id} value={v.id}>{v.plate}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Accordion type="multiple" defaultValue={["license", "id"]} className="space-y-2">
              <AccordionItem value="license" className="border rounded-lg px-3">
                <AccordionTrigger className="text-sm font-semibold">Carta de Condução</AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label>Categoria</Label>
                      <Select value={form.license_category} onValueChange={(v) => set("license_category", v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{LICENSE_CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1"><Label>Nº da Carta</Label><Input value={form.license_number} onChange={(e) => set("license_number", e.target.value)} /></div>
                    <div className="space-y-1"><Label>Validade</Label><Input type="date" value={form.license_expiry} onChange={(e) => set("license_expiry", e.target.value)} /></div>
                  </div>
                  <FileUploadField label="Cópia da Carta de Condução" bucket="fleet-assets" pathPrefix={`${prefix}/license`} value={form.license_url} onChange={(v) => set("license_url", v)} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="id" className="border rounded-lg px-3">
                <AccordionTrigger className="text-sm font-semibold">Documento de Identificação</AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label>Tipo</Label>
                      <Select value={form.id_doc_type} onValueChange={(v) => set("id_doc_type", v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{ID_DOC_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1"><Label>Nº</Label><Input value={form.id_doc_number} onChange={(e) => set("id_doc_number", e.target.value)} /></div>
                    <div className="space-y-1"><Label>Validade</Label><Input type="date" value={form.id_doc_expiry} onChange={(e) => set("id_doc_expiry", e.target.value)} /></div>
                  </div>
                  <FileUploadField label="Cópia do Documento" bucket="fleet-assets" pathPrefix={`${prefix}/id-doc`} value={form.id_doc_url} onChange={(v) => set("id_doc_url", v)} />
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="contract" className="border rounded-lg px-3">
                <AccordionTrigger className="text-sm font-semibold">Contrato / Declaração de Autorização</AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2">
                  <FileUploadField
                    label="Contrato de Trabalho ou Declaração da Transportadora"
                    bucket="fleet-assets" pathPrefix={`${prefix}/contract`}
                    value={form.employment_contract_url} onChange={(v) => set("employment_contract_url", v)}
                    hint="Documento que confirme que o motorista está autorizado a operar a(s) viatura(s) da empresa."
                  />
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
