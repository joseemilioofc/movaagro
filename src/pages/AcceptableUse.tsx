import { LegalPageLayout } from "@/components/LegalPageLayout";

const AcceptableUse = () => (
  <LegalPageLayout title="Política de Uso Aceitável – MOVA AGRO">
    <section className="space-y-4">
      <p>Esta política define as condutas permitidas e proibidas na utilização da plataforma MOVA AGRO.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Condutas Proibidas</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Fornecer informações falsas, incompletas ou fraudulentas;</li>
        <li>Utilizar a plataforma para atividades ilegais ou contrárias à ordem pública;</li>
        <li>Transportar cargas ilícitas, perigosas não declaradas ou não autorizadas;</li>
        <li>Tentar contornar controlos de segurança, autenticação ou pagamento;</li>
        <li>Utilizar bots, scrapers ou meios automatizados sem autorização;</li>
        <li>Assediar, ameaçar ou discriminar outros utilizadores;</li>
        <li>Realizar operações fora da plataforma com o intuito de evitar taxas ou comissões;</li>
        <li>Reproduzir, redistribuir ou modificar conteúdo da plataforma sem autorização.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Boas Práticas Esperadas</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Manter dados cadastrais e documentos atualizados;</li>
        <li>Comunicar-se com respeito e profissionalismo;</li>
        <li>Cumprir prazos, valores e condições acordados;</li>
        <li>Reportar incidentes de segurança ou fraude imediatamente.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Sanções</h2>
      <p>
        A violação desta política pode resultar em advertência, suspensão temporária ou encerramento definitivo da conta, sem prejuízo das medidas legais cabíveis.
      </p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Denúncias</h2>
      <p>
        Denúncias de uso indevido: <a href="mailto:movaagro@gmail.com" className="text-primary hover:underline">movaagro@gmail.com</a>.
      </p>
    </section>
  </LegalPageLayout>
);

export default AcceptableUse;
