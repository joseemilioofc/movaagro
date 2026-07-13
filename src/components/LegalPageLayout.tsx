import { Link } from "react-router-dom";
import { ArrowLeft, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { ReactNode } from "react";

interface LegalPageLayoutProps {
  title: string;
  updatedAt?: string;
  children: ReactNode;
}

export function LegalPageLayout({ title, updatedAt = "12 de Junho de 2026", children }: LegalPageLayoutProps) {
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
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground mb-8">Última atualização: {updatedAt}</p>
          <div className="prose prose-gray dark:prose-invert max-w-none space-y-6 text-muted-foreground">
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
