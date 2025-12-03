import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Plus, Package, Clock, CheckCircle, XCircle, Loader2, ExternalLink } from "lucide-react";

interface TransportRequest {
  id: string;
  title: string;
  description: string | null;
  origin_address: string;
  destination_address: string;
  cargo_type: string;
  weight_kg: number | null;
  pickup_date: string;
  status: string;
  external_form_link: string | null;
  created_at: string;
}

const CooperativeDashboard = () => {
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requests, setRequests] = useState<TransportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newRequest, setNewRequest] = useState({
    title: "",
    description: "",
    origin_address: "",
    destination_address: "",
    cargo_type: "",
    weight_kg: "",
    pickup_date: "",
    external_form_link: "",
  });

  useEffect(() => {
    if (!authLoading && (!user || role !== "cooperative")) {
      navigate("/auth");
    }
  }, [user, role, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("transport_requests")
        .select("*")
        .eq("cooperative_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("transport_requests").insert({
        cooperative_id: user?.id,
        title: newRequest.title,
        description: newRequest.description || null,
        origin_address: newRequest.origin_address,
        destination_address: newRequest.destination_address,
        cargo_type: newRequest.cargo_type,
        weight_kg: newRequest.weight_kg ? parseFloat(newRequest.weight_kg) : null,
        pickup_date: newRequest.pickup_date,
        external_form_link: newRequest.external_form_link || null,
      });

      if (error) throw error;

      toast({
        title: "Pedido criado!",
        description: "Seu pedido de transporte foi criado com sucesso.",
      });

      setNewRequest({
        title: "",
        description: "",
        origin_address: "",
        destination_address: "",
        cargo_type: "",
        weight_kg: "",
        pickup_date: "",
        external_form_link: "",
      });
      setIsDialogOpen(false);
      fetchRequests();
    } catch (error: any) {
      toast({
        title: "Erro ao criar pedido",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { label: "Pendente", variant: "secondary" },
      accepted: { label: "Aceito", variant: "default" },
      rejected: { label: "Recusado", variant: "destructive" },
      completed: { label: "Concluído", variant: "outline" },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "accepted":
        return <CheckCircle className="w-4 h-4 text-primary" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    accepted: requests.filter((r) => r.status === "accepted").length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Meus Pedidos</h1>
            <p className="text-muted-foreground mt-1">Gerencie seus pedidos de transporte</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Criar Pedido
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Novo Pedido de Transporte</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes do seu pedido de transporte
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateRequest} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Pedido</Label>
                  <Input
                    id="title"
                    placeholder="Ex: Transporte de soja"
                    value={newRequest.title}
                    onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Detalhes adicionais do transporte"
                    value={newRequest.description}
                    onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="origin">Origem</Label>
                    <Input
                      id="origin"
                      placeholder="Cidade, Estado"
                      value={newRequest.origin_address}
                      onChange={(e) => setNewRequest({ ...newRequest, origin_address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destino</Label>
                    <Input
                      id="destination"
                      placeholder="Cidade, Estado"
                      value={newRequest.destination_address}
                      onChange={(e) => setNewRequest({ ...newRequest, destination_address: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cargo">Tipo de Carga</Label>
                    <Input
                      id="cargo"
                      placeholder="Ex: Grãos, Frutas"
                      value={newRequest.cargo_type}
                      onChange={(e) => setNewRequest({ ...newRequest, cargo_type: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="Ex: 1000"
                      value={newRequest.weight_kg}
                      onChange={(e) => setNewRequest({ ...newRequest, weight_kg: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pickup_date">Data de Coleta</Label>
                  <Input
                    id="pickup_date"
                    type="date"
                    value={newRequest.pickup_date}
                    onChange={(e) => setNewRequest({ ...newRequest, pickup_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="form_link">Link do Formulário Externo (opcional)</Label>
                  <Input
                    id="form_link"
                    type="url"
                    placeholder="https://forms.google.com/..."
                    value={newRequest.external_form_link}
                    onChange={(e) => setNewRequest({ ...newRequest, external_form_link: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-primary" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Criar Pedido
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-light rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total de Pedidos</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-light rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Aceitos</p>
                  <p className="text-2xl font-bold">{stats.accepted}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requests List */}
        <Card>
          <CardHeader>
            <CardTitle>Pedidos de Transporte</CardTitle>
            <CardDescription>Lista de todos os seus pedidos</CardDescription>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Você ainda não tem pedidos</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setIsDialogOpen(true)}
                >
                  Criar primeiro pedido
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/50 rounded-lg gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
                        {getStatusIcon(request.status)}
                      </div>
                      <div>
                        <h4 className="font-medium">{request.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {request.origin_address} → {request.destination_address}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {request.cargo_type} • {new Date(request.pickup_date).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {request.external_form_link && (
                        <a
                          href={request.external_form_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1 text-sm"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Form
                        </a>
                      )}
                      {getStatusBadge(request.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CooperativeDashboard;
