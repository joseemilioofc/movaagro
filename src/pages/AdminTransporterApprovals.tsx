import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle, FileText, Eye, Truck } from "lucide-react";
import { logAuditAction } from "@/hooks/useAuditLog";

interface Row {
  id: string;
  user_id: string;
  alvara_number: string;
  alvara_document_url: string;
  truck_plate: string;
  capacity_tons: number;
  body_type: string;
  approval_status: "pending" | "approved" | "rejected";
  rejection_reason: string | null;
  created_at: string;
  reviewed_at: string | null;
  profile?: { name: string; email: string; phone: string | null; company_name: string | null };
}

const BODY_LABEL: Record<string, string> = {
  aberta: "Aberta",
  fechada_bau: "Fechada / Baú",
  frigorifica: "Frigorífica",
  graneleiro: "Graneleiro",
};

const AdminTransporterApprovals = () => {
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [docUrl, setDocUrl] = useState<string | null>(null);
  const [rejectRow, setRejectRow] = useState<Row | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || role !== "admin")) navigate("/auth");
  }, [user, role, authLoading, navigate]);

  useEffect(() => {
    if (user && role === "admin") fetchData();
  }, [user, role]);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("transporter_details")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    const userIds = (data || []).map((r) => r.user_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, name, email, phone, company_name")
      .in("user_id", userIds);
    const map = new Map(profiles?.map((p) => [p.user_id, p]) || []);
    setRows((data || []).map((r) => ({ ...r, profile: map.get(r.user_id) as any })) as Row[]);
    setLoading(false);
  };

  const viewDoc = async (path: string) => {
    const { data, error } = await supabase.storage
      .from("transporter-documents")
      .createSignedUrl(path, 300);
    if (error) {
      toast({ title: "Erro ao abrir", description: error.message, variant: "destructive" });
      return;
    }
    setDocUrl(data.signedUrl);
  };

  const approve = async (row: Row) => {
    setBusy(true);
    const { error } = await supabase
      .from("transporter_details")
      .update({
        approval_status: "approved",
        rejection_reason: null,
        reviewed_by: user!.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", row.id);
    setBusy(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    await logAuditAction({ action: "accept", entityType: "user", entityId: row.user_id, details: { area: "transporter_approval" } });
    toast({ title: "Transportador aprovado" });
    fetchData();
  };

  const reject = async () => {
    if (!rejectRow || !rejectReason.trim()) return;
    setBusy(true);
    const { error } = await supabase
      .from("transporter_details")
      .update({
        approval_status: "rejected",
        rejection_reason: rejectReason.trim(),
        reviewed_by: user!.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", rejectRow.id);
    setBusy(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    await logAuditAction({ action: "reject", entityType: "user", entityId: rejectRow.user_id, details: { area: "transporter_approval", reason: rejectReason } });
    toast({ title: "Transportador rejeitado" });
    setRejectRow(null);
    setRejectReason("");
    fetchData();
  };

  const renderRow = (r: Row) => (
    <Card key={r.id}>
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start flex-wrap gap-2">
          <div>
            <p className="font-semibold flex items-center gap-2">
              <Truck className="w-4 h-4 text-primary" />
              {r.profile?.name || "Sem nome"}
              {r.profile?.company_name && <span className="text-muted-foreground font-normal">— {r.profile.company_name}</span>}
            </p>
            <p className="text-xs text-muted-foreground">{r.profile?.email} {r.profile?.phone ? `• ${r.profile.phone}` : ""}</p>
          </div>
          {r.approval_status === "pending" && <Badge variant="secondary">Pendente</Badge>}
          {r.approval_status === "approved" && <Badge className="bg-green-600 hover:bg-green-600">Aprovado</Badge>}
          {r.approval_status === "rejected" && <Badge variant="destructive">Rejeitado</Badge>}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div><p className="text-muted-foreground text-xs">Nº Alvará</p><p className="font-medium">{r.alvara_number}</p></div>
          <div><p className="text-muted-foreground text-xs">Matrícula</p><p className="font-medium">{r.truck_plate}</p></div>
          <div><p className="text-muted-foreground text-xs">Capacidade</p><p className="font-medium">{r.capacity_tons} t</p></div>
          <div><p className="text-muted-foreground text-xs">Carroçaria</p><p className="font-medium">{BODY_LABEL[r.body_type] || r.body_type}</p></div>
        </div>

        {r.rejection_reason && (
          <p className="text-xs text-destructive">Motivo: {r.rejection_reason}</p>
        )}

        <div className="flex gap-2 flex-wrap">
          <Button size="sm" variant="outline" onClick={() => viewDoc(r.alvara_document_url)}>
            <FileText className="w-4 h-4 mr-1" /> Ver alvará
          </Button>
          {r.approval_status !== "approved" && (
            <Button size="sm" onClick={() => approve(r)} disabled={busy} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="w-4 h-4 mr-1" /> Aprovar
            </Button>
          )}
          {r.approval_status !== "rejected" && (
            <Button size="sm" variant="destructive" onClick={() => setRejectRow(r)} disabled={busy}>
              <XCircle className="w-4 h-4 mr-1" /> Rejeitar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const pending = rows.filter((r) => r.approval_status === "pending");
  const approved = rows.filter((r) => r.approval_status === "approved");
  const rejected = rows.filter((r) => r.approval_status === "rejected");

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Aprovação de Transportadores</CardTitle>
            <CardDescription>Valide os dados antes de tornar o transportador visível aos agricultores.</CardDescription>
          </CardHeader>
        </Card>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <Tabs defaultValue="pending">
            <TabsList>
              <TabsTrigger value="pending">Pendentes ({pending.length})</TabsTrigger>
              <TabsTrigger value="approved">Aprovados ({approved.length})</TabsTrigger>
              <TabsTrigger value="rejected">Rejeitados ({rejected.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="pending" className="space-y-3 mt-4">
              {pending.length === 0 ? <p className="text-sm text-muted-foreground text-center py-8">Sem pedidos pendentes.</p> : pending.map(renderRow)}
            </TabsContent>
            <TabsContent value="approved" className="space-y-3 mt-4">
              {approved.length === 0 ? <p className="text-sm text-muted-foreground text-center py-8">Sem aprovados.</p> : approved.map(renderRow)}
            </TabsContent>
            <TabsContent value="rejected" className="space-y-3 mt-4">
              {rejected.length === 0 ? <p className="text-sm text-muted-foreground text-center py-8">Sem rejeitados.</p> : rejected.map(renderRow)}
            </TabsContent>
          </Tabs>
        )}
      </div>

      <Dialog open={!!docUrl} onOpenChange={(o) => !o && setDocUrl(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader><DialogTitle>Foto do Alvará</DialogTitle></DialogHeader>
          {docUrl && (
            docUrl.toLowerCase().includes(".pdf") ? (
              <iframe src={docUrl} className="w-full h-[70vh]" title="Alvará" />
            ) : (
              <img src={docUrl} alt="Alvará" className="w-full max-h-[70vh] object-contain" />
            )
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!rejectRow} onOpenChange={(o) => { if (!o) { setRejectRow(null); setRejectReason(""); } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Rejeitar transportador</DialogTitle></DialogHeader>
          <div className="space-y-2">
            <Label>Motivo da rejeição</Label>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Ex: Foto do alvará ilegível, matrícula não confere..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectRow(null); setRejectReason(""); }}>Cancelar</Button>
            <Button variant="destructive" onClick={reject} disabled={busy || !rejectReason.trim()}>
              {busy && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Confirmar rejeição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminTransporterApprovals;
