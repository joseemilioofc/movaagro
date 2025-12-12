import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Truck, Info, DollarSign, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  const menuItems = [
    { label: "Sobre Nós", href: "/about", icon: Info },
    { label: "Preços", href: "/pricing", icon: DollarSign },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-[280px] p-0 data-[state=open]:animate-slide-in-right data-[state=closed]:animate-slide-out-right"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border animate-fade-in">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-display font-bold text-foreground">MOVA</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li 
                  key={item.href}
                  className="animate-fade-in"
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
                >
                  <SheetClose asChild>
                    <Link
                      to={item.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-all duration-200 text-foreground hover:translate-x-1"
                    >
                      <item.icon className="w-5 h-5 text-primary" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </nav>

          {/* Auth Buttons */}
          <div 
            className="p-4 border-t border-border space-y-3 animate-fade-in"
            style={{ animationDelay: "300ms" }}
          >
            <SheetClose asChild>
              <Link to="/auth" className="block">
                <Button variant="outline" className="w-full gap-2 h-11 transition-all duration-200 hover:scale-[1.02]">
                  <LogIn className="w-4 h-4" />
                  Entrar
                </Button>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link to="/auth?tab=signup" className="block">
                <Button className="w-full gap-2 h-11 bg-gradient-primary text-primary-foreground shadow-glow transition-all duration-200 hover:scale-[1.02]">
                  <UserPlus className="w-4 h-4" />
                  Cadastrar
                </Button>
              </Link>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
