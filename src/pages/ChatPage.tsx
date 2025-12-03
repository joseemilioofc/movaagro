import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TransportChat } from "@/components/TransportChat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, MapPin, Package, Calendar, Weight, User, Phone } from "lucide-react";

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
  cooperative_id: string;
  transporter_id: string | null;
}

const ChatPage = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [request, setRequest] = useState<TransportRequest | null>(null);
  const [cooperativeName, setCooperativeName] = useState<string>("");
  const [transporterName, setTransporterName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (requestId && user) {
      fetchRequestDetails();
    }
  }, [requestId, user]);

  const fetchRequestDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("transport_requests")
        .select("*")
        .eq("id", requestId)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        navigate(-1);
        return;
      }

      setRequest(data);

      // Fetch cooperative name
      const { data: cooperativeProfile } = await supabase
        .from("profiles")
        .select("name")
        .eq("user_id", data.cooperative_id)
        .maybeSingle();
      
      if (cooperativeProfile) {
        setCooperativeName(cooperativeProfile.name);
      }

      // Fetch transporter name if assigned
      if (data.transporter_id) {
        const { data: transporterProfile } = await supabase
          .from("profiles")
          .select("name")
          .eq("user_id", data.transporter_id)
          .maybeSingle();
        
        if (transporterProfile) {
          setTransporterName(transporterProfile.name);
        }
      }
    } catch (error) {
      console.error("Error fetching request:", error);
    } finally {
      setLoading(false);
    }
  };

  const getBackPath = () => {
    switch (role) {
      case "admin":
        return "/admin";
      case "transporter":
        return "/transporter";
      case "cooperative":
        return "/cooperative";
      default:
        return "/";
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

  if (!request) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Pedido não encontrado</p>
          <Button variant="outline" onClick={() => navigate(getBackPath())} className="mt-4">
            Voltar
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(getBackPath())}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              {request.title}
            </h1>
            <p className="text-muted-foreground">Conversa sobre o pedido de transporte</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Request Details */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Detalhes do Pedido
                <Badge variant={request.status === "accepted" ? "default" : "secondary"}>
                  {request.status === "accepted" ? "Aceito" : request.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Origem</p>
                  <p className="text-sm text-muted-foreground">{request.origin_address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Destino</p>
                  <p className="text-sm text-muted-foreground">{request.destination_address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Tipo de Carga</p>
                  <p className="text-sm text-muted-foreground">{request.cargo_type}</p>
                </div>
              </div>
              {request.weight_kg && (
                <div className="flex items-start gap-3">
                  <Weight className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Peso</p>
                    <p className="text-sm text-muted-foreground">{request.weight_kg} kg</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Data de Coleta</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(request.pickup_date).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <p className="text-sm font-medium mb-3">Participantes</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm">{cooperativeName || "Cooperativa"}</p>
                      <p className="text-xs text-muted-foreground">Cooperativa</p>
                    </div>
                  </div>
                  {transporterName && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm">{transporterName}</p>
                        <p className="text-xs text-muted-foreground">Transportador</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {request.description && (
                <div className="border-t pt-4 mt-4">
                  <p className="text-sm font-medium mb-2">Descrição</p>
                  <p className="text-sm text-muted-foreground">{request.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chat */}
          <div className="lg:col-span-2">
            <TransportChat requestId={request.id} requestTitle={request.title} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChatPage;
