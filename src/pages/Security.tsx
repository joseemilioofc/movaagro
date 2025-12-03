import { Link } from "react-router-dom";
import { ArrowLeft, Truck, Shield, Lock, Eye, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";

const Security = () => {
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
            Segurança
          </h1>

          {/* Security Features */}
          <div className="grid gap-6 md:grid-cols-2 mb-12">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-12 h-12 bg-emerald-light rounded-lg flex items-center justify-center text-primary mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Encriptação de Dados</h3>
              <p className="text-sm text-muted-foreground">
                Todos os dados são transmitidos através de conexões seguras (HTTPS/TLS) e armazenados de forma encriptada.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-12 h-12 bg-emerald-light rounded-lg flex items-center justify-center text-primary mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Autenticação Segura</h3>
              <p className="text-sm text-muted-foreground">
                Sistema de autenticação robusto com proteção contra acessos não autorizados.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-12 h-12 bg-emerald-light rounded-lg flex items-center justify-center text-primary mb-4">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Monitorização Contínua</h3>
              <p className="text-sm text-muted-foreground">
                Monitorizamos continuamente a plataforma para detectar e prevenir ameaças de segurança.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="w-12 h-12 bg-emerald-light rounded-lg flex items-center justify-center text-primary mb-4">
                <Server className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Infraestrutura Segura</h3>
              <p className="text-sm text-muted-foreground">
                Utilizamos infraestrutura de nuvem de classe mundial com múltiplas camadas de segurança.
              </p>
            </div>
          </div>
          
          <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">O Nosso Compromisso com a Segurança</h2>
              <p>
                Na MOVA, a segurança dos seus dados e transações é a nossa prioridade máxima. Implementamos múltiplas camadas de proteção para garantir que as suas informações estão sempre seguras.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Proteção de Dados</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Encriptação em Trânsito:</strong> Todas as comunicações são protegidas com TLS 1.3.</li>
                <li><strong>Encriptação em Repouso:</strong> Os dados armazenados são encriptados com algoritmos de última geração.</li>
                <li><strong>Backups Regulares:</strong> Realizamos backups automáticos para garantir a recuperação de dados.</li>
                <li><strong>Acesso Controlado:</strong> Apenas pessoal autorizado tem acesso aos sistemas críticos.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Segurança das Transações</h2>
              <p>
                Todas as transações financeiras são verificadas manualmente pela nossa equipa antes de serem confirmadas. Este processo adicional garante que:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Os comprovantes de pagamento são autênticos.</li>
                <li>Os valores correspondem aos acordados.</li>
                <li>Ambas as partes são notificadas em cada etapa.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Boas Práticas para Utilizadores</h2>
              <p>Recomendamos que:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Utilize palavras-passe fortes e únicas.</li>
                <li>Não partilhe as suas credenciais de acesso.</li>
                <li>Verifique sempre os detalhes antes de confirmar transações.</li>
                <li>Reporte imediatamente qualquer atividade suspeita.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Reportar Problemas de Segurança</h2>
              <p>
                Se identificar qualquer vulnerabilidade ou problema de segurança na nossa plataforma, entre em contacto connosco imediatamente através do WhatsApp. Levamos todas as denúncias a sério e agimos rapidamente para resolver quaisquer problemas.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Security;
