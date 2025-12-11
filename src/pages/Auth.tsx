import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Truck, Wheat, Shield, ArrowLeft, Loader2, Chrome, Package } from "lucide-react";
import { z } from "zod";
import { Footer } from "@/components/Footer";
import { PasswordInput } from "@/components/PasswordInput";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

const signupSchema = z.object({
  email: z.string().email("Email inválido"),
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  password: z.string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .regex(passwordRegex, "A senha deve conter: letra maiúscula, minúscula, número e caractere especial (@$!%*?&)"),
  confirmPassword: z.string(),
  role: z.enum(["cooperative", "transporter"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type AppRole = "admin" | "cooperative" | "transporter";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, role, signIn, signUp, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "login");
  const [isAdmin, setIsAdmin] = useState(searchParams.get("admin") === "true");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: (searchParams.get("role") as "cooperative" | "transporter") || "cooperative",
  });

  useEffect(() => {
    if (user && role && !authLoading) {
      if (role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    }
  }, [user, role, authLoading, navigate]);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!resetEmail || !z.string().email().safeParse(resetEmail).success) {
        toast({
          title: "Email inválido",
          description: "Por favor, insira um email válido.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: "Erro ao enviar email",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Email enviado!",
          description: "Verifique sua caixa de entrada para redefinir sua senha.",
        });
        setShowForgotPassword(false);
        setResetEmail("");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validation = loginSchema.safeParse(loginForm);
      if (!validation.success) {
        toast({
          title: "Erro de validação",
          description: validation.error.errors[0].message,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const { error } = await signIn(loginForm.email, loginForm.password);
      
      if (error) {
        toast({
          title: "Erro ao entrar",
          description: error.message === "Invalid login credentials" 
            ? "Email ou senha incorretos" 
            : error.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        toast({
          title: "Erro ao entrar com Google",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao entrar com Google",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validation = signupSchema.safeParse(signupForm);
      if (!validation.success) {
        toast({
          title: "Erro de validação",
          description: validation.error.errors[0].message,
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      const { error } = await signUp(
        signupForm.email,
        signupForm.password,
        signupForm.name,
        signupForm.role as AppRole
      );
      
      if (error) {
        if (error.message.includes("already registered")) {
          toast({
            title: "Email já cadastrado",
            description: "Este email já está em uso. Tente fazer login ou use outro email.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro ao cadastrar",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Cadastro realizado!",
          description: "Bem-vindo à MOVA! Redirecionando...",
        });
        
        // Notify admins about new registration
        try {
          await supabase.functions.invoke("send-transport-confirmation", {
            body: {
              type: "user_registered",
              userName: signupForm.name,
              userEmail: signupForm.email,
              userRole: signupForm.role,
            },
          });
        } catch (emailError) {
          console.log("Failed to send registration notification:", emailError);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex flex-col">
      <div className="container mx-auto px-4 py-6">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Voltar ao início
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                {isAdmin ? (
                  <Shield className="w-7 h-7 text-primary-foreground" />
                ) : (
                  <Truck className="w-7 h-7 text-primary-foreground" />
                )}
              </div>
            </div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              {showForgotPassword ? "Redefinir Senha" : isAdmin ? "Acesso Administrativo" : "Bem-vindo à MOVA"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {showForgotPassword 
                ? "Digite seu email para receber o link" 
                : isAdmin 
                  ? "Entre com suas credenciais de administrador" 
                  : "Entre ou crie sua conta"}
            </p>
          </div>

          {showForgotPassword ? (
            <Card>
              <CardHeader>
                <CardTitle>Recuperar Senha</CardTitle>
                <CardDescription>
                  Enviaremos um link para redefinir sua senha
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-primary" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Enviar Link
                  </Button>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="w-full text-sm text-muted-foreground hover:text-foreground"
                  >
                    Voltar ao login
                  </button>
                </form>
              </CardContent>
            </Card>
          ) : isAdmin ? (
            <Card>
              <CardHeader>
                <CardTitle>Login Admin</CardTitle>
                <CardDescription>Acesso restrito a administradores</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@mova.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Senha</Label>
                    <PasswordInput
                      id="admin-password"
                      value={loginForm.password}
                      onChange={(value) => setLoginForm({ ...loginForm, password: value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-gradient-primary" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Entrar
                  </Button>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="w-full text-sm text-primary hover:underline mt-2"
                  >
                    Esqueceu sua senha?
                  </button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <CardHeader>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Entrar</TabsTrigger>
                    <TabsTrigger value="signup">Cadastrar</TabsTrigger>
                  </TabsList>
                </CardHeader>

                <CardContent>
                  <TabsContent value="login" className="mt-0">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <PasswordInput
                          id="password"
                          value={loginForm.password}
                          onChange={(value) => setLoginForm({ ...loginForm, password: value })}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full bg-gradient-primary" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Entrar
                      </Button>
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="w-full text-sm text-primary hover:underline mt-2"
                      >
                        Esqueceu sua senha?
                      </button>

                      <div className="relative my-4">
                        <Separator />
                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                          ou continue com
                        </span>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handleGoogleLogin}
                        disabled={isSubmitting}
                      >
                        <Chrome className="w-4 h-4 mr-2" />
                        Entrar com Google
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup" className="mt-0">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome completo</Label>
                        <Input
                          id="name"
                          placeholder="João Silva"
                          value={signupForm.name}
                          onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="seu@email.com"
                          value={signupForm.email}
                          onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Senha</Label>
                        <PasswordInput
                          id="signup-password"
                          value={signupForm.password}
                          onChange={(value) => setSignupForm({ ...signupForm, password: value })}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Mínimo 8 caracteres, com maiúscula, minúscula, número e especial (@$!%*?&)
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-confirm-password">Confirmar Senha</Label>
                        <PasswordInput
                          id="signup-confirm-password"
                          value={signupForm.confirmPassword}
                          onChange={(value) => setSignupForm({ ...signupForm, confirmPassword: value })}
                          required
                        />
                      </div>
                      <div className="space-y-3">
                        <Label>Tipo de conta</Label>
                        <RadioGroup
                          value={signupForm.role}
                          onValueChange={(value) => setSignupForm({ ...signupForm, role: value as "cooperative" | "transporter" })}
                          className="grid grid-cols-2 gap-4"
                        >
                          <Label
                            htmlFor="cooperative"
                            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                              signupForm.role === "cooperative"
                                ? "border-primary bg-emerald-light"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <RadioGroupItem value="cooperative" id="cooperative" className="sr-only" />
                            <Wheat className="w-6 h-6 text-primary" />
                            <span className="text-sm font-medium">Cooperativa</span>
                          </Label>
                          <Label
                            htmlFor="transporter"
                            className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                              signupForm.role === "transporter"
                                ? "border-primary bg-emerald-light"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <RadioGroupItem value="transporter" id="transporter" className="sr-only" />
                            <Package className="w-6 h-6 text-primary" />
                            <span className="text-sm font-medium">Procuro Carga</span>
                          </Label>
                        </RadioGroup>
                      </div>
                      <Button type="submit" className="w-full bg-gradient-primary" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Criar Conta
                      </Button>

                      <div className="relative my-4">
                        <Separator />
                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                          ou continue com
                        </span>
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handleGoogleLogin}
                        disabled={isSubmitting}
                      >
                        <Chrome className="w-4 h-4 mr-2" />
                        Cadastrar com Google
                      </Button>
                    </form>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Auth;
