import { LegalPageLayout } from "@/components/LegalPageLayout";

const DataRetention = () => (
  <LegalPageLayout title="Política de Retenção de Dados – MOVA AGRO">
    <section className="space-y-4">
      <p>
        A MOVA AGRO retém dados pessoais e operacionais apenas pelo período necessário ao cumprimento das finalidades para as quais foram recolhidos, respeitando obrigações legais, contratuais e regulatórias aplicáveis.
      </p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Prazos de Retenção</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Dados de conta:</strong> mantidos enquanto a conta estiver ativa e por até 5 anos após o encerramento, para fins legais e fiscais.</li>
        <li><strong>Dados de transporte e contratos:</strong> mantidos por até 10 anos, para cumprimento de obrigações fiscais e contratuais.</li>
        <li><strong>Comprovativos de pagamento:</strong> mantidos por até 10 anos, conforme legislação fiscal aplicável.</li>
        <li><strong>Dados de geolocalização (GPS):</strong> mantidos pelo tempo necessário à operação e auditoria (até 24 meses).</li>
        <li><strong>Registos de auditoria:</strong> mantidos por até 5 anos.</li>
        <li><strong>Comunicações (chat):</strong> mantidas enquanto a operação estiver ativa e por até 3 anos após conclusão.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Eliminação e Anonimização</h2>
      <p>
        Findos os prazos, os dados são eliminados ou anonimizados de forma segura. Dados anonimizados poderão ser utilizados para fins estatísticos, sem qualquer possibilidade de reidentificação.
      </p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">Direito à Eliminação</h2>
      <p>
        O titular dos dados pode solicitar a eliminação antecipada dos seus dados através de <a href="mailto:movaagro@gmail.com" className="text-primary hover:underline">movaagro@gmail.com</a>, respeitadas as obrigações legais de retenção mínima.
      </p>
    </section>
  </LegalPageLayout>
);

export default DataRetention;
