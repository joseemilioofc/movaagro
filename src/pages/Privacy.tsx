import { LegalPageLayout } from "@/components/LegalPageLayout";

const Privacy = () => (
  <LegalPageLayout title="Política de Privacidade – MOVA AGRO">
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">1. Controladora dos Dados</h2>
      <p>Para fins de proteção de dados pessoais, a controladora responsável é:</p>
      <p>
        <strong>MOVA AGRO, LDA</strong><br />
        Província da Zambézia<br />
        Distrito de Quelimane<br />
        Bairro Cimento<br />
        Rua 1115<br />
        Moçambique
      </p>
      <p>
        E-mail: <a href="mailto:movaagro@gmail.com" className="text-primary hover:underline">movaagro@gmail.com</a>
      </p>
      <p>
        A MOVA AGRO realiza o tratamento de dados pessoais em conformidade com a <strong>Lei n.º 3/2017 da República de Moçambique</strong> e com os princípios internacionais de proteção de dados inspirados pelo <strong>Regulamento Geral de Proteção de Dados da União Europeia (GDPR)</strong>.
      </p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">2. Informações que Recolhemos</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Informações de Registo:</strong> Nome, e-mail, número de telefone, nome da empresa/cooperativa.</li>
        <li><strong>Informações de Transporte:</strong> Endereços de origem e destino, tipos de carga, datas de recolha.</li>
        <li><strong>Informações de Pagamento:</strong> Comprovativos de transação, códigos de confirmação.</li>
        <li><strong>Dados de Utilização:</strong> Informações sobre como utiliza a plataforma.</li>
        <li><strong>Dados de Geolocalização:</strong> Coordenadas GPS durante execução de viagens.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">3. Como Utilizamos as Suas Informações</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Facilitar a conexão entre cooperativas/agricultores e transportadoras.</li>
        <li>Processar e gerir pedidos de transporte.</li>
        <li>Enviar notificações sobre o estado dos pedidos.</li>
        <li>Melhorar os nossos serviços e a experiência do utilizador.</li>
        <li>Cumprir obrigações legais e regulamentares.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">4. Partilha de Informações</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Entre cooperativas e transportadoras para facilitar o transporte.</li>
        <li>Com prestadores de serviços que nos ajudam a operar a plataforma.</li>
        <li>Quando exigido por lei ou para proteger os nossos direitos legais.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">5. Segurança dos Dados</h2>
      <p>Implementamos medidas técnicas e organizacionais adequadas para proteger as suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">6. Os Seus Direitos</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Aceder às suas informações pessoais.</li>
        <li>Corrigir informações incorretas.</li>
        <li>Solicitar a eliminação dos seus dados.</li>
        <li>Retirar o seu consentimento a qualquer momento.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">7. Contacto</h2>
      <p>Para exercer os seus direitos ou esclarecer dúvidas, contacte-nos através de <a href="mailto:movaagro@gmail.com" className="text-primary hover:underline">movaagro@gmail.com</a>.</p>
    </section>
  </LegalPageLayout>
);

export default Privacy;
