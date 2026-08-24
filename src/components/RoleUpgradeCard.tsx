import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Package, Truck, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

type UpgradeRole = "cooperative" | "transporter";

export function RoleUpgradeCard() {
  const { user, roles } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [saving, setSaving] = useState<UpgradeRole | null>(null);

  const hasCoop = roles.includes("cooperative");
  const hasTransporter = roles.includes("transporter");

  const addRole = async (role: UpgradeRole) => {
    if (!user) return;
    setSaving(role);
    const { error } = await supabase.from("user_roles").insert({ user_id: user.id, role });
    setSaving(null);

    if (error) {
      toast({
        title: "Não foi possível adicionar o perfil",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Perfil adicionado!",
      description:
        role === "transporter"
          ? "Complete o registo da transportadora para começar a receber pedidos."
          : "Já pode criar pedidos de transporte como cooperativa.",
    });

    try {
      localStorage.setItem("mova:active-role", role);
    } catch {
      // ignore
    }
    window.location.href = role === "transporter" ? "/transporter" : "/cooperative";
  };

  if (hasCoop && hasTransporter) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Perfil duplo activo
          </CardTitle>
          <CardDescription>
            Pode alternar entre Cooperativa e Transportadora no seletor no topo da página.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Badge variant="secondary">Cooperativa</Badge>
          <Badge variant="secondary">Transportadora</Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Adicionar perfil
        </CardTitle>
        <CardDescription>
          Ative um perfil adicional na mesma conta. Os requisitos de cada perfil continuam a
          aplicar-se.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasCoop && (
          <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
            <div className="space-y-1">
              <p className="font-medium flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" /> Perfil de Cooperativa
              </p>
              <p className="text-sm text-muted-foreground">
                Permite criar pedidos de transporte, negociar propostas e assinar contratos.
                Requer perfil completo (nome, telefone e organização).
              </p>
            </div>
            <Button
              onClick={() => addRole("cooperative")}
              disabled={saving !== null}
              className="bg-gradient-primary shrink-0"
            >
              {saving === "cooperative" && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Activar
            </Button>
          </div>
        )}

        {!hasTransporter && (
          <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
            <div className="space-y-1">
              <p className="font-medium flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary" /> Perfil de Transportadora
              </p>
              <p className="text-sm text-muted-foreground">
                Permite responder a pedidos e gerir frota. Após activar, é necessário submeter
                alvará, matrícula, capacidade e tipo de carroçaria para aprovação.
              </p>
            </div>
            <Button
              onClick={() => addRole("transporter")}
              disabled={saving !== null}
              className="bg-gradient-primary shrink-0"
            >
              {saving === "transporter" && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Activar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
