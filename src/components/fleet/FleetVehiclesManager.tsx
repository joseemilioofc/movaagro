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
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Truck, Pencil, Trash2 } from "lucide-react";

interface Vehicle {
  id: string;
  plate: string;
  vehicle_type: string;
  capacity_kg: number;
  year: number | null;
  brand: string | null;
  model: string | null;
  photo_url: string | null;
  document_url: string | null;
  status: string;
}

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

export const FleetVehiclesManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    plate: "",
    vehicle_type: "aberta",
    capacity_kg: "",
    year: "",
    brand: "",
    model: "",
    status: "active",
  });

  useEffect(() => {
    if (user) fetchVehicles();
  }, [user]);

  const fetchVehicles = async () => {
    setLoading(true);
    const { data } = await (supabase as any)
      .from("fleet_vehicles")
      .select("*")
      .eq("transporter_id", user!.id)
      .order("created_at", { ascending: false });
    setVehicles((data as Vehicle[]) || []);
    setLoading(false);
  };

  const openNew = () => {
    setEditing(null);
    setForm({ plate: "", vehicle_type: "aberta", capacity_kg: "", year: "", brand: "", model: "", status: "active" });
    setPhotoFile(null);
    setDocFile(null);
    setOpen(true);
  };

  const openEdit = (v: Vehicle) => {
    setEditing(v);
    setForm({
      plate: v.plate,
      vehicle_type: v.vehicle_type,
      capacity_kg: String(v.capacity_kg),
      year: v.year ? String(v.year) : "",
      brand: v.brand || "",
      model: v.model || "",
      status: v.status,
    });
    setPhotoFile(null);
    setDocFile(null);
    setOpen(true);
  };

  const uploadFile = async (file: File, kind: "photo" | "doc") => {
    const ext = file.name.split(".").pop();
    const path = `${user!.id}/vehicles/${kind}_${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("fleet-assets").upload(path, file, { upsert: true });
    if (error) throw error;
    return path;
  };

  const handleSave = async () => {
    if (!form.plate.trim() || !form.capacity_kg) {
      toast({ title: "Campos obrigatórios", description: "Matrícula e capacidade são obrigatórios.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      let photo_url = editing?.photo_url || null;
      let document_url = editing?.document_url || null;
      if (photoFile) photo_url = await uploadFile(photoFile, "photo");
      if (docFile) document_url = await uploadFile(docFile, "doc");

      const payload: any = {
        plate: form.plate.trim().toUpperCase(),
        vehicle_type: form.vehicle_type,
        capacity_kg: parseFloat(form.capacity_kg),
        year: form.year ? parseInt(form.year) : null,
        brand: form.brand || null,
        model: form.model || null,
        status: form.status,
        photo_url,
        document_url,
      };

      if (editing) {
        const { error } = await (supabase as any).from("fleet_vehicles").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await (supabase as any).from("fleet_vehicles").insert({ ...payload, transporter_id: user!.id });
        if (error) throw error;
      }
      toast({ title: editing ? "Viatura atualizada" : "Viatura cadastrada" });
      setOpen(false);
      fetchVehicles();
    } catch (err: any) {
      toast({ title: "Erro", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remover esta viatura?")) return;
    const { error } = await (supabase as any).from("fleet_vehicles").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Viatura removida" });
    fetchVehicles();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2"><Truck className="w-5 h-5 text-primary" /> Viaturas</CardTitle>
          <CardDescription>Gerencie a frota da sua empresa</CardDescription>
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
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" onClick={() => openEdit(v)}><Pencil className="w-3 h-3 mr-1" /> Editar</Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(v.id)}><Trash2 className="w-3 h-3 mr-1 text-destructive" /></Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Editar viatura" : "Nova viatura"}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Matrícula *</Label>
                <Input value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} placeholder="ABC 123 MP" />
              </div>
              <div className="space-y-1">
                <Label>Capacidade (kg) *</Label>
                <Input type="number" value={form.capacity_kg} onChange={(e) => setForm({ ...form, capacity_kg: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Tipo</Label>
                <Select value={form.vehicle_type} onValueChange={(v) => setForm({ ...form, vehicle_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{VEHICLE_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Estado</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUSES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label>Marca</Label>
                <Input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Modelo</Label>
                <Input value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Ano</Label>
                <Input type="number" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Foto da viatura</Label>
              <Input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} />
            </div>
            <div className="space-y-1">
              <Label>Documento</Label>
              <Input type="file" accept="image/*,application/pdf" onChange={(e) => setDocFile(e.target.files?.[0] || null)} />
            </div>
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
