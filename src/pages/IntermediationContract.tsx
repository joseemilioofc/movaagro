import { LegalPageLayout } from "@/components/LegalPageLayout";

const IntermediationContract = () => (
  <LegalPageLayout title="Contrato de Intermediação – MOVA AGRO">
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Declaração Fundamental</h2>
      <p>Ao utilizar a plataforma MOVA AGRO, todas as partes reconhecem e concordam que:</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">A MOVA AGRO NÃO PARTICIPA DA EXECUÇÃO DO TRANSPORTE</h2>
      <p>A MOVA AGRO não:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Conduz veículos;</li>
        <li>Contrata motoristas para executar fretes;</li>
        <li>Assume posse física da carga;</li>
        <li>Armazena mercadorias;</li>
        <li>Garante entregas;</li>
        <li>Atua como seguradora.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Relação Contratual</h2>
      <p>A relação contratual de transporte ocorre diretamente entre:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>Cooperativa;</li>
        <li>Embarcador;</li>
        <li>Transportadora.</li>
      </ul>
      <p>
        A MOVA AGRO limita-se a disponibilizar os recursos tecnológicos necessários para que tais partes possam celebrar negócios de forma segura e eficiente.
      </p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Obrigações da MOVA AGRO</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Manter a plataforma disponível e operacional dentro de padrões razoáveis;</li>
        <li>Proteger os dados dos utilizadores conforme a Política de Privacidade;</li>
        <li>Disponibilizar canais de suporte e comunicação entre as partes;</li>
        <li>Facilitar o registo, negociação e monitoramento das operações contratadas.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Obrigações das Partes</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Fornecer informações verdadeiras e atualizadas;</li>
        <li>Cumprir todos os requisitos legais aplicáveis à sua atividade;</li>
        <li>Executar as obrigações contratuais assumidas entre si;</li>
        <li>Resolver disputas diretamente, cabendo à MOVA AGRO apenas prover as evidências operacionais disponíveis na plataforma.</li>
      </ul>
    </section>
  </LegalPageLayout>
);

export default IntermediationContract;
