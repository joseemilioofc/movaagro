import { LegalPageLayout } from "@/components/LegalPageLayout";

const GPSConsent = () => (
  <LegalPageLayout title="Consentimento de Geolocalização e GPS – MOVA AGRO">
    <section className="space-y-4">
      <p>Ao utilizar os serviços da MOVA AGRO, o usuário autoriza expressamente:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>A coleta de dados de localização em tempo real;</li>
        <li>O rastreamento GPS durante toda a execução da viagem;</li>
        <li>O compartilhamento da localização com as partes envolvidas na operação;</li>
        <li>O armazenamento temporário das informações de rota para fins operacionais, segurança e auditoria.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Duração do Rastreamento</h2>
      <p>O rastreamento permanecerá ativo desde o início da viagem até a confirmação da entrega da carga.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Retenção dos Dados</h2>
      <p>
        Após a conclusão da operação, os dados serão armazenados apenas pelo período necessário ao cumprimento de obrigações legais, contratuais e regulatórias.
      </p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Finalidades</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Segurança da carga e das partes envolvidas;</li>
        <li>Prova de execução do serviço de transporte;</li>
        <li>Suporte a auditorias e resolução de disputas;</li>
        <li>Cumprimento de exigências legais aplicáveis.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Revogação</h2>
      <p>
        O consentimento pode ser revogado a qualquer momento entrando em contacto pelo e-mail <a href="mailto:movaagro@gmail.com" className="text-primary hover:underline">movaagro@gmail.com</a>. A revogação poderá impedir a utilização de funcionalidades essenciais da plataforma.
      </p>
    </section>
  </LegalPageLayout>
);

export default GPSConsent;
