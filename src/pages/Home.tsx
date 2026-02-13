import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Truck, 
  Package, 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  MapPin,
  Clock,
  Star,
  ArrowRight,
  Loader2
} from "lucide-react";

const Home = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const quickActions = [
    {
      title: "Solicitar Transporte",
      description: "Crie uma nova solicitação de transporte de carga",
      icon: Package,
      href: "/cooperative",
      color: "bg-primary/10 text-primary",
      roles: ["cooperative"],
    },
    {
      title: "Ver Cargas Disponíveis",
      description: "Encontre oportunidades de transporte",
      icon: Truck,
      href: "/transporter",
      color: "bg-accent/10 text-accent",
      roles: ["transporter"],
    },
    {
      title: "Meus Contratos",
      description: "Acompanhe seus contratos ativos",
      icon: FileText,
      href: "/contracts",
      color: "bg-secondary/50 text-foreground",
      roles: ["cooperative", "transporter"],
    },
    {
      title: "Ranking",
      description: "Veja os melhores transportadores",
      icon: Star,
      href: "/ranking",
      color: "bg-yellow-500/10 text-yellow-600",
      roles: ["cooperative", "transporter"],
    },
  ];

  const stats = [
    { label: "Transportes Activos", value: "0", icon: Truck },
    { label: "Contratos Pendentes", value: "0", icon: FileText },
    { label: "Mensagens", value: "0", icon: MessageSquare },
  ];

  const filteredActions = quickActions.filter(
    (action) => !action.roles || action.roles.includes(role || "")
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-primary rounded-2xl p-8 text-primary-foreground">
          <h1 className="text-3xl font-display font-bold mb-2">
            Bem-vindo à MOVA!
          </h1>
          <p className="text-primary-foreground/80 text-lg">
            {role === "cooperative" 
              ? "Gerencie suas solicitações de transporte e acompanhe suas cargas."
              : role === "transporter"
              ? "Encontre novas oportunidades de transporte e gerencie seus serviços."
              : role === "secondary_admin"
              ? "Acompanhe as operações da plataforma."
              : "Gerencie a plataforma e monitore todas as operações."}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="p-3 rounded-xl bg-primary/10">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Acções Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredActions.map((action, index) => (
              <Link key={index} to={action.href}>
                <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-2`}>
                      <action.icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="ghost" className="p-0 h-auto text-primary">
                      Acessar <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Rastreamento GPS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Acompanhe em tempo real a localização das suas cargas durante o transporte.
              </p>
              <Button variant="outline" asChild>
                <Link to={role === "cooperative" ? "/cooperative" : "/transporter"}>
                  Ver Rastreamento
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Calculadora de Frete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Calcule o valor estimado do transporte com base na origem, destino e tipo de carga.
              </p>
              <Button variant="outline" asChild>
                <Link to="/pricing">
                  Calcular Frete
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
