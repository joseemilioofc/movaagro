import { Link } from "react-router-dom";
import { ArrowLeft, Truck, Building2, FileText, MapPin, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";

const Company = () => {
  const items = [
    { icon: Building2, label: "Empresa", value: "MOVA AGRO, LDA" },
    { icon: FileText, label: "NUIT", value: "402168609" },
    { icon: FileText, label: "Registo Comercial N°", value: "105070087/Zambézia" },
    { icon: FileText, label: "Alvará N°", value: "64/04/01/PS/2026" },
    {
      icon: MapPin,
      label: "Endereço",
      value: "Moçambique, Província da Zambézia, Distrito de Quelimane, Bairro Cimento, Rua 1115",
    },
    { icon: Mail, label: "Email", value: "movaagro@gmail.com" },
    { icon: Phone, label: "Contactos", value: "+258 87 780 1500 / +258 85 597 7759" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold text-foreground">MOVA</span>
          </Link>
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-8">
            Empresa
          </h1>

          <div className="bg-card border border-border rounded-xl p-6 sm:p-8 space-y-5">
            {items.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">
                    {label}
                  </p>
                  <p className="text-sm sm:text-base text-foreground mt-1 break-words">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Company;
