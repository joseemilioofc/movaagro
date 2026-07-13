import { LegalPageLayout } from "@/components/LegalPageLayout";

const Terms = () => (
  <LegalPageLayout title="Termos de Uso – MOVA AGRO">
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">1. Identificação da Plataforma</h2>
      <p>
        A <strong>MOVA AGRO</strong> é uma plataforma digital operada por <strong>MOVA AGRO, LDA</strong>, sociedade comercial devidamente constituída sob as leis da República de Moçambique, com sede em:
      </p>
      <p>
        <strong>MOVA AGRO, LDA</strong><br />
        Província da Zambézia<br />
        Distrito de Quelimane<br />
        Bairro Cimento<br />
        Rua 1115<br />
        Moçambique
      </p>
      <p>
        E-mail para assuntos jurídicos: <a href="mailto:movaagro@gmail.com" className="text-primary hover:underline">movaagro@gmail.com</a>
      </p>
      <p>
        A plataforma MOVA AGRO tem como objetivo conectar cooperativas agrícolas, produtores, embarcadores, transportadoras e motoristas independentes para facilitar a contratação, negociação, gestão e acompanhamento de serviços de transporte de cargas agrícolas.
      </p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">2. Natureza dos Serviços Prestados</h2>
      <p>A MOVA AGRO atua exclusivamente como uma plataforma tecnológica de intermediação.</p>
      <p>Para evitar qualquer dúvida, o usuário declara estar ciente de que:</p>

      <h3 className="text-lg font-semibold text-foreground">A MOVA AGRO NÃO É:</h3>
      <ul className="list-disc pl-6 space-y-1">
        <li>Transportadora;</li>
        <li>Operadora logística;</li>
        <li>Proprietária de veículos;</li>
        <li>Seguradora;</li>
        <li>Empresa de frete;</li>
        <li>Empregadora de motoristas;</li>
        <li>Depositária das mercadorias transportadas.</li>
      </ul>

      <h3 className="text-lg font-semibold text-foreground">A MOVA AGRO É:</h3>
      <ul className="list-disc pl-6 space-y-1">
        <li>Uma plataforma digital de intermediação;</li>
        <li>Um ambiente tecnológico para negociação de fretes;</li>
        <li>Um sistema de gestão de cargas e transportes;</li>
        <li>Uma solução de rastreamento e monitoramento logístico;</li>
        <li>Um sistema de processamento e repasse de pagamentos relacionados às operações realizadas dentro da plataforma.</li>
      </ul>

      <p>A responsabilidade pela execução do transporte pertence exclusivamente à transportadora contratada e ao embarcador responsável pela carga.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">3. Limitação Expressa de Responsabilidade</h2>
      <p>A MOVA AGRO não assume responsabilidade por:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Acidentes rodoviários;</li>
        <li>Danos materiais ou corporais;</li>
        <li>Avarias na carga;</li>
        <li>Extravio de mercadorias;</li>
        <li>Roubos ou furtos;</li>
        <li>Atrasos decorrentes de trânsito, clima ou fatores externos;</li>
        <li>Infrações de trânsito;</li>
        <li>Condutas praticadas por motoristas;</li>
        <li>Problemas mecânicos dos veículos;</li>
        <li>Descumprimento contratual entre cooperativas e transportadoras.</li>
      </ul>
      <p>A MOVA AGRO disponibiliza exclusivamente a infraestrutura tecnológica necessária para aproximar as partes e facilitar a realização dos negócios.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">4. Aceitação dos Termos</h2>
      <p>
        Ao aceder ou utilizar a plataforma MOVA AGRO, concorda em ficar vinculado a estes Termos de Uso. Se não concordar com qualquer parte destes termos, não poderá aceder ao serviço.
      </p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">5. Contacto</h2>
      <p>
        Para questões sobre estes termos, entre em contacto através do e-mail <a href="mailto:movaagro@gmail.com" className="text-primary hover:underline">movaagro@gmail.com</a>.
      </p>
    </section>
  </LegalPageLayout>
);

export default Terms;
