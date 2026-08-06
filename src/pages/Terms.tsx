import { LegalPageLayout } from "@/components/LegalPageLayout";

const Terms = () => (
  <LegalPageLayout title="Termos de Uso – MOVA AGRO" updatedAt="13 de Julho de 2026">
    <p className="text-sm">Versão: 1.0</p>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">1. APRESENTAÇÃO</h2>
      <p>
        Bem-vindo(a) à MOVA AGRO, plataforma digital operada pela MOVA AGRO, LDA, pessoa coletiva
        constituída de acordo com as leis da República de Moçambique, com sede na Província da
        Zambézia, Distrito de Quelimane, Bairro Cimento, Avenida: Eduardo Mondlane, doravante
        denominada simplesmente &quot;MOVA AGRO&quot;.
      </p>
      <p>
        Estes Termos de Uso estabelecem as regras para acesso e utilização da plataforma digital
        MOVA AGRO por cooperativas agrícolas, produtores rurais, transportadoras, motoristas,
        empresas, parceiros comerciais e demais usuários.
      </p>
      <p>
        Ao criar uma conta, acessar ou utilizar qualquer funcionalidade da plataforma, o usuário
        declara que leu, compreendeu e concorda integralmente com estes Termos.
      </p>
      <p>
        Caso não concorde com qualquer disposição deste documento, deverá interromper
        imediatamente a utilização da plataforma.
      </p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">2. DEFINIÇÕES</h2>
      <p>Para fins destes Termos, considera-se:</p>

      <h3 className="text-lg font-semibold text-foreground">Plataforma</h3>
      <p>
        Sistema digital disponibilizado pela MOVA AGRO para intermediação de serviços de
        transporte agrícola.
      </p>

      <h3 className="text-lg font-semibold text-foreground">Usuário</h3>
      <p>Pessoa singular ou coletiva cadastrada na plataforma.</p>

      <h3 className="text-lg font-semibold text-foreground">Cooperativa</h3>
      <p>Pessoa coletiva responsável por publicar pedidos de transporte de produtos agrícolas.</p>

      <h3 className="text-lg font-semibold text-foreground">Embarcador</h3>
      <p>Pessoa física ou jurídica responsável pela carga.</p>

      <h3 className="text-lg font-semibold text-foreground">Transportadora</h3>
      <p>Empresa legalmente autorizada a realizar transporte de cargas.</p>

      <h3 className="text-lg font-semibold text-foreground">Motorista</h3>
      <p>Pessoa habilitada responsável pela condução do veículo.</p>

      <h3 className="text-lg font-semibold text-foreground">Carga</h3>
      <p>Produtos agrícolas ou insumos cadastrados na plataforma.</p>

      <h3 className="text-lg font-semibold text-foreground">Viagem</h3>
      <p>Operação de transporte iniciada após aceite da proposta.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">3. OBJETO</h2>
      <p>
        A MOVA AGRO disponibiliza uma plataforma tecnológica destinada a aproximar cooperativas,
        produtores rurais, embarcadores e transportadoras para facilitar a negociação, contratação
        e acompanhamento de serviços de transporte de produtos agrícolas.
      </p>
      <p>A plataforma oferece, entre outras funcionalidades:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>cadastro de usuários;</li>
        <li>cadastro de veículos;</li>
        <li>cadastro de motoristas;</li>
        <li>publicação de cargas;</li>
        <li>busca de fretes;</li>
        <li>negociação entre as partes;</li>
        <li>gestão de viagens;</li>
        <li>rastreamento GPS;</li>
        <li>gestão documental;</li>
        <li>processamento de pagamentos;</li>
        <li>histórico de operações;</li>
        <li>comunicação entre usuários.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">4. NATUREZA DA MOVA AGRO</h2>
      <p>A MOVA AGRO atua exclusivamente como plataforma tecnológica de intermediação.</p>
      <p>A MOVA AGRO NÃO É:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>transportadora;</li>
        <li>empresa de logística;</li>
        <li>seguradora;</li>
        <li>proprietária dos veículos;</li>
        <li>empregadora dos motoristas;</li>
        <li>proprietária das cargas;</li>
        <li>operadora portuária;</li>
        <li>despachante de cargas.</li>
      </ul>
      <p>
        A responsabilidade pela execução do transporte pertence exclusivamente às partes
        contratantes.
      </p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">5. ACEITAÇÃO DOS TERMOS</h2>
      <p>Ao utilizar a plataforma, o usuário declara que:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>possui capacidade legal para contratar;</li>
        <li>fornecerá informações verdadeiras;</li>
        <li>manterá seus dados atualizados;</li>
        <li>respeitará estes Termos;</li>
        <li>cumprirá a legislação aplicável.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">6. CADASTRO</h2>
      <p>Para utilizar determinadas funcionalidades será necessário criar uma conta.</p>
      <p>Durante o cadastro poderão ser solicitados:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Nome completo;</li>
        <li>Razão social;</li>
        <li>E-mail;</li>
        <li>Número de telefone;</li>
        <li>NUIT;</li>
        <li>Bilhete de Identidade;</li>
        <li>Carta de condução;</li>
        <li>Documento do veículo;</li>
        <li>Licença da transportadora;</li>
        <li>Fotografias;</li>
        <li>Contratos;</li>
        <li>Comprovativos;</li>
        <li>Outros documentos necessários à verificação.</li>
      </ul>
      <p>A MOVA AGRO poderá solicitar documentos adicionais sempre que entender necessário.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">7. VERIFICAÇÃO</h2>
      <p>
        A MOVA AGRO poderá realizar procedimentos de verificação de identidade (&quot;Know Your
        Customer&quot; – KYC), incluindo:
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li>validação documental;</li>
        <li>conferência de licenças;</li>
        <li>confirmação de contatos;</li>
        <li>análise de autenticidade dos documentos enviados.</li>
      </ul>
      <p>O usuário autoriza tais verificações ao utilizar a plataforma.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">8. RESPONSABILIDADES DAS COOPERATIVAS</h2>
      <p>As cooperativas comprometem-se a:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>publicar informações verdadeiras;</li>
        <li>informar corretamente peso, quantidade e tipo da carga;</li>
        <li>fornecer documentação exigida;</li>
        <li>efetuar pagamentos conforme acordado;</li>
        <li>cumprir a legislação agrícola e comercial aplicável.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">9. RESPONSABILIDADES DAS TRANSPORTADORAS</h2>
      <p>As transportadoras comprometem-se a:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>possuir autorização legal para operar;</li>
        <li>manter veículos em condições adequadas;</li>
        <li>possuir seguro quando exigido pela legislação;</li>
        <li>respeitar rotas e prazos;</li>
        <li>garantir a integridade da carga durante o transporte;</li>
        <li>utilizar motoristas habilitados.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">10. RESPONSABILIDADES DOS MOTORISTAS</h2>
      <p>Os motoristas deverão:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>possuir carta de condução válida;</li>
        <li>respeitar o Código da Estrada;</li>
        <li>cumprir os horários acordados;</li>
        <li>manter comportamento profissional;</li>
        <li>comunicar ocorrências durante a viagem.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">11. PAGAMENTOS</h2>
      <p>A MOVA AGRO poderá processar pagamentos por meio de:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>M-Pesa Paga Fácil;</li>
        <li>BCI Paga Fácil;</li>
        <li>Transferência bancária;</li>
        <li>Outros meios disponibilizados futuramente.</li>
      </ul>
      <p>
        A MOVA AGRO poderá receber os valores pagos pelo contratante e repassá-los à
        transportadora, descontadas as taxas aplicáveis.
      </p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">12. TAXAS</h2>
      <p>A utilização da plataforma poderá estar sujeita à cobrança de:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>taxa de intermediação;</li>
        <li>taxa administrativa;</li>
        <li>taxa de processamento de pagamentos;</li>
        <li>outros serviços opcionais.</li>
      </ul>
      <p>Os valores serão informados previamente aos usuários.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">13. RASTREAMENTO GPS</h2>
      <p>Durante a execução da viagem, a plataforma poderá coletar:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>localização em tempo real;</li>
        <li>velocidade;</li>
        <li>rota;</li>
        <li>horários;</li>
        <li>pontos de parada;</li>
        <li>confirmação de entrega.</li>
      </ul>
      <p>
        Essas informações destinam-se exclusivamente à execução do serviço, segurança da carga,
        prevenção de fraudes e melhoria da plataforma.
      </p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">14. DOCUMENTOS ENVIADOS</h2>
      <p>Os usuários poderão enviar:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>fotografias;</li>
        <li>contratos;</li>
        <li>comprovativos;</li>
        <li>documentos pessoais;</li>
        <li>documentos empresariais;</li>
        <li>documentos do veículo.</li>
      </ul>
      <p>O usuário declara possuir autorização para compartilhar tais documentos.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">15. PROPRIEDADE INTELECTUAL</h2>
      <p>Todo o conteúdo da plataforma, incluindo:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>software;</li>
        <li>banco de dados;</li>
        <li>logotipo;</li>
        <li>identidade visual;</li>
        <li>marca MOVA AGRO;</li>
        <li>textos;</li>
        <li>imagens;</li>
        <li>funcionalidades;</li>
        <li>código-fonte;</li>
      </ul>
      <p>
        é protegido pelas leis de propriedade intelectual e pertence exclusivamente à MOVA AGRO,
        LDA ou a seus licenciadores.
      </p>
      <p>
        É proibida a reprodução, distribuição, modificação ou exploração desses conteúdos sem
        autorização prévia e por escrito.
      </p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">16. CONDUTAS PROIBIDAS</h2>
      <p>É proibido ao usuário:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>fornecer informações falsas;</li>
        <li>utilizar documentos falsificados;</li>
        <li>praticar fraude;</li>
        <li>manipular pagamentos;</li>
        <li>utilizar a plataforma para atividades ilícitas;</li>
        <li>violar sistemas de segurança;</li>
        <li>compartilhar credenciais;</li>
        <li>utilizar robôs ou automações não autorizadas;</li>
        <li>assediar ou ameaçar outros usuários;</li>
        <li>publicar cargas inexistentes ou informações enganosas.</li>
      </ul>
      <p>
        A violação destas regras poderá resultar em advertência, suspensão ou exclusão definitiva
        da conta, sem prejuízo das medidas legais cabíveis.
      </p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">17. SUSPENSÃO E ENCERRAMENTO DA CONTA</h2>
      <p>A MOVA AGRO poderá suspender ou encerrar contas quando houver:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>indícios de fraude;</li>
        <li>uso indevido da plataforma;</li>
        <li>descumprimento destes Termos;</li>
        <li>determinação judicial ou administrativa;</li>
        <li>riscos à segurança da plataforma ou de outros usuários.</li>
      </ul>
      <p>
        O usuário também poderá solicitar o encerramento de sua conta, observadas as obrigações
        legais e contratuais pendentes.
      </p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">18. LIMITAÇÃO DE RESPONSABILIDADE</h2>
      <p>
        A MOVA AGRO disponibiliza apenas a infraestrutura tecnológica para intermediação entre
        usuários.
      </p>
      <p>Assim, a MOVA AGRO não será responsável por:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>acidentes de trânsito;</li>
        <li>avarias, perdas ou extravios de cargas;</li>
        <li>furtos ou roubos;</li>
        <li>atrasos decorrentes de fatores externos;</li>
        <li>danos causados por motoristas ou transportadoras;</li>
        <li>inadimplência entre as partes;</li>
        <li>qualidade dos serviços prestados pelas transportadoras;</li>
        <li>lucros cessantes ou prejuízos indiretos.</li>
      </ul>
      <p>
        As responsabilidades decorrentes da execução do transporte pertencem exclusivamente ao
        embarcador e à transportadora.
      </p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">19. FORÇA MAIOR</h2>
      <p>
        A MOVA AGRO não será responsável por falhas ou interrupções decorrentes de eventos de
        força maior, incluindo desastres naturais, conflitos, greves, falhas de energia, ataques
        cibernéticos ou indisponibilidade de serviços de terceiros.
      </p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">20. ALTERAÇÕES DOS TERMOS</h2>
      <p>
        A MOVA AGRO poderá atualizar estes Termos a qualquer momento para refletir mudanças
        legais, regulatórias ou operacionais.
      </p>
      <p>
        A versão mais recente estará sempre disponível na plataforma, indicando a data da última
        atualização.
      </p>
      <p>
        O uso continuado da plataforma após a publicação das alterações implicará a aceitação dos
        novos Termos.
      </p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">21. LEGISLAÇÃO APLICÁVEL</h2>
      <p>
        Estes Termos são regidos pelas leis da República de Moçambique, especialmente pela
        legislação civil, comercial, de proteção de dados e demais normas aplicáveis.
      </p>
      <p>
        Quando aplicável às operações internacionais, poderão ser observados princípios
        reconhecidos internacionalmente de proteção de dados e comércio eletrônico.
      </p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">22. RESOLUÇÃO DE CONFLITOS</h2>
      <p>
        As partes comprometem-se a buscar solução amigável para quaisquer controvérsias
        decorrentes da utilização da plataforma.
      </p>
      <p>
        Não sendo possível a resolução amigável, fica eleito o foro competente da Província da
        Zambézia, República de Moçambique, para dirimir quaisquer litígios, salvo disposição legal
        em contrário.
      </p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">23. CONTATO</h2>
      <p>
        Para dúvidas, solicitações ou assuntos jurídicos relacionados a estes Termos, os usuários
        poderão entrar em contato com:
      </p>
      <p>MOVA AGRO, LDA</p>
      <p>📍 Endereço:</p>
      <p>
        Província da Zambézia, Distrito de Quelimane, Bairro Cimento, Avenida: Eduardo Mondlane,
        Moçambique.
      </p>
      <p>📧 E-mail jurídico:</p>
      <p>
        <a href="mailto:movaagro@gmail.com" className="text-primary hover:underline">
          movaagro@gmail.com
        </a>
      </p>
      <p>
        Este documento entra em vigor na data de sua publicação e permanece válido até que seja
        substituído por versão posterior aprovada pela MOVA AGRO, LDA.
      </p>
    </section>
  </LegalPageLayout>
);

export default Terms;
