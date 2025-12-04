import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Lock, CheckCircle } from "lucide-react";
import { z } from "zod";
import { Footer } from "@/components/Footer";

const passwordSchema = z.object({
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({ password: "", confirmPassword: "" });

  useEffect(() => {
    // Listen for auth state changes to handle password recovery
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          setIsValidToken(true);
          setIsLoading(false);
        } else if (event === "SIGNED_IN" && session) {
          // User might have clicked the recovery link - check hash
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const type = hashParams.get("type");
          if (type === "recovery") {
            setIsValidToken(true);
          }
          setIsLoading(false);
        }
      }
    );

    // Check URL hash for recovery token (Supabase sends token via hash)
    const checkRecoveryToken = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const type = hashParams.get("type");

      if (accessToken && type === "recovery") {
        // Set the session with the recovery token
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: hashParams.get("refresh_token") || "",
        });

        if (!error) {
          setIsValidToken(true);
        } else {
          toast({
            title: "Link inválido ou expirado",
            description: "Por favor, solicite um novo link de redefinição de senha.",
            variant: "destructive",
          });
          navigate("/auth");
        }
      } else {
        // Check if there's an existing session (user might be logged in)
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsValidToken(true);
        } else {
          toast({
            title: "Link inválido ou expirado",
            description: "Por favor, solicite um novo link de redefinição de senha.",
            variant: "destructive",
          });
          navigate("/auth");
        }
      }
      setIsLoading(false);
    };

    checkRecoveryToken();

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validation = passwordSchema.safeParse(form);
      if (!validation.success) {
        toast({
          title: "Erro de validação",
          description: validation.error.errors[0].message,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: form.password,
      });

      if (error) {
        toast({
          title: "Erro ao redefinir senha",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setIsSuccess(true);
        toast({
          title: "Senha redefinida!",
          description: "Sua senha foi alterada com sucesso.",
        });
        
        // Sign out and redirect to login
        setTimeout(async () => {
          await supabase.auth.signOut();
          navigate("/auth");
        }, 2000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-hero flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Senha Redefinida!</h2>
                <p className="text-muted-foreground">
                  Redirecionando para o login...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gradient-hero flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h2 className="text-xl font-semibold">Link Inválido</h2>
                <p className="text-muted-foreground">
                  Este link de redefinição de senha é inválido ou expirou.
                </p>
                <Link to="/auth">
                  <Button className="bg-gradient-primary">
                    Voltar ao Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      <div className="container mx-auto px-4 py-6">
        <Link to="/auth" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Voltar ao login
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Lock className="w-7 h-7 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Redefinir Senha
            </h1>
            <p className="text-muted-foreground mt-2">
              Digite sua nova senha
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Nova Senha</CardTitle>
              <CardDescription>
                Escolha uma senha forte com pelo menos 6 caracteres
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Nova senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-gradient-primary" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Redefinir Senha
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ResetPassword;
