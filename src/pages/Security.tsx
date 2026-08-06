import { Link } from "react-router-dom";
import { ArrowLeft, Truck } from "lucide-react";
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
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
            Política de Segurança da Informação – MOVA AGRO
          </h1>
          <p className="text-sm text-muted-foreground mb-8">Atualizado em: 13 de Julho de 2026</p>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            <p className="text-sm">Versão: 1.0</p>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">1. APRESENTAÇÃO</h2>
              <p>
                A presente Política de Segurança da Informação estabelece as diretrizes, princípios, controles e responsabilidades adotados pela MOVA AGRO, LDA para proteger as informações tratadas pela plataforma MOVA AGRO.
              </p>
              <p>
                O objetivo desta Política é garantir a confidencialidade, integridade, disponibilidade, autenticidade e rastreabilidade das informações, reduzindo riscos relacionados ao uso indevido, perda, alteração, divulgação não autorizada ou indisponibilidade de dados.
              </p>
              <p>
                Esta Política aplica-se a todos os usuários, colaboradores, administradores, parceiros, prestadores de serviços e terceiros que utilizem ou tenham acesso aos sistemas da MOVA AGRO.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">2. OBJETIVOS</h2>
              <p>São objetivos desta Política:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>proteger os ativos de informação da MOVA AGRO;</li>
                <li>garantir a continuidade das operações da plataforma;</li>
                <li>prevenir acessos não autorizados;</li>
                <li>reduzir riscos de fraude;</li>
                <li>proteger dados pessoais e empresariais;</li>
                <li>assegurar conformidade com a legislação aplicável;</li>
                <li>promover boas práticas de segurança da informação.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">3. PRINCÍPIOS DA SEGURANÇA DA INFORMAÇÃO</h2>
              <p>A MOVA AGRO adota os seguintes princípios:</p>

              <h3 className="text-lg font-semibold text-foreground">3.1 Confidencialidade</h3>
              <p>As informações somente poderão ser acessadas por pessoas devidamente autorizadas.</p>

              <h3 className="text-lg font-semibold text-foreground">3.2 Integridade</h3>
              <p>Os dados deverão permanecer completos, corretos e protegidos contra alterações não autorizadas.</p>

              <h3 className="text-lg font-semibold text-foreground">3.3 Disponibilidade</h3>
              <p>
                Os sistemas e informações deverão permanecer acessíveis aos usuários autorizados sempre que necessário, respeitadas as manutenções programadas e eventuais indisponibilidades por motivos de segurança.
              </p>

              <h3 className="text-lg font-semibold text-foreground">3.4 Autenticidade</h3>
              <p>A identidade dos usuários deverá ser validada por mecanismos seguros de autenticação.</p>

              <h3 className="text-lg font-semibold text-foreground">3.5 Rastreabilidade</h3>
              <p>Todas as operações relevantes poderão ser registradas em logs para auditoria e investigação de incidentes.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">4. ABRANGÊNCIA</h2>
              <p>Esta Política aplica-se a:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>plataforma web;</li>
                <li>aplicação móvel;</li>
                <li>banco de dados;</li>
                <li>APIs;</li>
                <li>servidores;</li>
                <li>backups;</li>
                <li>sistemas internos;</li>
                <li>infraestrutura em nuvem;</li>
                <li>documentos digitais;</li>
                <li>dispositivos autorizados;</li>
                <li>comunicações eletrônicas.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">5. CLASSIFICAÇÃO DAS INFORMAÇÕES</h2>
              <p>As informações tratadas pela MOVA AGRO poderão ser classificadas como:</p>

              <h3 className="text-lg font-semibold text-foreground">Pública</h3>
              <p>Informações destinadas ao público em geral.</p>
              <p>Exemplos:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>conteúdo institucional;</li>
                <li>materiais de divulgação;</li>
                <li>comunicados públicos.</li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground">Uso Interno</h3>
              <p>Informações destinadas exclusivamente às atividades internas da MOVA AGRO.</p>
              <p>Exemplos:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>procedimentos operacionais;</li>
                <li>documentação administrativa;</li>
                <li>relatórios internos.</li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground">Confidencial</h3>
              <p>Informações cujo acesso deve ser restrito.</p>
              <p>Exemplos:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>dados pessoais;</li>
                <li>documentos enviados pelos usuários;</li>
                <li>informações financeiras;</li>
                <li>contratos;</li>
                <li>credenciais.</li>
              </ul>

              <h3 className="text-lg font-semibold text-foreground">Restrita</h3>
              <p>Informações críticas para o funcionamento da plataforma.</p>
              <p>Exemplos:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>chaves criptográficas;</li>
                <li>segredos de API;</li>
                <li>credenciais administrativas;</li>
                <li>configurações de infraestrutura;</li>
                <li>certificados digitais.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">6. CONTROLE DE ACESSO</h2>
              <p>
                O acesso aos sistemas observará o princípio do menor privilégio, garantindo que cada usuário tenha acesso apenas aos recursos necessários para desempenhar suas funções.
              </p>
              <p>A MOVA AGRO poderá implementar:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>autenticação por senha;</li>
                <li>autenticação multifator (MFA);</li>
                <li>controle baseado em perfis de acesso;</li>
                <li>limitação de sessões simultâneas;</li>
                <li>encerramento automático de sessões inativas.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">7. SENHAS</h2>
              <p>Os usuários deverão:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>criar senhas fortes;</li>
                <li>manter suas credenciais em sigilo;</li>
                <li>não compartilhar senhas com terceiros;</li>
                <li>alterar imediatamente a senha em caso de suspeita de comprometimento.</li>
              </ul>
              <p>
                A MOVA AGRO armazenará senhas apenas em formato criptografado (hash), utilizando algoritmos reconhecidos pelas boas práticas de segurança.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">8. CRIPTOGRAFIA</h2>
              <p>
                A MOVA AGRO utilizará mecanismos de criptografia para proteger dados em trânsito e, sempre que aplicável, dados armazenados.
              </p>
              <p>Entre as medidas adotadas poderão estar:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>HTTPS com TLS/SSL;</li>
                <li>criptografia de backups;</li>
                <li>armazenamento seguro de credenciais;</li>
                <li>proteção de chaves criptográficas.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">9. SEGURANÇA DOS SERVIDORES</h2>
              <p>Os servidores utilizados pela MOVA AGRO deverão possuir medidas adequadas de proteção, incluindo:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>atualizações de segurança;</li>
                <li>monitoramento contínuo;</li>
                <li>controle de acesso administrativo;</li>
                <li>firewall;</li>
                <li>proteção contra malware;</li>
                <li>segmentação de rede;</li>
                <li>mecanismos de redundância quando aplicáveis.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">10. BACKUPS</h2>
              <p>A MOVA AGRO manterá rotinas periódicas de backup para garantir a recuperação de dados em caso de falhas.</p>
              <p>Os backups poderão ser:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>automáticos;</li>
                <li>criptografados;</li>
                <li>armazenados em ambiente seguro;</li>
                <li>testados periodicamente para verificação de integridade.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">11. MONITORAMENTO</h2>
              <p>Os sistemas poderão registrar logs relacionados a:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>autenticação;</li>
                <li>acessos;</li>
                <li>alterações cadastrais;</li>
                <li>operações financeiras;</li>
                <li>movimentação de cargas;</li>
                <li>ações administrativas;</li>
                <li>eventos de segurança.</li>
              </ul>
              <p>Os registros serão utilizados para auditoria, prevenção de fraudes e investigação de incidentes.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">12. INCIDENTES DE SEGURANÇA</h2>
              <p>Considera-se incidente de segurança qualquer evento que possa comprometer:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>a confidencialidade;</li>
                <li>a integridade;</li>
                <li>a disponibilidade;</li>
                <li>a autenticidade das informações.</li>
              </ul>
              <p>Exemplos:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>acessos não autorizados;</li>
                <li>vazamento de dados;</li>
                <li>perda de informações;</li>
                <li>ataques cibernéticos;</li>
                <li>infecção por malware;</li>
                <li>indisponibilidade de sistemas.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">13. RESPOSTA A INCIDENTES</h2>
              <p>Ao identificar um incidente, a MOVA AGRO poderá adotar medidas como:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>contenção do incidente;</li>
                <li>análise técnica;</li>
                <li>investigação das causas;</li>
                <li>recuperação dos sistemas;</li>
                <li>comunicação aos usuários afetados, quando aplicável;</li>
                <li>comunicação às autoridades competentes, quando exigido por lei;</li>
                <li>implementação de ações corretivas para evitar recorrências.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">14. RESPONSABILIDADES DOS USUÁRIOS</h2>
              <p>Os usuários comprometem-se a:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>utilizar a plataforma de forma segura;</li>
                <li>proteger suas credenciais de acesso;</li>
                <li>não compartilhar contas;</li>
                <li>manter seus dispositivos protegidos contra vírus e malware;</li>
                <li>comunicar imediatamente qualquer suspeita de uso indevido de sua conta ou incidente de segurança.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">15. RESPONSABILIDADES DA MOVA AGRO</h2>
              <p>A MOVA AGRO compromete-se a:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>adotar medidas técnicas e organizacionais adequadas para proteger os dados;</li>
                <li>revisar periodicamente seus controles de segurança;</li>
                <li>promover treinamentos internos quando aplicável;</li>
                <li>monitorar continuamente os sistemas;</li>
                <li>responder prontamente a incidentes de segurança.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">16. PARCEIROS E FORNECEDORES</h2>
              <p>
                Prestadores de serviços que tenham acesso a informações tratadas pela MOVA AGRO deverão adotar padrões de segurança compatíveis com esta Política e com a legislação aplicável.
              </p>
              <p>Quando necessário, poderão ser celebrados acordos de confidencialidade e proteção de dados.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">17. AUDITORIA</h2>
              <p>A MOVA AGRO poderá realizar auditorias periódicas para verificar:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>conformidade com esta Política;</li>
                <li>funcionamento dos controles de segurança;</li>
                <li>integridade dos sistemas;</li>
                <li>gestão de riscos;</li>
                <li>cumprimento das obrigações legais.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">18. CONTINUIDADE DOS NEGÓCIOS</h2>
              <p>
                A MOVA AGRO manterá procedimentos destinados a assegurar a continuidade dos serviços em caso de incidentes relevantes.
              </p>
              <p>Sempre que possível, serão adotadas medidas como:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>recuperação de desastres;</li>
                <li>redundância de serviços críticos;</li>
                <li>restauração de backups;</li>
                <li>planos de contingência.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">19. ALTERAÇÕES DESTA POLÍTICA</h2>
              <p>A MOVA AGRO poderá atualizar esta Política sempre que necessário para refletir:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>mudanças legislativas;</li>
                <li>evolução tecnológica;</li>
                <li>novos riscos;</li>
                <li>melhorias nos processos internos.</li>
              </ul>
              <p>A versão mais recente permanecerá disponível na plataforma.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">20. LEGISLAÇÃO APLICÁVEL</h2>
              <p>Esta Política será interpretada de acordo com:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>a legislação da República de Moçambique;</li>
                <li>a Lei n.º 3/2017 de Proteção de Dados Pessoais;</li>
                <li>demais normas relacionadas à segurança da informação e proteção de dados;</li>
                <li>princípios internacionais de boas práticas de segurança.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">21. CONTATO</h2>
              <p>
                Em caso de dúvidas relacionadas à segurança da informação ou para comunicar incidentes de segurança, entre em contato com:
              </p>
              <p>MOVA AGRO, LDA</p>
              <p>Endereço:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Província da Zambézia</li>
                <li>Distrito de Quelimane</li>
                <li>Bairro Cimento</li>
                <li>Avenida: Eduardo Mondlane</li>
                <li>Moçambique</li>
              </ul>
              <p>E-mail Jurídico e de Segurança:</p>
              <p>
                <a href="mailto:movaagro@gmail.com" className="text-primary hover:underline">movaagro@gmail.com</a>
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">22. DISPOSIÇÕES FINAIS</h2>
              <p>Ao utilizar a plataforma MOVA AGRO, o usuário declara que:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>leu e compreendeu esta Política de Segurança da Informação;</li>
                <li>compromete-se a respeitar as regras de segurança estabelecidas pela MOVA AGRO;</li>
                <li>
                  reconhece que a violação desta Política poderá resultar em medidas administrativas, suspensão de acesso, encerramento da conta e adoção das medidas legais cabíveis.
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Security;
