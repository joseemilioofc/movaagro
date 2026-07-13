import { LegalPageLayout } from "@/components/LegalPageLayout";
import { Mail, MapPin, Phone, Building2 } from "lucide-react";

const LegalContact = () => {
  const items = [
    { icon: Building2, label: "Empresa", value: "MOVA AGRO, LDA" },
    { icon: MapPin, label: "Endereço", value: "Província da Zambézia, Distrito de Quelimane, Bairro Cimento, Rua 1115, Moçambique" },
    { icon: Mail, label: "E-mail Jurídico", value: "movaagro@gmail.com" },
    { icon: Phone, label: "Contactos", value: "+258 87 780 1500 / +258 85 597 7759" },
  ];

  return (
    <LegalPageLayout title="Contacto Jurídico – MOVA AGRO">
      <section className="space-y-4">
        <p>
          Para questões jurídicas, notificações formais, exercício de direitos de titular de dados, denúncias de uso indevido ou requerimentos oficiais, utilize os canais abaixo.
        </p>
      </section>

      <div className="not-prose bg-card border border-border rounded-xl p-6 space-y-5">
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">{label}</p>
              <p className="text-sm sm:text-base text-foreground mt-1 break-words">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Prazos de Resposta</h2>
        <p>
          Empenhamo-nos em responder a solicitações jurídicas e de titulares de dados em até <strong>15 dias úteis</strong>, podendo o prazo ser prorrogado em casos de complexidade justificada.
        </p>
      </section>
    </LegalPageLayout>
  );
};

export default LegalContact;
