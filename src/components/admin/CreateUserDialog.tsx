import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { logAuditAction } from "@/hooks/useAuditLog";
import { UserPlus, Loader2, Mail } from "lucide-react";

interface CreateUserDialogProps {
  onUserCreated: () => void;
  isSecondaryAdmin?: boolean;
}

type UserRole = "admin" | "secondary_admin" | "cooperative" | "transporter";

export const CreateUserDialog = ({ onUserCreated, isSecondaryAdmin = false }: CreateUserDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [sendWelcomeEmail, setSendWelcomeEmail] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "" as UserRole | "",
    companyName: "",
    phone: "",
  });
  const { toast } = useToast();

  const roleLabels: Record<UserRole, string> = {
    admin: "Administrador Supremo",
    secondary_admin: "Administrador Secundário",
    cooperative: "Cooperativa",
    transporter: "Transportadora",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Senha fraca",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      // Use the edge function to create admin users, or signUp for others
      if (formData.role === "admin" || formData.role === "secondary_admin") {
        console.log("Creating admin user via edge function...");
        const { data, error } = await supabase.functions.invoke("create-admin-user", {
          body: {
            email: formData.email,
            password: formData.password,
            name: formData.name,
            adminRole: formData.role,
          },
        });

        console.log("Edge function response:", data, error);
        if (error) throw error;
        if (data?.error) throw new Error(data.error);
      } else {
        // For cooperatives and transporters, use standard signup
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              name: formData.name,
              role: formData.role,
            },
          },
        });

        if (error) throw error;

        // Update profile with additional info if user was created
        if (data.user) {
          const { error: profileError } = await supabase
            .from("profiles")
            .update({
              company_name: formData.companyName || null,
              phone: formData.phone || null,
            })
            .eq("user_id", data.user.id);

          if (profileError) {
            console.error("Erro ao atualizar perfil:", profileError);
          }
        }
      }

      // Send welcome email if enabled (password reset link, not plain password)
      if (sendWelcomeEmail) {
        try {
          await supabase.functions.invoke("send-welcome-email", {
            body: {
              email: formData.email,
              name: formData.name,
              role: formData.role,
            },
          });
        } catch (emailError) {
          console.error("Erro ao enviar email de boas-vindas:", emailError);
          // Don't fail the user creation if email fails
        }
      }

      // Log audit action
      await logAuditAction({
        action: "create",
        entityType: "user",
        details: {
          email: formData.email,
          name: formData.name,
          role: formData.role,
          welcomeEmailSent: sendWelcomeEmail,
        },
      });

      toast({
        title: "Usuário criado",
        description: `${roleLabels[formData.role as UserRole]} criado com sucesso!${sendWelcomeEmail ? " Email de boas-vindas enviado." : ""}`,
      });

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "",
        companyName: "",
        phone: "",
      });
      setOpen(false);
      onUserCreated();
    } catch (error: any) {
      console.error("Erro ao criar usuário:", error);
      toast({
        title: "Erro ao criar usuário",
        description: error.message || "Ocorreu um erro ao criar o usuário.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Cadastrar Usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Usuário</DialogTitle>
          <DialogDescription>
            Crie uma conta para administradores, cooperativas ou transportadoras.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="role">Tipo de Usuário *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                   {!isSecondaryAdmin && <SelectItem value="admin">Administrador Supremo</SelectItem>}
                   {!isSecondaryAdmin && <SelectItem value="secondary_admin">Administrador Secundário</SelectItem>}
                   <SelectItem value="cooperative">Cooperativa</SelectItem>
                   <SelectItem value="transporter">Transportadora</SelectItem>
                 </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nome completo"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@exemplo.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Senha *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            {(formData.role === "cooperative" || formData.role === "transporter") && (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="companyName">Nome da Empresa</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Nome da empresa (opcional)"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+258 84 XXX XXXX"
                  />
                </div>
              </>
            )}
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="sendEmail"
                checked={sendWelcomeEmail}
                onCheckedChange={(checked) => setSendWelcomeEmail(checked as boolean)}
              />
              <Label htmlFor="sendEmail" className="flex items-center gap-2 text-sm font-normal cursor-pointer">
                <Mail className="w-4 h-4" />
                Enviar email de boas-vindas com link para definir senha
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Criar Usuário
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
