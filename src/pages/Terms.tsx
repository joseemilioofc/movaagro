import { Link } from "react-router-dom";
import { ArrowLeft, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";

const Terms = () => {
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
            Termos de Uso
          </h1>
          
          <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <p className="text-lg">
              Última atualização: {new Date().toLocaleDateString('pt-AO')}
            </p>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">1. Aceitação dos Termos</h2>
              <p>
                Ao aceder ou utilizar a plataforma MOVA, concorda em ficar vinculado a estes Termos de Uso. Se não concordar com qualquer parte destes termos, não poderá aceder ao serviço.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">2. Descrição do Serviço</h2>
              <p>
                A MOVA é uma plataforma que conecta cooperativas agrícolas e agricultores a transportadoras, facilitando o transporte de produtos agrícolas. A MOVA atua como intermediário e não é responsável pela execução física do transporte.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">3. Registo e Conta</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Deve fornecer informações precisas e completas ao criar uma conta.</li>
                <li>É responsável por manter a confidencialidade da sua conta.</li>
                <li>Deve notificar-nos imediatamente de qualquer uso não autorizado.</li>
                <li>Reservamo-nos o direito de suspender ou encerrar contas que violem estes termos.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">4. Obrigações das Cooperativas/Agricultores</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fornecer informações precisas sobre os pedidos de transporte.</li>
                <li>Garantir que a carga está pronta no local e hora indicados.</li>
                <li>Efetuar os pagamentos conforme acordado.</li>
                <li>Comunicar de forma clara e respeitosa com as transportadoras.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">5. Obrigações das Transportadoras</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cumprir os pedidos aceites dentro dos prazos acordados.</li>
                <li>Manter os veículos em condições adequadas para o transporte.</li>
                <li>Ter toda a documentação legal necessária para operar.</li>
                <li>Tratar a carga com o devido cuidado.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">6. Pagamentos</h2>
              <p>
                Os pagamentos são realizados através da conta MOVA indicada na plataforma. A confirmação do pagamento é feita mediante apresentação do comprovante, que será verificado pela nossa equipa antes da liberação do serviço.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">7. Limitação de Responsabilidade</h2>
              <p>
                A MOVA não se responsabiliza por:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Danos ou perdas de mercadorias durante o transporte.</li>
                <li>Atrasos causados por terceiros ou força maior.</li>
                <li>Disputas entre utilizadores da plataforma.</li>
                <li>Informações incorretas fornecidas pelos utilizadores.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">8. Modificações</h2>
              <p>
                Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entram em vigor imediatamente após a publicação na plataforma.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">9. Contacto</h2>
              <p>
                Para questões sobre estes termos, entre em contacto connosco através do WhatsApp disponível na plataforma.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
