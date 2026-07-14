import { LegalPageLayout } from "@/components/LegalPageLayout";

const GPSConsent = () => (
  <LegalPageLayout title="Termo de Consentimento para Geolocalização e Rastreamento GPS – MOVA AGRO" updatedAt="13 de Julho de 2026">
    <p className="text-sm">Versão: 1.0</p>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">1. Apresentação</h2>
      <p>
        O presente Termo de Consentimento para Geolocalização e Rastreamento GPS estabelece as condições para coleta, utilização, armazenamento e tratamento de dados de localização dos usuários da plataforma MOVA AGRO, operada pela MOVA AGRO, LDA.
      </p>
      <p>Este documento complementa:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>os Termos de Uso;</li>
        <li>a Política de Privacidade;</li>
        <li>a Política de Segurança da Informação.</li>
      </ul>
      <p>Ao aceitar este Termo, o usuário autoriza expressamente a utilização dos recursos de geolocalização necessários para a execução dos serviços disponibilizados pela plataforma.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">2. Finalidade do Rastreamento</h2>
      <p>A MOVA AGRO utiliza recursos de geolocalização exclusivamente para possibilitar a correta execução das operações logísticas intermediadas pela plataforma.</p>
      <p>O rastreamento possui as seguintes finalidades:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>acompanhar o andamento das viagens;</li>
        <li>confirmar a coleta da carga;</li>
        <li>confirmar a entrega da carga;</li>
        <li>monitorar desvios significativos de rota;</li>
        <li>fornecer informações em tempo real às partes envolvidas;</li>
        <li>aumentar a segurança da carga;</li>
        <li>prevenir fraudes;</li>
        <li>registrar evidências operacionais;</li>
        <li>melhorar os serviços oferecidos.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">3. Dados de Localização Coletados</h2>
      <p>Durante uma operação de transporte poderão ser coletadas informações como:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>localização GPS em tempo real;</li>
        <li>latitude e longitude;</li>
        <li>velocidade do veículo;</li>
        <li>direção de deslocamento;</li>
        <li>horário de início da viagem;</li>
        <li>horário de chegada;</li>
        <li>pontos de parada;</li>
        <li>tempo de permanência em cada parada;</li>
        <li>rota percorrida;</li>
        <li>distância percorrida;</li>
        <li>status da viagem;</li>
        <li>confirmação de entrega.</li>
      </ul>
      <p>Esses dados poderão ser associados ao frete correspondente.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">4. Período de Rastreamento</h2>
      <p>O rastreamento será iniciado apenas quando houver uma viagem ativa na plataforma. A coleta ocorrerá:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>após a confirmação da viagem;</li>
        <li>durante todo o percurso;</li>
        <li>até a conclusão da entrega da carga.</li>
      </ul>
      <p>Após o encerramento da operação, o rastreamento em tempo real será interrompido.</p>
      <p>A MOVA AGRO não realiza rastreamento permanente dos usuários fora das viagens cadastradas na plataforma.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">5. Quem Poderá Visualizar a Localização</h2>
      <p>Os dados de localização poderão ser acessados apenas por pessoas autorizadas. Dependendo da operação, poderão visualizar essas informações:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>a cooperativa contratante;</li>
        <li>o embarcador;</li>
        <li>a transportadora responsável;</li>
        <li>o motorista responsável;</li>
        <li>administradores autorizados da MOVA AGRO;</li>
        <li>autoridades competentes, quando exigido por lei.</li>
      </ul>
      <p>Nenhum outro usuário terá acesso às informações de localização.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">6. Utilização dos Dados</h2>
      <p>As informações coletadas poderão ser utilizadas para:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>acompanhamento operacional;</li>
        <li>confirmação da prestação do serviço;</li>
        <li>resolução de disputas;</li>
        <li>investigação de fraudes;</li>
        <li>atendimento ao cliente;</li>
        <li>geração de relatórios;</li>
        <li>melhoria da plataforma;</li>
        <li>auditorias internas;</li>
        <li>cumprimento de obrigações legais.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">7. Compartilhamento</h2>
      <p>A MOVA AGRO poderá compartilhar dados de localização apenas quando necessário para:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>execução da viagem;</li>
        <li>cumprimento de obrigações legais;</li>
        <li>cumprimento de ordens judiciais;</li>
        <li>investigação de fraudes;</li>
        <li>proteção dos direitos da MOVA AGRO;</li>
        <li>proteção da segurança dos usuários.</li>
      </ul>
      <p>A MOVA AGRO não comercializa dados de geolocalização.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">8. Segurança das Informações</h2>
      <p>Os dados de localização são protegidos por medidas técnicas e administrativas adequadas, incluindo:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>criptografia durante a transmissão;</li>
        <li>armazenamento seguro;</li>
        <li>autenticação de usuários;</li>
        <li>controle de acesso baseado em permissões;</li>
        <li>registro de logs de acesso;</li>
        <li>monitoramento de incidentes de segurança.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">9. Retenção dos Dados de Localização</h2>
      <p>Os registros de localização poderão ser armazenados pelo período necessário para:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>comprovação da execução do transporte;</li>
        <li>resolução de reclamações;</li>
        <li>cumprimento de obrigações legais;</li>
        <li>auditorias;</li>
        <li>prevenção de fraudes;</li>
        <li>defesa de direitos da MOVA AGRO.</li>
      </ul>
      <p>Após esse período, os dados poderão ser excluídos ou anonimizados, salvo obrigação legal em contrário.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">10. Consentimento do Usuário</h2>
      <p>Ao aceitar este Termo, o usuário declara que:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>compreende que o rastreamento GPS é essencial para a execução dos serviços;</li>
        <li>autoriza a coleta de sua localização durante as viagens;</li>
        <li>compreende que o rastreamento será encerrado ao final da operação;</li>
        <li>reconhece que a ausência de geolocalização poderá impedir a utilização de determinadas funcionalidades da plataforma.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">11. Revogação do Consentimento</h2>
      <p>O usuário poderá revogar o consentimento para utilização da geolocalização a qualquer momento.</p>
      <p>Entretanto, a revogação poderá impedir:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>o acompanhamento das viagens;</li>
        <li>a confirmação automática de entregas;</li>
        <li>o uso de determinadas funcionalidades essenciais;</li>
        <li>a contratação de novos fretes por meio da plataforma.</li>
      </ul>
      <p>Caso o tratamento seja necessário para execução de contrato ou cumprimento de obrigação legal, a MOVA AGRO poderá continuar tratando os dados na extensão permitida pela legislação aplicável.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">12. Responsabilidades dos Usuários</h2>
      <p>Os usuários comprometem-se a:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>manter os dispositivos utilizados em condições adequadas de funcionamento;</li>
        <li>não manipular intencionalmente os sistemas de localização;</li>
        <li>não utilizar aplicativos destinados a falsificar a localização do dispositivo ou do veículo;</li>
        <li>comunicar imediatamente qualquer falha relevante no sistema de rastreamento durante a execução da viagem.</li>
      </ul>
      <p>A manipulação fraudulenta da geolocalização poderá resultar em suspensão da conta, cancelamento de operações e adoção das medidas legais cabíveis.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">13. Direitos do Titular dos Dados</h2>
      <p>Nos termos da legislação aplicável, o titular dos dados poderá solicitar:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>confirmação da existência de tratamento;</li>
        <li>acesso aos registros de localização, quando permitido;</li>
        <li>correção de dados inexatos;</li>
        <li>esclarecimentos sobre o tratamento realizado;</li>
        <li>eliminação dos dados quando aplicável;</li>
        <li>revogação do consentimento, observadas as limitações legais e contratuais.</li>
      </ul>
      <p>As solicitações deverão ser encaminhadas para: <a href="mailto:movaagro@gmail.com" className="text-primary hover:underline">movaagro@gmail.com</a></p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">14. Alterações Deste Termo</h2>
      <p>A MOVA AGRO poderá atualizar este Termo sempre que houver alterações:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>na legislação;</li>
        <li>nas funcionalidades da plataforma;</li>
        <li>nos sistemas de geolocalização;</li>
        <li>nos procedimentos internos relacionados ao tratamento de dados.</li>
      </ul>
      <p>A versão mais recente permanecerá disponível na plataforma.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">15. Legislação Aplicável</h2>
      <p>Este Termo será interpretado de acordo com:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>a legislação da República de Moçambique, incluindo a Lei n.º 3/2017 de Proteção de Dados Pessoais;</li>
        <li>os princípios internacionais de proteção de dados, quando aplicáveis;</li>
        <li>os Termos de Uso e a Política de Privacidade da MOVA AGRO.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">16. Contato</h2>
      <p>Em caso de dúvidas relacionadas ao tratamento de dados de geolocalização ou ao exercício de direitos previstos neste Termo, o usuário poderá entrar em contato com:</p>
      <p>
        <strong>MOVA AGRO, LDA</strong><br />
        Província da Zambézia<br />
        Distrito de Quelimane<br />
        Bairro Cimento<br />
        Rua 1115<br />
        Moçambique
      </p>
      <p>E-mail Jurídico: <a href="mailto:movaagro@gmail.com" className="text-primary hover:underline">movaagro@gmail.com</a></p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">17. Declaração de Consentimento</h2>
      <p>Ao selecionar a opção "Li e concordo com o Termo de Consentimento para Geolocalização e Rastreamento GPS" durante o cadastro ou utilização da plataforma, o usuário declara que:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>leu integralmente este documento;</li>
        <li>compreendeu as finalidades da coleta de dados de localização;</li>
        <li>autoriza a MOVA AGRO a realizar o rastreamento GPS durante as viagens intermediadas pela plataforma;</li>
        <li>concorda com o tratamento dos dados de geolocalização para os fins descritos neste Termo;</li>
        <li>reconhece que a geolocalização é um requisito essencial para a prestação dos serviços oferecidos pela MOVA AGRO.</li>
      </ul>
    </section>
  </LegalPageLayout>
);

export default GPSConsent;
