import { Link } from "react-router-dom";
import { Truck, MessageCircle } from "lucide-react";

export function Footer() {
  const whatsappLink = "https://wa.me/message/GAE2YZRB7LCPO1";

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Logo e descrição */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Truck className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-foreground">MOVA</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Conectando cooperativas, agricultores e transportadoras a oportunidades de forma rápida e segura.
            </p>
          </div>

          {/* Links úteis */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Links Úteis</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-muted-foreground hover:text-primary transition-colors">
                  Entrar
                </Link>
              </li>
              <li>
                <Link to="/auth?tab=signup" className="text-muted-foreground hover:text-primary transition-colors">
                  Criar Conta
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="/security" className="text-muted-foreground hover:text-primary transition-colors">
                  Segurança
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contacto</h4>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[hsl(142,70%,35%)] hover:bg-[hsl(142,70%,30%)] text-primary-foreground rounded-lg transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">WhatsApp</span>
            </a>
            <p className="mt-4 text-sm text-muted-foreground">
              Fale connosco pelo WhatsApp para tirar dúvidas ou obter suporte.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MOVA. Todos os direitos reservados.
          </p>
          <Link to="/auth?admin=true" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Acesso Administrativo
          </Link>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[hsl(142,70%,35%)] hover:bg-[hsl(142,70%,30%)] text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
        aria-label="Contactar via WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
      </a>
    </footer>
  );
}
