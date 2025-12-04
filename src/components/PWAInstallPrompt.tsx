import { usePWA } from "@/hooks/usePWA";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Wifi, WifiOff, Smartphone } from "lucide-react";

export const PWAInstallPrompt = () => {
  const { isInstallable, isInstalled, isOnline, installApp } = usePWA();

  if (isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
      {/* Offline indicator */}
      {!isOnline && (
        <Card className="mb-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="p-3 flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-yellow-800 dark:text-yellow-200">
              Modo offline - algumas funções limitadas
            </span>
          </CardContent>
        </Card>
      )}

      {/* Install prompt */}
      {isInstallable && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">Instalar MOVA</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Acesso rápido, notificações e modo offline
                </p>
                <Button 
                  size="sm" 
                  className="mt-2 w-full"
                  onClick={installApp}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Instalar App
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
