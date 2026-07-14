import { LegalPageLayout } from "@/components/LegalPageLayout";

const Privacy = () => (
  <LegalPageLayout title="Política de Privacidade – MOVA AGRO" updatedAt="13 de Julho de 2026">
    <p className="text-sm">Versão: 1.0</p>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">1. Apresentação</h2>
      <p>
        A presente Política de Privacidade descreve como a MOVA AGRO, LDA ("MOVA AGRO", "nós" ou "plataforma") coleta, utiliza, armazena, protege, compartilha e trata os dados pessoais dos usuários que utilizam a plataforma digital MOVA AGRO.
      </p>
      <p>Esta Política aplica-se a todos os usuários da plataforma, incluindo:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Cooperativas Agrícolas;</li>
        <li>Produtores Rurais;</li>
        <li>Transportadoras;</li>
        <li>Motoristas;</li>
        <li>Empresas Parceiras;</li>
        <li>Clientes;</li>
        <li>Visitantes do Website.</li>
      </ul>
      <p>Nos comprometemos a tratar os dados pessoais de forma transparente, ética e segura, em conformidade com:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Lei n.º 3/2017 da República de Moçambique (Proteção de Dados Pessoais);</li>
        <li>princípios do Regulamento Geral de Proteção de Dados da União Europeia (GDPR), quando aplicáveis;</li>
        <li>demais normas legais relacionadas à privacidade, segurança da informação e comércio eletrônico.</li>
      </ul>
      <p>Ao utilizar a plataforma, o usuário declara que leu e concorda com esta Política.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">2. Quem Somos</h2>
      <p>A plataforma é operada por:</p>
      <p>
        <strong>MOVA AGRO, LDA</strong><br />
        Província da Zambézia<br />
        Distrito de Quelimane<br />
        Bairro Cimento<br />
        Rua 1115<br />
        Moçambique
      </p>
      <p>E-mail para assuntos de privacidade: <a href="mailto:movaagro@gmail.com" className="text-primary hover:underline">movaagro@gmail.com</a></p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">3. Dados que Coletamos</h2>

      <h3 className="text-lg font-semibold text-foreground">3.1 Dados de Cadastro</h3>
      <p>Durante a criação da conta poderão ser solicitados:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Nome completo;</li>
        <li>Razão social;</li>
        <li>Número de telefone;</li>
        <li>Endereço de e-mail;</li>
        <li>NUIT;</li>
        <li>Bilhete de Identidade;</li>
        <li>Endereço;</li>
        <li>Data de nascimento (quando aplicável).</li>
      </ul>

      <h3 className="text-lg font-semibold text-foreground">3.2 Dados Profissionais</h3>
      <p>No caso das transportadoras e motoristas poderão ser coletados:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Carta de Condução;</li>
        <li>Categoria da Carta;</li>
        <li>Licença da Transportadora;</li>
        <li>Documento Único do Veículo;</li>
        <li>Matrícula;</li>
        <li>Marca;</li>
        <li>Modelo;</li>
        <li>Ano de fabrico;</li>
        <li>Capacidade de carga.</li>
      </ul>

      <h3 className="text-lg font-semibold text-foreground">3.3 Dados Financeiros</h3>
      <p>Quando houver pagamentos pela plataforma poderão ser coletados:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Número da conta bancária;</li>
        <li>Dados do MPesa;</li>
        <li>Dados do BCI Paga Fácil;</li>
        <li>Histórico de pagamentos;</li>
        <li>Valor das transações;</li>
        <li>Comprovativos.</li>
      </ul>
      <p>A MOVA AGRO não armazena senhas bancárias.</p>

      <h3 className="text-lg font-semibold text-foreground">3.4 Dados da Operação</h3>
      <p>Durante o uso da plataforma registramos:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>cargas cadastradas;</li>
        <li>propostas enviadas;</li>
        <li>fretes aceitos;</li>
        <li>histórico de viagens;</li>
        <li>entregas realizadas;</li>
        <li>cancelamentos;</li>
        <li>avaliações;</li>
        <li>mensagens entre usuários.</li>
      </ul>

      <h3 className="text-lg font-semibold text-foreground">3.5 Dados de Localização</h3>
      <p>Durante a execução do transporte poderão ser coletados:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>GPS em tempo real;</li>
        <li>velocidade;</li>
        <li>direção;</li>
        <li>localização;</li>
        <li>rota;</li>
        <li>horário de partida;</li>
        <li>horário de chegada;</li>
        <li>paradas.</li>
      </ul>
      <p>O rastreamento permanecerá ativo apenas durante a viagem contratada.</p>

      <h3 className="text-lg font-semibold text-foreground">3.6 Arquivos Enviados</h3>
      <p>Os usuários poderão enviar:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>fotografias;</li>
        <li>documentos pessoais;</li>
        <li>contratos;</li>
        <li>comprovativos;</li>
        <li>documentos do veículo;</li>
        <li>documentos da empresa;</li>
        <li>licenças.</li>
      </ul>

      <h3 className="text-lg font-semibold text-foreground">3.7 Dados Técnicos</h3>
      <p>Também coletamos automaticamente:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>endereço IP;</li>
        <li>navegador;</li>
        <li>dispositivo utilizado;</li>
        <li>sistema operacional;</li>
        <li>idioma;</li>
        <li>data e hora dos acessos;</li>
        <li>logs de segurança;</li>
        <li>cookies.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">4. Como Coletamos os Dados</h2>
      <ul className="list-disc pl-6 space-y-1">
        <li>durante o cadastro;</li>
        <li>durante a utilização da plataforma;</li>
        <li>durante pagamentos;</li>
        <li>durante o rastreamento GPS;</li>
        <li>através dos cookies;</li>
        <li>através do suporte;</li>
        <li>mediante envio voluntário pelo usuário.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">5. Finalidade do Tratamento</h2>
      <p>Os dados são utilizados para:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>criar contas;</li>
        <li>verificar identidade;</li>
        <li>validar documentos;</li>
        <li>localizar veículos;</li>
        <li>intermediar fretes;</li>
        <li>processar pagamentos;</li>
        <li>prevenir fraudes;</li>
        <li>prestar suporte;</li>
        <li>melhorar a plataforma;</li>
        <li>cumprir obrigações legais;</li>
        <li>emitir relatórios;</li>
        <li>realizar auditorias;</li>
        <li>resolver conflitos.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">6. Base Legal</h2>
      <p>Os dados poderão ser tratados com fundamento em:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>consentimento;</li>
        <li>execução de contrato;</li>
        <li>cumprimento de obrigação legal;</li>
        <li>legítimo interesse;</li>
        <li>proteção ao crédito;</li>
        <li>prevenção de fraudes;</li>
        <li>exercício regular de direitos.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">7. Compartilhamento dos Dados</h2>
      <p>A MOVA AGRO poderá compartilhar informações com:</p>

      <h3 className="text-lg font-semibold text-foreground">Instituições Financeiras</h3>
      <ul className="list-disc pl-6 space-y-1">
        <li>Bancos;</li>
        <li>MPesa;</li>
        <li>BCI Paga Fácil;</li>
        <li>demais parceiros financeiros.</li>
      </ul>

      <h3 className="text-lg font-semibold text-foreground">Prestadores de Tecnologia</h3>
      <p>Empresas responsáveis por:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>hospedagem;</li>
        <li>armazenamento;</li>
        <li>servidores;</li>
        <li>backups;</li>
        <li>monitoramento;</li>
        <li>segurança;</li>
        <li>autenticação.</li>
      </ul>

      <h3 className="text-lg font-semibold text-foreground">Parceiros Logísticos</h3>
      <p>Quando necessário:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Cooperativas;</li>
        <li>Transportadoras;</li>
        <li>Motoristas;</li>
        <li>Embarcadores.</li>
      </ul>

      <h3 className="text-lg font-semibold text-foreground">Autoridades</h3>
      <p>Quando exigido por lei ou decisão judicial.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">8. Transferência Internacional</h2>
      <p>
        Como a MOVA AGRO poderá atuar futuramente em países da SADC e outros mercados africanos, determinados dados poderão ser processados fora de Moçambique.
      </p>
      <p>Sempre adotaremos medidas adequadas para garantir proteção equivalente.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">9. Geolocalização</h2>
      <p>Durante a viagem será realizado rastreamento GPS. Os dados serão utilizados para:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>segurança da carga;</li>
        <li>confirmação de entrega;</li>
        <li>prevenção de fraudes;</li>
        <li>monitoramento operacional;</li>
        <li>suporte.</li>
      </ul>
      <p>O usuário poderá visualizar essas informações durante a operação.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">10. Retenção dos Dados</h2>
      <p>Os dados poderão permanecer armazenados enquanto:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>a conta estiver ativa;</li>
        <li>houver obrigação legal;</li>
        <li>existir processo judicial;</li>
        <li>houver necessidade de auditoria;</li>
        <li>houver necessidade fiscal.</li>
      </ul>
      <p>Após esse período serão eliminados ou anonimizados.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">11. Direitos dos Titulares</h2>
      <p>O usuário poderá solicitar:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>confirmação do tratamento;</li>
        <li>acesso aos dados;</li>
        <li>correção;</li>
        <li>atualização;</li>
        <li>portabilidade;</li>
        <li>anonimização;</li>
        <li>exclusão;</li>
        <li>revogação do consentimento;</li>
        <li>oposição ao tratamento quando permitido pela legislação.</li>
      </ul>
      <p>As solicitações deverão ser enviadas para: <a href="mailto:movaagro@gmail.com" className="text-primary hover:underline">movaagro@gmail.com</a></p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">12. Segurança dos Dados</h2>
      <p>A MOVA AGRO utiliza medidas técnicas e administrativas para proteger as informações, incluindo:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>criptografia TLS/SSL;</li>
        <li>autenticação;</li>
        <li>controle de acesso;</li>
        <li>backups;</li>
        <li>logs;</li>
        <li>monitoramento;</li>
        <li>proteção contra invasões;</li>
        <li>auditoria.</li>
      </ul>
      <p>Apesar das medidas adotadas, nenhum sistema é absolutamente seguro.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">13. Responsabilidade dos Usuários</h2>
      <p>O usuário compromete-se a:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>proteger sua senha;</li>
        <li>manter seus dados atualizados;</li>
        <li>não compartilhar credenciais;</li>
        <li>utilizar dispositivos confiáveis;</li>
        <li>comunicar imediatamente qualquer acesso suspeito.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">14. Menores de Idade</h2>
      <p>A plataforma não é destinada a menores de 18 anos.</p>
      <p>Caso seja identificado cadastro realizado por menor sem autorização legal, a conta poderá ser encerrada.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">15. Cookies</h2>
      <p>A MOVA AGRO utiliza cookies para:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>autenticação;</li>
        <li>segurança;</li>
        <li>estatísticas;</li>
        <li>preferências;</li>
        <li>melhoria da experiência.</li>
      </ul>
      <p>A Política de Cookies complementa esta Política de Privacidade.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">16. Links para Terceiros</h2>
      <p>A plataforma poderá conter links para sites e serviços de terceiros.</p>
      <p>A MOVA AGRO não é responsável pelas práticas de privacidade desses terceiros.</p>
      <p>Recomenda-se a leitura das respectivas políticas.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">17. Alterações da Política</h2>
      <p>Esta Política poderá ser alterada a qualquer momento.</p>
      <p>Sempre que houver alterações relevantes, a nova versão será publicada na plataforma com indicação da data de atualização.</p>
      <p>O uso continuado da plataforma após as alterações implica aceitação da versão atualizada.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">18. Encarregado de Privacidade</h2>
      <p>Questões relacionadas à proteção de dados poderão ser encaminhadas para:</p>
      <p>
        <strong>MOVA AGRO, LDA</strong><br />
        Província da Zambézia<br />
        Distrito de Quelimane<br />
        Bairro Cimento<br />
        Rua 1115<br />
        Moçambique
      </p>
      <p>E-mail: <a href="mailto:movaagro@gmail.com" className="text-primary hover:underline">movaagro@gmail.com</a></p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">19. Legislação Aplicável</h2>
      <p>Esta Política será interpretada de acordo com:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Constituição da República de Moçambique;</li>
        <li>Lei n.º 3/2017 (Proteção de Dados Pessoais);</li>
        <li>legislação comercial aplicável;</li>
        <li>princípios internacionais de proteção de dados.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">20. Disposições Finais</h2>
      <p>Ao utilizar a plataforma MOVA AGRO, o usuário declara que:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>leu esta Política;</li>
        <li>compreendeu seu conteúdo;</li>
        <li>concorda com o tratamento dos dados pessoais conforme aqui descrito;</li>
        <li>autoriza a MOVA AGRO a tratar seus dados para execução dos serviços contratados e cumprimento das obrigações legais.</li>
      </ul>
    </section>
  </LegalPageLayout>
);

export default Privacy;
