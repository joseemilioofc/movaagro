import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, Mail, Phone, Building, Save, ShieldCheck, Clock, XCircle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres").max(100),
  phone: z.string().max(20).optional(),
  company_name: z.string().max(100).optional(),
});

interface ProfileData {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  company_name: string | null;
  identity_status: string;
  didit_session_id: string | null;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user, role, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    company_name: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      fetchProfile();
    }
  }, [user, authLoading, navigate]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setForm({
        name: data.name || "",
        phone: data.phone || "",
        company_name: data.company_name || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast({
        title: "Erro ao carregar perfil",
        description: "Não foi possível carregar seus dados.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const validation = profileSchema.safeParse(form);
      if (!validation.success) {
        toast({
          title: "Erro de validação",
          description: validation.error.errors[0].message,
          variant: "destructive",
        });
        setIsSaving(false);
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          name: form.name,
          phone: form.phone || null,
          company_name: form.company_name || null,
        })
        .eq("user_id", user?.id);

      if (error) throw error;

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message || "Não foi possível atualizar seu perfil.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleLabel = () => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "cooperative":
        return "Cooperativa";
      case "transporter":
        return "Transportadora";
      default:
        return "Usuário";
    }
  };

  if (authLoading || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Meu Perfil</h1>
          <p className="text-muted-foreground">Gerencie suas informações pessoais</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Informações Pessoais
            </CardTitle>
            <CardDescription>
              Atualize seus dados de contato e informações da conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    Nome completo
                  </Label>
                  <Input
                    id="name"
                    placeholder="Seu nome"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile?.email || ""}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    O email não pode ser alterado
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    Telefone
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+258 84 000 0000"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    Empresa/Organização
                  </Label>
                  <Input
                    id="company"
                    placeholder="Nome da empresa"
                    value={form.company_name}
                    onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                  />
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Tipo de conta:</strong> {getRoleLabel()}
                </p>
              </div>

              <Button type="submit" className="w-full sm:w-auto bg-gradient-primary" disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Salvar Alterações
              </Button>
            </form>
          </CardContent>
        </Card>

        <IdentityVerificationCard
          identityStatus={profile?.identity_status || "not_started"}
          userId={user?.id}
          onStatusUpdate={(status) => setProfile(prev => prev ? { ...prev, identity_status: status } : prev)}
        />

        <Card>
          <CardHeader>
            <CardTitle>Segurança</CardTitle>
            <CardDescription>Gerencie sua senha e segurança da conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              onClick={async () => {
                const { error } = await supabase.auth.resetPasswordForEmail(
                  profile?.email || "",
                  { redirectTo: `${window.location.origin}/reset-password` }
                );
                if (error) {
                  toast({
                    title: "Erro",
                    description: error.message,
                    variant: "destructive",
                  });
                } else {
                  toast({
                    title: "Email enviado!",
                    description: "Verifique sua caixa de entrada para redefinir sua senha.",
                  });
                }
              }}
            >
              Alterar Senha
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};
const identityStatusConfig: Record<string, { label: string; icon: React.ReactNode; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  not_started: { label: "Não iniciado", icon: <Clock className="w-4 h-4" />, variant: "secondary" },
  pending: { label: "Em verificação", icon: <Loader2 className="w-4 h-4 animate-spin" />, variant: "outline" },
  approved: { label: "Verificado", icon: <CheckCircle2 className="w-4 h-4" />, variant: "default" },
  rejected: { label: "Rejeitado", icon: <XCircle className="w-4 h-4" />, variant: "destructive" },
};

const IdentityVerificationCard = ({ identityStatus, userId, onStatusUpdate }: { identityStatus: string; userId?: string; onStatusUpdate?: (status: string) => void }) => {
  const [isStarting, setIsStarting] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const { toast } = useToast();
  const config = identityStatusConfig[identityStatus] || identityStatusConfig.not_started;
  const canVerify = identityStatus === "not_started" || identityStatus === "rejected";

  useEffect(() => {
    if (userId && identityStatus !== "approved") {
      checkStatus();
    }
  }, [userId]);

  const checkStatus = async () => {
    if (!userId) return;
    setIsCheckingStatus(true);
    try {
      const { data, error } = await supabase.functions.invoke("didit-check-status", {
        body: { user_id: userId },
      });
      if (error) throw error;
      if (data?.identity_status && data.identity_status !== identityStatus) {
        onStatusUpdate?.(data.identity_status);
      }
    } catch (error) {
      console.error("Error checking identity status:", error);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleStartVerification = async () => {
    if (!userId) return;
    setIsStarting(true);
    try {
      const { data, error } = await supabase.functions.invoke("didit-start-verification", {
        body: { user_id: userId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error: any) {
      toast({ title: "Erro", description: error.message || "Não foi possível iniciar a verificação.", variant: "destructive" });
    } finally {
      setIsStarting(false);
    }
  };

  const statusMessage: Record<string, string> = {
    pending: "Sua verificação está em análise",
    approved: "Sua identidade foi verificada com sucesso",
    rejected: "Sua verificação foi rejeitada. Você pode tentar novamente.",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" />
          Verificação de Identidade
        </CardTitle>
        <CardDescription>Verifique sua identidade para maior segurança e confiança</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Status:</span>
          {isCheckingStatus ? (
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          ) : (
            <Badge variant={config.variant} className="flex items-center gap-1.5">
              {config.icon}
              {config.label}
            </Badge>
          )}
        </div>
        {statusMessage[identityStatus] && (
          <p className="text-sm text-muted-foreground">{statusMessage[identityStatus]}</p>
        )}
        {canVerify && (
          <Button onClick={handleStartVerification} disabled={isStarting || isCheckingStatus} className="bg-gradient-primary">
            {isStarting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
            {identityStatus === "rejected" ? "Tentar novamente" : "Verificar identidade"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default Profile;
