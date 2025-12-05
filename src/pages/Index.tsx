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
      <header className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
            </div>
            <span className="text-xl sm:text-2xl font-display font-bold text-foreground">MOVA</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="font-medium text-sm sm:text-base px-2 sm:px-4">Entrar</Button>
            </Link>
            <Link to="/auth?tab=signup">
              <Button size="sm" className="bg-gradient-primary text-primary-foreground font-medium shadow-glow text-sm sm:text-base px-3 sm:px-4">
                <span className="hidden sm:inline">Começar Agora</span>
                <span className="sm:hidden">Começar</span>
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
        <div className="container mx-auto px-3 sm:px-4 py-12 sm:py-20 lg:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-slide-up">
            <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-light text-primary rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              Serviço de Logística Agrícola
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-4 sm:mb-6 leading-tight px-2">
              Conectando o <span className="text-gradient">Campo</span> ao seu <span className="text-gradient">Destino</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-10 max-w-2xl mx-auto px-2">
              A MOVA Simplifica o Transporte de Produtos Agrícolas. Conectando Cooperativas, Agricultores 
              e Transportadoras a Oportunidades de Forma Rápida e Segura.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 px-2">
              <Link to="/auth?tab=signup&role=cooperative" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-primary text-primary-foreground font-semibold px-6 sm:px-8 h-12 sm:h-14 text-base sm:text-lg shadow-glow">
                  <Wheat className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Sou Cooperativa/Agricultor
                </Button>
              </Link>
              <Link to="/auth?tab=signup&role=transporter" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto font-semibold px-6 sm:px-8 h-12 sm:h-14 text-base sm:text-lg border-2 bg-background/80 backdrop-blur-sm">
                  <Truck className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Sou Transportadora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="container mx-auto px-3 sm:px-4 py-12 sm:py-20 bg-background">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Como Funciona
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
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
      <section className="container mx-auto px-3 sm:px-4 py-12 sm:py-20">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Vantagens para Todos
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {/* For Cooperatives */}
          <div className="bg-card rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-border">
            <div className="h-40 sm:h-56 overflow-hidden">
              <img 
                src={cornHarvest} 
                alt="Monte de milho com plantação ao fundo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-4 sm:mb-6 flex items-center gap-2">
                <Wheat className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                Para Cooperativas e Agricultores
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                <AdvantageItem text="Alcance novos mercados." />
                <AdvantageItem text="Otimize custos de frete." />
                <AdvantageItem text="Agendamento fácil e rápido." />
                <AdvantageItem text="Segurança e rastreabilidade da carga." />
              </ul>
            </div>
          </div>

          {/* For Transporters */}
          <div className="bg-card rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-border">
            <div className="h-40 sm:h-56 overflow-hidden">
              <img 
                src={truckCabinView} 
                alt="Vista de dentro da cabine de um caminhão ao pôr do sol" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5 sm:p-8">
              <h3 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-4 sm:mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                Para Transportadoras
              </h3>
              <ul className="space-y-2 sm:space-y-3">
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
      <section className="container mx-auto px-3 sm:px-4 py-12 sm:py-20">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Pronto para otimizar sua logística?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          <div className="bg-card rounded-xl sm:rounded-2xl p-5 sm:p-8 shadow-md border border-border">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-light rounded-xl flex items-center justify-center text-primary mb-4 sm:mb-6">
              <Settings className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-display font-bold text-foreground mb-3 sm:mb-4">FUNÇÕES</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-2 sm:mb-3">
              Crie pedidos de transporte facilmente, acompanhe o status e gerencie toda sua logística em um só lugar.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground">
              Visualize pedidos disponíveis, aceite cargas que se encaixam na sua rota e expanda seus negócios.
            </p>
          </div>

          <div className="bg-card rounded-xl sm:rounded-2xl p-5 sm:p-8 shadow-md border border-border">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-light rounded-xl flex items-center justify-center text-primary mb-4 sm:mb-6">
              <Shield className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-display font-bold text-foreground mb-3 sm:mb-4">SEGURANÇA</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                Dados protegidos
              </li>
              <li className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                Histórico completo
              </li>
              <li className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground">
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                Suporte dedicado
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-3 sm:px-4 py-12 sm:py-20">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden">
          <img 
            src={truckLoadingCorn} 
            alt="Caminhão sendo carregado com milho" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/80" />
          <div className="relative z-10 p-6 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-3 sm:mb-4">
              Pronto para começar?
            </h2>
            <p className="text-primary-foreground/80 text-base sm:text-lg mb-6 sm:mb-8 max-w-xl mx-auto">
              Cadastre-se gratuitamente e comece a usar o Serviço MOVA hoje mesmo.
            </p>
            <Link to="/auth?tab=signup">
              <Button size="lg" variant="secondary" className="font-semibold px-6 sm:px-8 h-12 sm:h-14 text-base sm:text-lg">
                Criar Conta Grátis
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
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
    <div className="relative inline-block mb-4 sm:mb-6">
      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-light rounded-xl sm:rounded-2xl flex items-center justify-center text-primary mx-auto [&>svg]:w-10 [&>svg]:h-10 sm:[&>svg]:w-12 sm:[&>svg]:h-12">
        {icon}
      </div>
      <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-xs sm:text-sm">
        {step}
      </span>
    </div>
    <h3 className="text-lg sm:text-xl font-display font-bold text-foreground mb-2 sm:mb-3">{title}</h3>
    <p className="text-sm sm:text-base text-muted-foreground">{description}</p>
  </div>
);

const AdvantageItem = ({ text }: { text: string }) => (
  <li className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base text-foreground">
    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
    {text}
  </li>
);

export default Index;
