import { Link } from "react-router-dom";
import { ArrowLeft, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-bold text-foreground">MOVA</span>
            </Link>
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-8">
            Política de Privacidade
          </h1>
          
          <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <p className="text-lg">
              Última atualização: {new Date().toLocaleDateString('pt-AO')}
            </p>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">1. Introdução</h2>
              <p>
                A MOVA está comprometida em proteger a sua privacidade. Esta Política de Privacidade explica como recolhemos, usamos, divulgamos e protegemos as suas informações pessoais quando utiliza a nossa plataforma de logística agrícola.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">2. Informações que Recolhemos</h2>
              <p>Recolhemos as seguintes categorias de informações:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Informações de Registo:</strong> Nome, email, número de telefone, nome da empresa/cooperativa.</li>
                <li><strong>Informações de Transporte:</strong> Endereços de origem e destino, tipos de carga, datas de recolha.</li>
                <li><strong>Informações de Pagamento:</strong> Comprovantes de transação, códigos de confirmação.</li>
                <li><strong>Dados de Utilização:</strong> Informações sobre como utiliza a nossa plataforma.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">3. Como Utilizamos as Suas Informações</h2>
              <p>Utilizamos as suas informações para:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Facilitar a conexão entre cooperativas/agricultores e transportadoras.</li>
                <li>Processar e gerir pedidos de transporte.</li>
                <li>Enviar notificações sobre o estado dos pedidos.</li>
                <li>Melhorar os nossos serviços e experiência do utilizador.</li>
                <li>Cumprir obrigações legais e regulamentares.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">4. Partilha de Informações</h2>
              <p>
                Partilhamos as suas informações apenas quando necessário para prestar os nossos serviços, incluindo:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Entre cooperativas e transportadoras para facilitar o transporte.</li>
                <li>Com prestadores de serviços que nos ajudam a operar a plataforma.</li>
                <li>Quando exigido por lei ou para proteger os nossos direitos legais.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">5. Segurança dos Dados</h2>
              <p>
                Implementamos medidas de segurança técnicas e organizacionais adequadas para proteger as suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">6. Os Seus Direitos</h2>
              <p>Tem o direito de:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Aceder às suas informações pessoais.</li>
                <li>Corrigir informações incorretas.</li>
                <li>Solicitar a eliminação dos seus dados.</li>
                <li>Retirar o seu consentimento a qualquer momento.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">7. Contacto</h2>
              <p>
                Para questões sobre esta política ou sobre os seus dados pessoais, entre em contacto connosco através do WhatsApp disponível na plataforma.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
