import { LegalPageLayout } from "@/components/LegalPageLayout";

const LegalNotice = () => (
  <LegalPageLayout title="Aviso Legal – MOVA AGRO" updatedAt="13 de Julho de 2026">
    <p className="text-sm">Versão: 1.0</p>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">1. Apresentação</h2>
      <p>
        O presente Aviso Legal ("Disclaimer") estabelece as condições gerais relacionadas à utilização da plataforma MOVA AGRO, operada pela MOVA AGRO, LDA, bem como as limitações de responsabilidade, direitos de propriedade intelectual e demais informações jurídicas relevantes.
      </p>
      <p>Este documento complementa:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Termos de Uso;</li>
        <li>Política de Privacidade;</li>
        <li>Política de Cookies;</li>
        <li>Política de Segurança da Informação;</li>
        <li>Política de Retenção de Dados;</li>
        <li>Política de Uso Aceitável;</li>
        <li>Contrato de Intermediação de Serviços de Transporte Agrícola.</li>
      </ul>
      <p>Ao acessar ou utilizar a plataforma, o usuário declara que leu, compreendeu e concorda com este Aviso Legal.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">2. Identificação da Empresa</h2>
      <p>A plataforma é operada por:</p>
      <p>MOVA AGRO, LDA</p>
      <p>Endereço:</p>
      <p>
        Província da Zambézia<br />
        Distrito de Quelimane<br />
        Bairro Cimento<br />
        Avenida: Eduardo Mondlane<br />
        Moçambique
      </p>
      <p>E-mail Jurídico:</p>
      <p><a href="mailto:movaagro@gmail.com" className="text-primary hover:underline">movaagro@gmail.com</a></p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">3. Natureza da Plataforma</h2>
      <p>A MOVA AGRO é uma plataforma tecnológica destinada à intermediação de serviços de transporte de produtos agrícolas.</p>
      <p>A plataforma conecta:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Cooperativas;</li>
        <li>Produtores;</li>
        <li>Embarcadores;</li>
        <li>Transportadoras;</li>
        <li>Motoristas.</li>
      </ul>
      <p>A MOVA AGRO não executa diretamente qualquer operação de transporte.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">4. A MOVA AGRO Não É Uma Transportadora</h2>
      <p>Para todos os efeitos legais, a MOVA AGRO:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>não realiza transporte de cargas;</li>
        <li>não possui frota própria;</li>
        <li>não fornece motoristas;</li>
        <li>não conduz veículos;</li>
        <li>não armazena mercadorias;</li>
        <li>não assume posse da carga;</li>
        <li>não atua como seguradora;</li>
        <li>não atua como despachante;</li>
        <li>não atua como representante das partes.</li>
      </ul>
      <p>A responsabilidade pela execução do transporte pertence exclusivamente às partes contratantes.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">5. Responsabilidade pela Carga</h2>
      <p>Toda responsabilidade relacionada à carga é de exclusiva responsabilidade:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>do embarcador;</li>
        <li>da cooperativa;</li>
        <li>da transportadora contratada.</li>
      </ul>
      <p>Isso inclui:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>acondicionamento;</li>
        <li>documentação;</li>
        <li>carregamento;</li>
        <li>descarregamento;</li>
        <li>conservação;</li>
        <li>perdas;</li>
        <li>avarias;</li>
        <li>extravios.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">6. Responsabilidade pelo Transporte</h2>
      <p>A MOVA AGRO não responde por:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>acidentes;</li>
        <li>colisões;</li>
        <li>incêndios;</li>
        <li>furtos;</li>
        <li>roubos;</li>
        <li>danos causados por terceiros;</li>
        <li>atrasos;</li>
        <li>falhas mecânicas;</li>
        <li>interrupções de estrada;</li>
        <li>eventos climáticos;</li>
        <li>greves;</li>
        <li>bloqueios rodoviários.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">7. Responsabilidade pelos Usuários</h2>
      <p>Cada usuário é integralmente responsável:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>pelas informações fornecidas;</li>
        <li>pelos documentos enviados;</li>
        <li>pelas propostas apresentadas;</li>
        <li>pelas negociações realizadas;</li>
        <li>pelos contratos celebrados;</li>
        <li>pelos pagamentos efetuados;</li>
        <li>pela execução dos serviços contratados.</li>
      </ul>
      <p>A MOVA AGRO não garante a idoneidade, solvência, capacidade técnica ou disponibilidade dos usuários cadastrados, embora possa realizar procedimentos de verificação e validação documental.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">8. Disponibilidade da Plataforma</h2>
      <p>A MOVA AGRO envidará esforços razoáveis para manter a plataforma disponível e funcional.</p>
      <p>Entretanto, não garante funcionamento ininterrupto ou livre de erros.</p>
      <p>A plataforma poderá ser temporariamente indisponível em razão de:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>manutenção programada;</li>
        <li>atualizações;</li>
        <li>falhas de infraestrutura;</li>
        <li>ataques cibernéticos;</li>
        <li>problemas de conectividade;</li>
        <li>eventos de força maior.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">9. Informações Disponibilizadas</h2>
      <p>As informações apresentadas na plataforma são fornecidas pelos próprios usuários ou geradas durante a utilização dos serviços.</p>
      <p>A MOVA AGRO não garante que todas as informações publicadas sejam completas, exatas ou permanentemente atualizadas, embora adote medidas para reduzir inconsistências e fraudes.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">10. Pagamentos</h2>
      <p>Quando a MOVA AGRO processar pagamentos por meio da plataforma:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>atuará como intermediadora financeira da operação;</li>
        <li>poderá receber os valores para posterior repasse às partes;</li>
        <li>poderá descontar taxas previamente informadas.</li>
      </ul>
      <p>A MOVA AGRO não se responsabiliza por falhas causadas por instituições financeiras, operadoras de pagamento ou indisponibilidade de serviços de terceiros.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">11. Links Externos</h2>
      <p>A plataforma poderá conter links para websites ou serviços de terceiros.</p>
      <p>A MOVA AGRO não controla esses ambientes e não se responsabiliza por:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>conteúdos;</li>
        <li>políticas de privacidade;</li>
        <li>disponibilidade;</li>
        <li>segurança;</li>
        <li>produtos;</li>
        <li>serviços oferecidos por terceiros.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">12. Propriedade Intelectual</h2>
      <p>Todo o conteúdo da plataforma pertence à MOVA AGRO, LDA ou aos respectivos licenciadores, incluindo:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>marca MOVA AGRO;</li>
        <li>logotipo;</li>
        <li>software;</li>
        <li>código-fonte;</li>
        <li>banco de dados;</li>
        <li>interfaces;</li>
        <li>design;</li>
        <li>documentação;</li>
        <li>imagens;</li>
        <li>textos;</li>
        <li>APIs;</li>
        <li>conteúdos institucionais.</li>
      </ul>
      <p>É proibida a reprodução, distribuição, modificação, engenharia reversa ou exploração comercial desses ativos sem autorização prévia e por escrito.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">13. Marcas de Terceiros</h2>
      <p>As marcas pertencentes a terceiros eventualmente mencionadas na plataforma permanecem de propriedade de seus respectivos titulares.</p>
      <p>Sua utilização tem caráter meramente identificativo e não implica qualquer vínculo, parceria ou endosso.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">14. Força Maior</h2>
      <p>A MOVA AGRO não será responsável por falhas decorrentes de eventos fora de seu controle razoável, incluindo:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>desastres naturais;</li>
        <li>guerras;</li>
        <li>conflitos civis;</li>
        <li>epidemias;</li>
        <li>pandemias;</li>
        <li>interrupções de energia;</li>
        <li>falhas em provedores de internet;</li>
        <li>atos governamentais;</li>
        <li>ataques cibernéticos.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">15. Comunicações Eletrônicas</h2>
      <p>O usuário concorda em receber comunicações eletrônicas relacionadas à utilização da plataforma, incluindo:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>confirmações de cadastro;</li>
        <li>avisos de segurança;</li>
        <li>notificações de viagens;</li>
        <li>comprovativos;</li>
        <li>atualizações dos Termos e Políticas;</li>
        <li>comunicações operacionais.</li>
      </ul>
      <p>Quando exigido por lei, comunicações de natureza promocional dependerão de consentimento do usuário.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">16. Alterações dos Documentos</h2>
      <p>A MOVA AGRO poderá alterar seus documentos jurídicos sempre que necessário para:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>atender alterações legislativas;</li>
        <li>incorporar novas funcionalidades;</li>
        <li>melhorar a segurança;</li>
        <li>aperfeiçoar seus serviços.</li>
      </ul>
      <p>As versões atualizadas serão publicadas na plataforma e produzirão efeitos conforme a legislação aplicável.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">17. Limitação Geral de Responsabilidade</h2>
      <p>Na máxima extensão permitida pela legislação aplicável, a responsabilidade da MOVA AGRO limita-se à prestação da infraestrutura tecnológica de intermediação.</p>
      <p>A MOVA AGRO não será responsável por danos indiretos, lucros cessantes, perda de oportunidades de negócio ou prejuízos decorrentes da relação contratual estabelecida entre usuários da plataforma.</p>
      <p>Nenhuma disposição deste Aviso Legal exclui ou limita responsabilidades que não possam ser afastadas por força de lei.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">18. Legislação Aplicável</h2>
      <p>Este Aviso Legal será interpretado de acordo com:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Constituição da República de Moçambique;</li>
        <li>Código Civil;</li>
        <li>Código Comercial;</li>
        <li>Lei n.º 3/2017 de Proteção de Dados Pessoais;</li>
        <li>demais normas aplicáveis.</li>
      </ul>
      <p>Nas operações internacionais, poderão ser observadas normas imperativas do país de execução da operação, quando aplicáveis.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">19. Resolução de Conflitos</h2>
      <p>As partes comprometem-se a buscar solução amigável para eventuais controvérsias.</p>
      <p>Não sendo possível a resolução consensual, fica eleito o foro competente da Província da Zambézia, República de Moçambique, salvo disposição legal imperativa em sentido diverso.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">20. Contato</h2>
      <p>Para dúvidas jurídicas, comunicações formais ou solicitações relacionadas a este Aviso Legal, entre em contato com:</p>
      <p>
        <strong>MOVA AGRO, LDA</strong><br />
        Endereço:<br />
        Província da Zambézia<br />
        Distrito de Quelimane<br />
        Bairro Cimento<br />
        Avenida: Eduardo Mondlane<br />
        Moçambique
      </p>
      <p>E-mail Jurídico: <a href="mailto:movaagro@gmail.com" className="text-primary hover:underline">movaagro@gmail.com</a></p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">21. Disposições Finais</h2>
      <p>Ao utilizar a plataforma MOVA AGRO, o usuário declara que:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>leu integralmente este Aviso Legal;</li>
        <li>compreendeu a natureza da plataforma como intermediadora tecnológica;</li>
        <li>reconhece que a MOVA AGRO não é transportadora, seguradora ou empregadora dos motoristas;</li>
        <li>concorda com as limitações de responsabilidade previstas neste documento;</li>
        <li>aceita que este Aviso Legal integra os Termos de Uso e os demais documentos jurídicos da plataforma.</li>
      </ul>
    </section>
  </LegalPageLayout>
);

export default LegalNotice;
