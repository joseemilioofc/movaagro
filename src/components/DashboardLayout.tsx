import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Truck, LogOut, Home, Package, Shield, ShieldCheck, ScrollText, Settings, User, FileText, Smartphone, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/Footer";
import { NotificationBell } from "@/components/NotificationBell";
import { useNotifications } from "@/hooks/useNotifications";
import { Breadcrumbs } from "@/components/Breadcrumbs";

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
      case "secondary_admin":
        return [
          { label: "Dashboard", href: "/admin", icon: Shield },
          { label: "Contratos", href: "/contracts", icon: FileText },
          { label: "Ranking", href: "/ranking", icon: Trophy },
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
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-4 sm:gap-6">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                </div>
                <span className="text-lg sm:text-xl font-display font-bold text-foreground">MOVA</span>
                {(role === "admin" || role === "secondary_admin") && (
                  <Badge variant={role === "admin" ? "default" : "secondary"} className="hidden sm:inline-flex text-[10px] px-1.5 py-0">
                    {role === "admin" ? "Supremo" : "Secundário"}
                  </Badge>
                )}
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

            <div className="flex items-center gap-1 sm:gap-2">
              <NotificationBell
                notifications={notifications}
                onClearAll={clearAll}
                onMarkAsRead={markAsRead}
              />
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="gap-1 sm:gap-2 px-2 sm:px-3">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Perfil</span>
                </Button>
              </Link>
              <Link to="/" className="hidden sm:block">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Início</span>
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-1 sm:gap-2 px-2 sm:px-3">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation - Bottom Fixed */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur-sm z-40 safe-area-pb">
        <div className="grid grid-cols-5 py-1">
          {navItems.slice(0, 4).map((item) => (
            <Link key={item.href} to={item.href} className="flex flex-col items-center">
              <Button
                variant={location.pathname === item.href ? "secondary" : "ghost"}
                size="sm"
                className="w-full flex-col gap-0.5 h-auto py-2 px-1 rounded-none"
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[9px] font-medium leading-tight">{item.label}</span>
              </Button>
            </Link>
          ))}
          <Link to="/profile" className="flex flex-col items-center">
            <Button
              variant={location.pathname === "/profile" ? "secondary" : "ghost"}
              size="sm"
              className="w-full flex-col gap-0.5 h-auto py-2 px-1 rounded-none"
            >
              <User className="w-5 h-5" />
              <span className="text-[9px] font-medium leading-tight">Perfil</span>
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 flex-1 pb-20 md:pb-8">
        <Breadcrumbs />
        {children}
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
