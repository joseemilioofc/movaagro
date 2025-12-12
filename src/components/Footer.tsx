import { Link } from "react-router-dom";
import { Truck, MessageCircle } from "lucide-react";

export function Footer() {
  const whatsappLink = "https://wa.me/message/GAE2YZRB7LCPO1";

  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="grid gap-6 sm:gap-8 grid-cols-2 md:grid-cols-4">
          {/* Logo e descrição */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-foreground text-sm sm:text-base">MOVA</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Conectando cooperativas, agricultores e transportadoras a oportunidades de forma rápida e segura.
            </p>
          </div>

          {/* Links úteis */}
          <div>
            <h4 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">Links Úteis</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
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
            <h4 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">Legal</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Termos
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
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-semibold text-foreground mb-3 sm:mb-4 text-sm sm:text-base">Contacto</h4>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[hsl(142,70%,35%)] hover:bg-[hsl(142,70%,30%)] text-primary-foreground rounded-lg transition-colors text-sm"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium">WhatsApp</span>
            </a>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-muted-foreground">
              Fale connosco pelo WhatsApp.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
            © {new Date().getFullYear()} MOVA. Todos os direitos reservados.
          </p>
          <Link to="/auth?admin=true" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">
            Acesso Administrativo
          </Link>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 md:bottom-6 right-4 sm:right-6 z-40 flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-[hsl(142,70%,35%)] hover:bg-[hsl(142,70%,30%)] text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
        aria-label="Contactar via WhatsApp"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
      </a>
    </footer>
  );
}
