import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TransportRequestForm, TransportFormData } from "@/components/TransportRequestForm";
import { RatingDialog } from "@/components/RatingDialog";
import { GPSTrackingMap } from "@/components/GPSTrackingMap";
import { DigitalContract } from "@/components/DigitalContract";
import { useContracts } from "@/hooks/useContracts";
import { logAuditAction } from "@/hooks/useAuditLog";
import { Plus, Package, Clock, CheckCircle, XCircle, Loader2, MessageSquare, Star, MapPin, FileText } from "lucide-react";

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
  created_at: string;
  transporter_id: string | null;
}

const CooperativeDashboard = () => {
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requests, setRequests] = useState<TransportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ratingRequest, setRatingRequest] = useState<TransportRequest | null>(null);
  const [trackingRequest, setTrackingRequest] = useState<TransportRequest | null>(null);
  const [contractRequest, setContractRequest] = useState<TransportRequest | null>(null);
  const [transporterNames, setTransporterNames] = useState<Record<string, string>>({});
  const { contracts, refetch: refetchContracts } = useContracts();

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

      // Fetch transporter names for completed requests
      const transporterIds = (data || [])
        .filter(r => r.transporter_id)
        .map(r => r.transporter_id);
      
      if (transporterIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, name")
          .in("user_id", transporterIds);
        
        if (profiles) {
          const names: Record<string, string> = {};
          profiles.forEach(p => { names[p.user_id] = p.name; });
          setTransporterNames(names);
        }
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (formData: TransportFormData) => {
    setIsSubmitting(true);

    try {
      const description = [
        `Contacto: ${formData.contact}`,
        `Pessoa de contacto: ${formData.contactPerson}`,
        `Volume: ${formData.volume || "N/A"}`,
        formData.hasSpecialConditions === "sim" ? `Condições especiais: ${formData.specialConditions}` : "",
        `Urgência: ${formData.urgency}`,
        `Responsável no destino: ${formData.responsiblePerson}`,
        `Contacto no destino: ${formData.destinationContact}`,
        `Pagamento: ${formData.paymentMethod} - ${formData.whoPays === "remetente" ? "Remetente paga" : "Destinatário paga"}`,
        formData.observations ? `Observações: ${formData.observations}` : "",
      ].filter(Boolean).join("\n");

      const { data, error } = await supabase.from("transport_requests").insert({
        cooperative_id: user?.id,
        title: `${formData.productType} - ${formData.fullName}`,
        description,
        origin_address: formData.pickupLocation,
        destination_address: formData.deliveryLocation,
        cargo_type: formData.productType,
        weight_kg: formData.quantity ? parseFloat(formData.quantity.replace(/[^\d.]/g, "")) || null : null,
        pickup_date: formData.pickupDate,
      }).select().single();

      if (error) throw error;

      // Log the transport request creation
      await logAuditAction({
        action: "create",
        entityType: "transport_request",
        entityId: data?.id,
        details: {
          title: `${formData.productType} - ${formData.fullName}`,
          origin: formData.pickupLocation,
          destination: formData.deliveryLocation,
          cargo_type: formData.productType,
          pickup_date: formData.pickupDate,
          action_description: "Novo pedido de transporte criado",
        },
      });

      // Send confirmation email to cooperative
      try {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("email")
          .eq("user_id", user?.id)
          .single();

        if (profileData?.email) {
          await supabase.functions.invoke("send-transport-confirmation", {
            body: {
              email: profileData.email,
              name: formData.fullName,
              productType: formData.productType,
              quantity: formData.quantity,
              pickupLocation: formData.pickupLocation,
              deliveryLocation: formData.deliveryLocation,
              pickupDate: formData.pickupDate,
              urgency: formData.urgency,
            },
          });
        }
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }

      // Notify all transporters about the new request
      try {
        await supabase.functions.invoke("send-transport-confirmation", {
          body: {
            type: "new_request",
            productType: formData.productType,
            quantity: formData.quantity,
            pickupLocation: formData.pickupLocation,
            deliveryLocation: formData.deliveryLocation,
            pickupDate: formData.pickupDate,
            urgency: formData.urgency,
          },
        });
      } catch (emailError) {
        console.error("Failed to notify transporters:", emailError);
      }

      toast({
        title: "Pedido criado!",
        description: "Seu pedido foi criado. Um email de confirmação foi enviado.",
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Meus Pedidos</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">Gerencie seus pedidos de transporte</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Criar Pedido
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
              <DialogHeader>
                <DialogTitle>Novo Pedido de Transporte</DialogTitle>
                <DialogDescription>
                  Preencha os detalhes do seu pedido em 5 passos simples
                </DialogDescription>
              </DialogHeader>
              <TransportRequestForm onSubmit={handleCreateRequest} isSubmitting={isSubmitting} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <Card>
            <CardContent className="p-3 sm:pt-6 sm:px-6">
              <div className="flex flex-col sm:flex-row items-center sm:gap-4 text-center sm:text-left">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-light rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-0">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-sm text-muted-foreground">Total</p>
                  <p className="text-xl sm:text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:pt-6 sm:px-6">
              <div className="flex flex-col sm:flex-row items-center sm:gap-4 text-center sm:text-left">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-0">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-sm text-muted-foreground">Pendentes</p>
                  <p className="text-xl sm:text-2xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 sm:pt-6 sm:px-6">
              <div className="flex flex-col sm:flex-row items-center sm:gap-4 text-center sm:text-left">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-light rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-0">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-sm text-muted-foreground">Aceitos</p>
                  <p className="text-xl sm:text-2xl font-bold">{stats.accepted}</p>
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
                      {request.status === "accepted" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setTrackingRequest(request)}
                          >
                            <MapPin className="w-4 h-4 mr-1" />
                            GPS
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setContractRequest(request)}
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            Contrato
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/chat/${request.id}`)}
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Chat
                          </Button>
                        </>
                      )}
                      {request.status === "completed" && request.transporter_id && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setRatingRequest(request)}
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Avaliar
                        </Button>
                      )}
                      {getStatusBadge(request.status)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* GPS Tracking Dialog */}
        <Dialog open={!!trackingRequest} onOpenChange={() => setTrackingRequest(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Rastreamento GPS</DialogTitle>
              <DialogDescription>{trackingRequest?.title}</DialogDescription>
            </DialogHeader>
            {trackingRequest && (
              <GPSTrackingMap
                transportRequestId={trackingRequest.id}
                isTransporter={false}
                originAddress={trackingRequest.origin_address}
                destinationAddress={trackingRequest.destination_address}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Contract Dialog */}
        <Dialog open={!!contractRequest} onOpenChange={() => setContractRequest(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Contrato Digital</DialogTitle>
              <DialogDescription>{contractRequest?.title}</DialogDescription>
            </DialogHeader>
            {contractRequest && (
              <>
                {contracts.filter(c => c.transport_request_id === contractRequest.id).length > 0 ? (
                  contracts
                    .filter(c => c.transport_request_id === contractRequest.id)
                    .map(contract => (
                      <DigitalContract
                        key={contract.id}
                        contract={contract}
                        cooperativeName="Cooperativa"
                        transporterName={contractRequest.transporter_id ? transporterNames[contractRequest.transporter_id] : undefined}
                        onUpdate={refetchContracts}
                      />
                    ))
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Nenhum contrato disponível para este transporte.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      O contrato será gerado após a confirmação do pagamento.
                    </p>
                  </div>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Rating Dialog */}
        {ratingRequest && ratingRequest.transporter_id && (
          <RatingDialog
            open={!!ratingRequest}
            onOpenChange={() => setRatingRequest(null)}
            transportRequestId={ratingRequest.id}
            reviewedId={ratingRequest.transporter_id}
            reviewedName={transporterNames[ratingRequest.transporter_id] || "Transportadora"}
            reviewerRole="cooperative"
            onRatingSubmitted={fetchRequests}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default CooperativeDashboard;
