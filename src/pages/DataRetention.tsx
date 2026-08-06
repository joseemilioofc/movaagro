import { LegalPageLayout } from "@/components/LegalPageLayout";

const DataRetention = () => (
  <LegalPageLayout
    title="Política de Retenção e Eliminação de Dados – MOVA AGRO"
    updatedAt="13 de Julho de 2026"
  >
    <p className="text-sm">Versão: 1.0</p>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">1. APRESENTAÇÃO</h2>
      <p>
        A presente Política de Retenção e Eliminação de Dados estabelece as regras adotadas pela MOVA AGRO, LDA para armazenamento, retenção, arquivamento, anonimização e eliminação de dados pessoais e informações operacionais tratadas pela plataforma MOVA AGRO.
      </p>
      <p>Esta Política complementa:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>os Termos de Uso;</li>
        <li>a Política de Privacidade;</li>
        <li>a Política de Segurança da Informação;</li>
        <li>o Termo de Consentimento para Geolocalização.</li>
      </ul>
      <p>
        Seu objetivo é garantir que os dados sejam mantidos apenas pelo tempo necessário para cumprir suas finalidades, obrigações legais e interesses legítimos.
      </p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">2. OBJETIVOS</h2>
      <p>Esta Política busca:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>proteger os direitos dos titulares dos dados;</li>
        <li>reduzir riscos relacionados ao armazenamento excessivo de informações;</li>
        <li>cumprir a legislação aplicável;</li>
        <li>garantir a rastreabilidade das operações;</li>
        <li>assegurar a correta eliminação dos dados quando não forem mais necessários.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">3. ABRANGÊNCIA</h2>
      <p>Esta Política aplica-se a todos os dados tratados pela MOVA AGRO, incluindo informações de:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>cooperativas;</li>
        <li>produtores;</li>
        <li>embarcadores;</li>
        <li>transportadoras;</li>
        <li>motoristas;</li>
        <li>parceiros comerciais;</li>
        <li>colaboradores;</li>
        <li>administradores da plataforma.</li>
      </ul>
      <p>Também se aplica aos dados armazenados em:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>servidores;</li>
        <li>backups;</li>
        <li>bancos de dados;</li>
        <li>sistemas internos;</li>
        <li>plataformas em nuvem;</li>
        <li>dispositivos autorizados.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">4. PRINCÍPIOS</h2>
      <p>A MOVA AGRO observa os seguintes princípios:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>necessidade;</li>
        <li>finalidade;</li>
        <li>proporcionalidade;</li>
        <li>segurança;</li>
        <li>integridade;</li>
        <li>confidencialidade;</li>
        <li>minimização de dados;</li>
        <li>responsabilidade.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">5. CATEGORIAS DE DADOS RETIDOS</h2>
      <p>A plataforma poderá armazenar:</p>

      <h3 className="text-lg font-semibold text-foreground">Dados cadastrais</h3>
      <ul className="list-disc pl-6 space-y-1">
        <li>Nome;</li>
        <li>Razão social;</li>
        <li>NUIT;</li>
        <li>BI;</li>
        <li>telefone;</li>
        <li>e-mail;</li>
        <li>endereço.</li>
      </ul>

      <h3 className="text-lg font-semibold text-foreground">Dados profissionais</h3>
      <ul className="list-disc pl-6 space-y-1">
        <li>Carta de Condução;</li>
        <li>Licença da Transportadora;</li>
        <li>documentos do veículo;</li>
        <li>documentos da empresa.</li>
      </ul>

      <h3 className="text-lg font-semibold text-foreground">Dados financeiros</h3>
      <ul className="list-disc pl-6 space-y-1">
        <li>pagamentos;</li>
        <li>histórico financeiro;</li>
        <li>comprovativos;</li>
        <li>recibos;</li>
        <li>faturas.</li>
      </ul>

      <h3 className="text-lg font-semibold text-foreground">Dados operacionais</h3>
      <ul className="list-disc pl-6 space-y-1">
        <li>viagens;</li>
        <li>cargas;</li>
        <li>entregas;</li>
        <li>avaliações;</li>
        <li>histórico de operações.</li>
      </ul>

      <h3 className="text-lg font-semibold text-foreground">Dados de localização</h3>
      <ul className="list-disc pl-6 space-y-1">
        <li>GPS;</li>
        <li>rotas;</li>
        <li>horários;</li>
        <li>pontos de parada;</li>
        <li>confirmação de entrega.</li>
      </ul>

      <h3 className="text-lg font-semibold text-foreground">Arquivos enviados</h3>
      <ul className="list-disc pl-6 space-y-1">
        <li>fotografias;</li>
        <li>contratos;</li>
        <li>comprovativos;</li>
        <li>documentos pessoais;</li>
        <li>documentos empresariais.</li>
      </ul>

      <h3 className="text-lg font-semibold text-foreground">Logs técnicos</h3>
      <ul className="list-disc pl-6 space-y-1">
        <li>IP;</li>
        <li>navegador;</li>
        <li>dispositivo;</li>
        <li>registros de autenticação;</li>
        <li>logs de segurança.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">6. PRAZOS DE RETENÇÃO</h2>

      <h3 className="text-lg font-semibold text-foreground">Dados cadastrais</h3>
      <p>Serão mantidos:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>enquanto a conta permanecer ativa;</li>
        <li>e por até 5 anos após seu encerramento, quando necessário para cumprimento de obrigações legais, fiscais ou defesa de direitos.</li>
      </ul>

      <h3 className="text-lg font-semibold text-foreground">Documentos de identificação</h3>
      <p>
        Poderão permanecer armazenados por até 5 anos após o encerramento da relação contratual, salvo prazo superior previsto em lei.
      </p>

      <h3 className="text-lg font-semibold text-foreground">Dados financeiros</h3>
      <p>
        Comprovativos, pagamentos e registros financeiros poderão ser mantidos por até 10 anos, conforme exigências fiscais, contabilísticas e regulatórias.
      </p>

      <h3 className="text-lg font-semibold text-foreground">Dados das viagens</h3>
      <p>As informações referentes às operações de transporte poderão ser armazenadas por até 5 anos para:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>auditorias;</li>
        <li>resolução de conflitos;</li>
        <li>prevenção de fraudes;</li>
        <li>cumprimento de obrigações legais.</li>
      </ul>

      <h3 className="text-lg font-semibold text-foreground">Dados GPS</h3>
      <p>Os dados de geolocalização serão armazenados apenas pelo período necessário para:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>execução da viagem;</li>
        <li>confirmação da entrega;</li>
        <li>tratamento de reclamações;</li>
        <li>auditorias;</li>
        <li>defesa de direitos.</li>
      </ul>
      <p>
        Após esse período, poderão ser anonimizados ou eliminados, salvo obrigação legal em contrário.
      </p>

      <h3 className="text-lg font-semibold text-foreground">Logs de segurança</h3>
      <p>
        Os registros técnicos poderão ser armazenados por até 12 meses, podendo ser mantidos por período superior quando relacionados a investigações, incidentes de segurança ou determinações legais.
      </p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">7. BACKUPS</h2>
      <p>Os backups da plataforma poderão conter dados pessoais.</p>
      <p>Esses backups serão utilizados exclusivamente para:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>recuperação de desastres;</li>
        <li>continuidade dos serviços;</li>
        <li>restauração de informações.</li>
      </ul>
      <p>Os backups seguirão políticas próprias de retenção e eliminação segura.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">8. ELIMINAÇÃO DOS DADOS</h2>
      <p>Os dados poderão ser eliminados quando:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>a finalidade do tratamento for encerrada;</li>
        <li>houver solicitação válida do titular;</li>
        <li>terminar o prazo de retenção;</li>
        <li>não existir obrigação legal que justifique sua manutenção.</li>
      </ul>
      <p>A eliminação poderá ocorrer de forma:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>permanente;</li>
        <li>segura;</li>
        <li>irreversível;</li>
        <li>ou mediante anonimização.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">9. ANONIMIZAÇÃO</h2>
      <p>
        Quando possível, a MOVA AGRO poderá anonimizar os dados em vez de eliminá-los.
      </p>
      <p>Dados anonimizados poderão ser utilizados para:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>estatísticas;</li>
        <li>pesquisas;</li>
        <li>melhoria da plataforma;</li>
        <li>inteligência de mercado;</li>
        <li>indicadores operacionais.</li>
      </ul>
      <p>Esses dados não permitirão identificar diretamente o titular.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">10. SOLICITAÇÃO DE EXCLUSÃO</h2>
      <p>O titular poderá solicitar a exclusão de seus dados enviando pedido para:</p>
      <p>
        <a href="mailto:movaagro@gmail.com" className="text-primary hover:underline">movaagro@gmail.com</a>
      </p>
      <p>A solicitação será analisada considerando:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>obrigações legais;</li>
        <li>contratos em vigor;</li>
        <li>necessidade de defesa de direitos;</li>
        <li>prevenção de fraudes.</li>
      </ul>
      <p>A exclusão poderá ser recusada quando houver fundamento legal para retenção.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">11. CONSERVAÇÃO PARA DEFESA DE DIREITOS</h2>
      <p>
        Mesmo após solicitação de exclusão, determinados dados poderão permanecer armazenados quando necessários para:
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li>processos judiciais;</li>
        <li>processos administrativos;</li>
        <li>arbitragens;</li>
        <li>auditorias;</li>
        <li>cumprimento de obrigações legais;</li>
        <li>prevenção de fraudes.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">12. RESPONSABILIDADES INTERNAS</h2>
      <p>A MOVA AGRO manterá procedimentos internos para:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>classificação das informações;</li>
        <li>controle de retenção;</li>
        <li>descarte seguro;</li>
        <li>revisão periódica dos bancos de dados;</li>
        <li>monitoramento da conformidade.</li>
      </ul>
      <p>Somente pessoas autorizadas poderão realizar operações de exclusão ou recuperação de dados.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">13. SEGURANÇA NA ELIMINAÇÃO</h2>
      <p>
        Quando os dados forem eliminados, a MOVA AGRO adotará procedimentos para impedir sua recuperação indevida.
      </p>
      <p>
        Sempre que tecnicamente possível, serão utilizados métodos de destruição segura dos registros eletrônicos e físicos.
      </p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">14. ALTERAÇÕES DESTA POLÍTICA</h2>
      <p>Esta Política poderá ser alterada para refletir:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>mudanças legais;</li>
        <li>alterações tecnológicas;</li>
        <li>novos serviços;</li>
        <li>necessidades operacionais.</li>
      </ul>
      <p>A versão atualizada será publicada na plataforma.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">15. CONTATO</h2>
      <p>
        Em caso de dúvidas ou solicitações relacionadas a esta Política, entre em contato com:
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
      <p>E-mail Jurídico:</p>
      <p>
        <a href="mailto:movaagro@gmail.com" className="text-primary hover:underline">movaagro@gmail.com</a>
      </p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">16. LEGISLAÇÃO APLICÁVEL</h2>
      <p>
        Esta Política é regida pelas leis da República de Moçambique, especialmente pela Lei n.º 3/2017 de Proteção de Dados Pessoais, sem prejuízo da observância de normas internacionais aplicáveis às operações da MOVA AGRO.
      </p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">17. DISPOSIÇÕES FINAIS</h2>
      <p>Ao utilizar a plataforma MOVA AGRO, o usuário declara estar ciente de que:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>seus dados poderão ser armazenados pelos prazos previstos nesta Política;</li>
        <li>a eliminação de dados observará as exigências legais e contratuais;</li>
        <li>a MOVA AGRO adotará medidas para garantir a proteção das informações durante todo o seu ciclo de vida;</li>
        <li>solicitações de exclusão serão analisadas de acordo com a legislação aplicável e com as obrigações assumidas pela plataforma.</li>
      </ul>
    </section>
  </LegalPageLayout>
);

export default DataRetention;
