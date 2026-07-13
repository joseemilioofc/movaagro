import { LegalPageLayout } from "@/components/LegalPageLayout";

const Cookies = () => (
  <LegalPageLayout title="Política de Cookies – MOVA AGRO">
    <section className="space-y-4">
      <p>
        Esta Política de Cookies explica como a MOVA AGRO utiliza cookies, tecnologias semelhantes e identificadores digitais para melhorar a experiência dos usuários, proteger contas, manter a segurança da plataforma e oferecer funcionalidades essenciais.
      </p>
      <p>Ao continuar utilizando a plataforma, o usuário concorda com a utilização dos cookies descritos nesta política.</p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">1. O que são Cookies</h2>
      <p>
        Cookies são pequenos ficheiros de texto armazenados no seu dispositivo quando visita um site. Servem para reconhecer o utilizador, manter sessões ativas e recolher informação estatística de uso.
      </p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">2. Tipos de Cookies Utilizados</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li><strong>Cookies essenciais:</strong> necessários para autenticação, segurança e funcionamento básico da plataforma.</li>
        <li><strong>Cookies de preferências:</strong> guardam definições do utilizador (idioma, tema).</li>
        <li><strong>Cookies de desempenho:</strong> ajudam-nos a compreender como a plataforma é utilizada para melhorar os serviços.</li>
        <li><strong>Identificadores de segurança:</strong> detetam tentativas de fraude e acesso não autorizado.</li>
      </ul>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">3. Gestão de Cookies</h2>
      <p>
        Pode configurar o seu navegador para recusar ou eliminar cookies. Contudo, a desativação de cookies essenciais poderá impedir o uso de partes fundamentais da plataforma.
      </p>
    </section>

    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">4. Contacto</h2>
      <p>Dúvidas sobre esta política: <a href="mailto:movaagro@gmail.com" className="text-primary hover:underline">movaagro@gmail.com</a>.</p>
    </section>
  </LegalPageLayout>
);

export default Cookies;
