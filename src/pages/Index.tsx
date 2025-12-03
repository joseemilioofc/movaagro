import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Truck, Wheat, Shield, ArrowRight, CheckCircle } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-display font-bold text-foreground">MOVA</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost" className="font-medium">Entrar</Button>
            </Link>
            <Link to="/auth?tab=signup">
              <Button className="bg-gradient-primary text-primary-foreground font-medium shadow-glow">
                Começar Agora
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto text-center animate-slide-up">
          <span className="inline-block px-4 py-2 bg-emerald-light text-primary rounded-full text-sm font-medium mb-6">
            Plataforma de Logística Agrícola
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6 leading-tight">
            Conectando o <span className="text-gradient">Campo</span> ao seu <span className="text-gradient">Destino</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            A MOVA simplifica o transporte de produtos agrícolas, conectando cooperativas e agricultores 
            diretamente às transportadoras de forma rápida e segura.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth?tab=signup&role=cooperative">
              <Button size="lg" className="bg-gradient-primary text-primary-foreground font-semibold px-8 h-14 text-lg shadow-glow">
                <Wheat className="mr-2 h-5 w-5" />
                Sou Cooperativa/Agricultor
              </Button>
            </Link>
            <Link to="/auth?tab=signup&role=transporter">
              <Button size="lg" variant="outline" className="font-semibold px-8 h-14 text-lg border-2">
                <Truck className="mr-2 h-5 w-5" />
                Sou Transportadora
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Como a MOVA funciona
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Uma plataforma simples e eficiente para gerenciar suas necessidades de transporte agrícola
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Wheat className="w-8 h-8" />}
            title="Para Cooperativas"
            description="Crie pedidos de transporte facilmente, acompanhe o status e gerencie toda sua logística em um só lugar."
            features={["Criar pedidos rapidamente", "Acompanhar entregas", "Histórico completo"]}
          />
          <FeatureCard
            icon={<Truck className="w-8 h-8" />}
            title="Para Transportadoras"
            description="Visualize pedidos disponíveis, aceite cargas que se encaixam na sua rota e expanda seus negócios."
            features={["Ver pedidos disponíveis", "Aceitar ou recusar", "Gestão de rotas"]}
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title="Segurança"
            description="Todas as transações são registradas e monitoradas para garantir a segurança de ambas as partes."
            features={["Dados protegidos", "Histórico completo", "Suporte dedicado"]}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-primary rounded-3xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
            Pronto para começar?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
            Cadastre-se gratuitamente e comece a usar a plataforma MOVA hoje mesmo.
          </p>
          <Link to="/auth?tab=signup">
            <Button size="lg" variant="secondary" className="font-semibold px-8 h-14 text-lg">
              Criar Conta Grátis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Truck className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground">MOVA</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 MOVA. Todos os direitos reservados.
          </p>
          <Link to="/auth?admin=true" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Acesso Administrativo
          </Link>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}

const FeatureCard = ({ icon, title, description, features }: FeatureCardProps) => (
  <div className="bg-card rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow border border-border">
    <div className="w-14 h-14 bg-emerald-light rounded-xl flex items-center justify-center text-primary mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-display font-bold text-foreground mb-3">{title}</h3>
    <p className="text-muted-foreground mb-6">{description}</p>
    <ul className="space-y-2">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-2 text-sm text-foreground">
          <CheckCircle className="w-4 h-4 text-primary" />
          {feature}
        </li>
      ))}
    </ul>
  </div>
);

export default Index;
