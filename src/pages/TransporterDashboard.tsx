import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Truck, Package, MapPin, Calendar, Weight, CheckCircle, XCircle, Loader2, ExternalLink, Eye } from "lucide-react";

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

const TransporterDashboard = () => {
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pendingRequests, setPendingRequests] = useState<TransportRequest[]>([]);
  const [myRequests, setMyRequests] = useState<TransportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<TransportRequest | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || role !== "transporter")) {
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
      const [pendingRes, acceptedRes] = await Promise.all([
        supabase
          .from("transport_requests")
          .select("*")
          .eq("status", "pending")
          .order("created_at", { ascending: false }),
        supabase
          .from("transport_requests")
          .select("*")
          .eq("transporter_id", user?.id)
          .order("created_at", { ascending: false }),
      ]);

      if (pendingRes.error) throw pendingRes.error;
      if (acceptedRes.error) throw acceptedRes.error;

      setPendingRequests(pendingRes.data || []);
      setMyRequests(acceptedRes.data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from("transport_requests")
        .update({ status: "accepted", transporter_id: user?.id })
        .eq("id", requestId);

      if (error) throw error;

      toast({
        title: "Pedido aceito!",
        description: "Você aceitou o pedido de transporte.",
      });

      setSelectedRequest(null);
      fetchRequests();
    } catch (error: any) {
      toast({
        title: "Erro ao aceitar pedido",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (requestId: string) => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from("transport_requests")
        .update({ status: "rejected" })
        .eq("id", requestId);

      if (error) throw error;

      toast({
        title: "Pedido recusado",
        description: "Você recusou o pedido de transporte.",
      });

      setSelectedRequest(null);
      fetchRequests();
    } catch (error: any) {
      toast({
        title: "Erro ao recusar pedido",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Pedidos Disponíveis</h1>
          <p className="text-muted-foreground mt-1">Visualize e aceite pedidos de transporte</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-light rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pedidos Disponíveis</p>
                  <p className="text-2xl font-bold">{pendingRequests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-light rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Meus Transportes</p>
                  <p className="text-2xl font-bold">{myRequests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Pedidos Disponíveis</CardTitle>
            <CardDescription>Pedidos aguardando transportadora</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingRequests.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Nenhum pedido disponível no momento</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {pendingRequests.map((request) => (
                  <Card key={request.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h4 className="font-semibold">{request.title}</h4>
                          <Badge variant="secondary">Disponível</Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{request.origin_address} → {request.destination_address}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Package className="w-4 h-4" />
                            <span>{request.cargo_type}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(request.pickup_date).toLocaleDateString("pt-BR")}</span>
                          </div>
                          {request.weight_kg && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Weight className="w-4 h-4" />
                              <span>{request.weight_kg} kg</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedRequest(request)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Detalhes
                          </Button>
                          <Button
                            size="sm"
                            className="bg-gradient-primary"
                            onClick={() => handleAccept(request.id)}
                            disabled={isProcessing}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Aceitar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Requests */}
        {myRequests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Meus Transportes</CardTitle>
              <CardDescription>Pedidos que você aceitou</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-muted/50 rounded-lg gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
                        <Truck className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{request.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {request.origin_address} → {request.destination_address}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(request.pickup_date).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <Badge variant={request.status === "accepted" ? "default" : "secondary"}>
                      {request.status === "accepted" ? "Em andamento" : request.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Request Details Dialog */}
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedRequest?.title}</DialogTitle>
              <DialogDescription>Detalhes do pedido de transporte</DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4 mt-4">
                {selectedRequest.description && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Descrição</p>
                    <p>{selectedRequest.description}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Origem</p>
                    <p>{selectedRequest.origin_address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Destino</p>
                    <p>{selectedRequest.destination_address}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tipo de Carga</p>
                    <p>{selectedRequest.cargo_type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Peso</p>
                    <p>{selectedRequest.weight_kg ? `${selectedRequest.weight_kg} kg` : "Não informado"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Data de Coleta</p>
                    <p>{new Date(selectedRequest.pickup_date).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>
                {selectedRequest.external_form_link && (
                  <div>
                    <a
                      href={selectedRequest.external_form_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Ver formulário externo
                    </a>
                  </div>
                )}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => handleReject(selectedRequest.id)}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Recusar
                  </Button>
                  <Button
                    className="flex-1 bg-gradient-primary"
                    onClick={() => handleAccept(selectedRequest.id)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                    Aceitar
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default TransporterDashboard;
