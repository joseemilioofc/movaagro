import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Truck, Wheat, Shield, ArrowRight, UserCircle, DollarSign, Settings, CheckCircle } from "lucide-react";
import { Footer } from "@/components/Footer";
import wheatFieldHero from "@/assets/wheat-field-hero.jpg";
import cornHarvest from "@/assets/corn-harvest.jpg";
import truckCabinView from "@/assets/truck-cabin-view.jpg";
import truckLoadingCorn from "@/assets/truck-loading-corn.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
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
      <section className="relative">
        <div className="absolute inset-0 z-0">
          <img 
            src={wheatFieldHero} 
            alt="Plantação de trigo ao pôr do sol" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        </div>
        <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-slide-up">
            <span className="inline-block px-4 py-2 bg-emerald-light text-primary rounded-full text-sm font-medium mb-6">
              Serviço de Logística Agrícola
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
                <Button size="lg" variant="outline" className="font-semibold px-8 h-14 text-lg border-2 bg-background/80 backdrop-blur-sm">
                  <Truck className="mr-2 h-5 w-5" />
                  Sou Transportadora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="container mx-auto px-4 py-20 bg-background">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Como Funciona
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <StepCard
            step={1}
            icon={<UserCircle className="w-12 h-12" />}
            title="Cadastre-se"
            description="Escolha seu perfil, agricultor ou transportadora, e crie sua conta em minutos."
          />
          <StepCard
            step={2}
            icon={<Truck className="w-12 h-12" />}
            title="Crie ou Encontre um Frete"
            description="Agricultores publicam suas necessidades de transporte. Transportadoras encontram as melhores ofertas."
          />
          <StepCard
            step={3}
            icon={<DollarSign className="w-12 h-12" />}
            title="Feche Negócio"
            description="Negocie, aceite a proposta e movimente sua carga com segurança e eficiência."
          />
        </div>
      </section>

      {/* Advantages Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Vantagens para Todos
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* For Cooperatives */}
          <div className="bg-card rounded-3xl overflow-hidden shadow-lg border border-border">
            <div className="h-56 overflow-hidden">
              <img 
                src={cornHarvest} 
                alt="Monte de milho com plantação ao fundo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
                <Wheat className="w-6 h-6 text-primary" />
                Para Cooperativas e Agricultores
              </h3>
              <ul className="space-y-3">
                <AdvantageItem text="Alcance novos mercados." />
                <AdvantageItem text="Otimize custos de frete." />
                <AdvantageItem text="Agendamento fácil e rápido." />
                <AdvantageItem text="Segurança e rastreabilidade da carga." />
              </ul>
            </div>
          </div>

          {/* For Transporters */}
          <div className="bg-card rounded-3xl overflow-hidden shadow-lg border border-border">
            <div className="h-56 overflow-hidden">
              <img 
                src={truckCabinView} 
                alt="Vista de dentro da cabine de um caminhão ao pôr do sol" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-2">
                <Truck className="w-6 h-6 text-primary" />
                Para Transportadoras
              </h3>
              <ul className="space-y-3">
                <AdvantageItem text="Acesso a novas oportunidades de frete." />
                <AdvantageItem text="Reduza o tempo ocioso do veículo." />
                <AdvantageItem text="Otimização de rotas e cargas." />
                <AdvantageItem text="Pagamentos seguros e pontuais." />
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features & Security Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Pronto para otimizar sua logística?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl p-8 shadow-md border border-border">
            <div className="w-14 h-14 bg-emerald-light rounded-xl flex items-center justify-center text-primary mb-6">
              <Settings className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-display font-bold text-foreground mb-4">FUNÇÕES</h3>
            <p className="text-muted-foreground mb-3">
              Crie pedidos de transporte facilmente, acompanhe o status e gerencie toda sua logística em um só lugar.
            </p>
            <p className="text-muted-foreground">
              Visualize pedidos disponíveis, aceite cargas que se encaixam na sua rota e expanda seus negócios.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-md border border-border">
            <div className="w-14 h-14 bg-emerald-light rounded-xl flex items-center justify-center text-primary mb-6">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-display font-bold text-foreground mb-4">SEGURANÇA</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-primary" />
                Dados protegidos
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-primary" />
                Histórico completo
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-primary" />
                Suporte dedicado
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="relative rounded-3xl overflow-hidden">
          <img 
            src={truckLoadingCorn} 
            alt="Caminhão sendo carregado com milho" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/80" />
          <div className="relative z-10 p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
              Pronto para começar?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
              Cadastre-se gratuitamente e comece a usar o Serviço MOVA hoje mesmo.
            </p>
            <Link to="/auth?tab=signup">
              <Button size="lg" variant="secondary" className="font-semibold px-8 h-14 text-lg">
                Criar Conta Grátis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

interface StepCardProps {
  step: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const StepCard = ({ step, icon, title, description }: StepCardProps) => (
  <div className="text-center">
    <div className="relative inline-block mb-6">
      <div className="w-20 h-20 bg-emerald-light rounded-2xl flex items-center justify-center text-primary mx-auto">
        {icon}
      </div>
      <span className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
        {step}
      </span>
    </div>
    <h3 className="text-xl font-display font-bold text-foreground mb-3">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const AdvantageItem = ({ text }: { text: string }) => (
  <li className="flex items-center gap-3 text-foreground">
    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
    {text}
  </li>
);

export default Index;
