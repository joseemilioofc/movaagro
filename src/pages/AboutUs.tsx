import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Truck, UserCircle, ArrowLeft, Leaf, Database, Calculator, Code, Eye, Target, Handshake, Shield, Zap } from "lucide-react";
import { Footer } from "@/components/Footer";

interface TeamMember {
  name: string;
  role: string;
  description: string;
  icon: React.ReactNode;
  isFounder?: boolean;
}

const teamMembers: TeamMember[] = [
  {
    name: "José Emílio",
    role: "Fundador",
    description: "Especialista em Contabilidade, com experiência em gestão, logística, Marketing digital, e desenvolvimento de Apps (Programador).",
    icon: <Code className="w-12 h-12" />,
    isFounder: true,
  },
  {
    name: "Junior Pedro",
    role: "Gestão de Dados",
    description: "Especialista em gestão de dados.",
    icon: <Database className="w-12 h-12" />,
  },
  {
    name: "Aldo Mundulai",
    role: "Agricultura",
    description: "Agricultor.",
    icon: <Leaf className="w-12 h-12" />,
  },
];

const TeamMemberCard = ({ member }: { member: TeamMember }) => (
  <div className={`bg-card rounded-2xl p-6 sm:p-8 shadow-lg border ${member.isFounder ? 'border-primary/50 ring-2 ring-primary/20' : 'border-border'} transition-all hover:shadow-xl hover:-translate-y-1`}>
    {member.isFounder && (
      <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-4">
        Fundador
      </span>
    )}
    <div className="flex flex-col items-center text-center">
      {/* Photo placeholder with icon */}
      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center mb-4 border-2 border-primary/30">
        <div className="text-primary">
          {member.icon}
        </div>
      </div>
      
      <h3 className="text-xl sm:text-2xl font-display font-bold text-foreground mb-1">
        {member.name}
      </h3>
      <p className="text-primary font-medium mb-3">{member.role}</p>
      <p className="text-muted-foreground text-sm sm:text-base">
        {member.description}
      </p>
    </div>
  </div>
);

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <span className="text-xl sm:text-2xl font-display font-bold text-foreground">MOVA</span>
            </Link>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="font-medium text-sm sm:text-base px-3 sm:px-4">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Voltar
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="bg-gradient-primary text-primary-foreground font-medium shadow-glow text-sm sm:text-base px-3 sm:px-4">
                Entrar
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-3 sm:px-4 py-12 sm:py-20">
        <div className="max-w-4xl mx-auto text-center animate-slide-up">
          <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-light text-primary rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            Conheça a Nossa Equipa
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4 sm:mb-6 leading-tight">
            Sobre <span className="text-gradient">Nós</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 max-w-3xl mx-auto">
            Somos uma equipa multidisciplinar que une conhecimento em gestão, tecnologia e agronegócio para resolver um dos maiores desafios do sector agrícola moçambicano: a logística de escoamento da produção. Cada membro traz uma visão estratégica que, em conjunto, transforma a forma como o campo se conecta ao mercado.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-lg border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-primary-foreground" />
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground">Nossa Missão</h2>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              A MOVA nasceu da necessidade de conectar o campo ao seu destino de forma eficiente e segura. 
              Nossa missão é simplificar o transporte de produtos agrícolas, conectando cooperativas e 
              transportadoras a oportunidades de forma rápida, transparente e confiável. Acreditamos que 
              a tecnologia pode transformar a logística agrícola em Moçambique.
            </p>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-lg border border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-primary-foreground" />
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-foreground">Nossa Visão</h2>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Ser a principal plataforma de logística agrícola em Moçambique, reconhecida pela inovação, 
              confiabilidade e impacto positivo no desenvolvimento do sector agrícola. Queremos que cada 
              agricultor tenha acesso fácil e justo ao mercado, eliminando barreiras logísticas e promovendo 
              o crescimento sustentável das comunidades rurais.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-3 sm:px-4 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Nossos Valores
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Os princípios que guiam todas as nossas ações e decisões
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Transparency */}
            <div className="bg-card rounded-xl p-6 shadow-md border border-border hover:shadow-lg hover:-translate-y-1 transition-all text-center">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Transparência</h3>
              <p className="text-muted-foreground text-sm">
                Operamos com honestidade e clareza em todas as transações e comunicações.
              </p>
            </div>

            {/* Innovation */}
            <div className="bg-card rounded-xl p-6 shadow-md border border-border hover:shadow-lg hover:-translate-y-1 transition-all text-center">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Inovação</h3>
              <p className="text-muted-foreground text-sm">
                Utilizamos tecnologia para resolver problemas reais do sector agrícola.
              </p>
            </div>

            {/* Commitment */}
            <div className="bg-card rounded-xl p-6 shadow-md border border-border hover:shadow-lg hover:-translate-y-1 transition-all text-center">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Handshake className="w-7 h-7 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Compromisso</h3>
              <p className="text-muted-foreground text-sm">
                Cumprimos o que prometemos e valorizamos cada parceria estabelecida.
              </p>
            </div>

            {/* Impact */}
            <div className="bg-card rounded-xl p-6 shadow-md border border-border hover:shadow-lg hover:-translate-y-1 transition-all text-center">
              <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-7 h-7 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Impacto</h3>
              <p className="text-muted-foreground text-sm">
                Trabalhamos para gerar mudanças positivas nas comunidades agrícolas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-3 sm:px-4 py-12 sm:py-20">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Nossa Equipa
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Profissionais dedicados a revolucionar a logística agrícola
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.name} member={member} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-3 sm:px-4 py-12 sm:py-20">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl sm:rounded-3xl p-8 sm:p-12 border border-primary/20">
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-foreground mb-4">
            Junte-se a Nós
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Faça parte da revolução na logística agrícola de Moçambique. Cadastre-se agora e comece a conectar-se.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link to="/auth?tab=signup">
              <Button size="lg" className="bg-gradient-primary text-primary-foreground font-semibold px-8 shadow-glow">
                Criar Conta
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline" className="font-semibold px-8 border-2">
                Ver Preços
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
