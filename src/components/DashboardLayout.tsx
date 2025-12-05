import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Truck, LogOut, Home, Package, Shield, ScrollText, Settings, User, FileText, Smartphone, Trophy } from "lucide-react";
import { Footer } from "@/components/Footer";
import { NotificationBell } from "@/components/NotificationBell";
import { useNotifications } from "@/hooks/useNotifications";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { role, signOut } = useAuth();
  const location = useLocation();
  const { notifications, clearAll, markAsRead } = useNotifications(true);

  const handleSignOut = async () => {
    await signOut();
  };

  const getNavItems = () => {
    switch (role) {
      case "admin":
        return [
          { label: "Dashboard", href: "/admin", icon: Shield },
          { label: "Auditoria", href: "/admin/audit", icon: ScrollText },
          { label: "Contratos", href: "/contracts", icon: FileText },
          { label: "Ranking", href: "/ranking", icon: Trophy },
          { label: "Configurações", href: "/admin/settings", icon: Settings },
        ];
      case "cooperative":
        return [
          { label: "Meus Pedidos", href: "/cooperative", icon: Package },
          { label: "Contratos", href: "/contracts", icon: FileText },
          { label: "Ranking", href: "/ranking", icon: Trophy },
          { label: "App", href: "/install", icon: Smartphone },
        ];
      case "transporter":
        return [
          { label: "Pedidos", href: "/transporter", icon: Package },
          { label: "Contratos", href: "/contracts", icon: FileText },
          { label: "Ranking", href: "/ranking", icon: Trophy },
          { label: "App", href: "/install", icon: Smartphone },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-display font-bold text-foreground">MOVA</span>
              </Link>

              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <Link key={item.href} to={item.href}>
                    <Button
                      variant={location.pathname === item.href ? "secondary" : "ghost"}
                      size="sm"
                      className="gap-2"
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <NotificationBell
                notifications={notifications}
                onClearAll={clearAll}
                onMarkAsRead={markAsRead}
              />
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Perfil</span>
                </Button>
              </Link>
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Início</span>
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden border-b border-border bg-card px-4 py-2">
        <div className="flex items-center gap-2 overflow-x-auto">
          {navItems.map((item) => (
            <Link key={item.href} to={item.href}>
              <Button
                variant={location.pathname === item.href ? "secondary" : "ghost"}
                size="sm"
                className="gap-2 whitespace-nowrap"
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
}
