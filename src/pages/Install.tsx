import { useAuth } from "@/contexts/AuthContext";
import { usePWA } from "@/hooks/usePWA";
import { PushNotificationToggle } from "@/components/PushNotificationToggle";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Smartphone, 
  Download, 
  CheckCircle2, 
  Wifi, 
  WifiOff, 
  Bell,
  Truck,
  Package,
  MapPin,
  MessageSquare,
  FileText
} from "lucide-react";

const Install = () => {
  const { role } = useAuth();
  const { isInstallable, isInstalled, isOnline, installApp } = usePWA();

  const features = [
    {
      icon: Bell,
      title: "Notificações em tempo real",
      description: "Receba alertas de novos pedidos e atualizações",
    },
    {
      icon: MapPin,
      title: "Rastreamento GPS",
      description: "Acompanhe e compartilhe localização em tempo real",
    },
    {
      icon: MessageSquare,
      title: "Chat integrado",
      description: "Comunique-se diretamente com transportadores/cooperativas",
    },
    {
      icon: FileText,
      title: "Contratos digitais",
      description: "Assine contratos eletronicamente pelo app",
    },
    {
      icon: WifiOff,
      title: "Modo offline",
      description: "Acesse informações mesmo sem internet",
    },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            {role === "transporter" ? (
              <Truck className="w-10 h-10 text-primary" />
            ) : (
              <Package className="w-10 h-10 text-primary" />
            )}
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            App MOVA {role === "transporter" ? "Motorista" : "Cooperativa"}
          </h1>
          <p className="text-muted-foreground mt-2">
            Instale o aplicativo para uma experiência completa
          </p>
        </div>

        {/* Status */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-medium">Status da Instalação</p>
                  <p className="text-sm text-muted-foreground">
                    {isInstalled ? "App instalado no dispositivo" : "App não instalado"}
                  </p>
                </div>
              </div>
              {isInstalled ? (
                <Badge className="bg-green-600">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Instalado
                </Badge>
              ) : isInstallable ? (
                <Button onClick={installApp}>
                  <Download className="w-4 h-4 mr-2" />
                  Instalar
                </Button>
              ) : (
                <Badge variant="secondary">Abra no navegador</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Connection Status */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isOnline ? (
                  <Wifi className="w-6 h-6 text-green-600" />
                ) : (
                  <WifiOff className="w-6 h-6 text-yellow-600" />
                )}
                <div>
                  <p className="font-medium">Conexão</p>
                  <p className="text-sm text-muted-foreground">
                    {isOnline ? "Online - todas as funções disponíveis" : "Offline - funções limitadas"}
                  </p>
                </div>
              </div>
              <Badge variant={isOnline ? "default" : "secondary"}>
                {isOnline ? "Online" : "Offline"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Push Notifications */}
        <PushNotificationToggle />

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Funcionalidades do App</CardTitle>
            <CardDescription>
              {role === "transporter" 
                ? "Ferramentas para gerenciar seus transportes" 
                : "Ferramentas para gerenciar seus pedidos"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{feature.title}</p>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Installation Instructions */}
        {!isInstalled && !isInstallable && (
          <Card>
            <CardHeader>
              <CardTitle>Como instalar</CardTitle>
              <CardDescription>Siga as instruções para seu dispositivo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">📱 iPhone/iPad (Safari)</h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Toque no botão de compartilhar (quadrado com seta)</li>
                  <li>Role e toque em "Adicionar à Tela de Início"</li>
                  <li>Toque em "Adicionar"</li>
                </ol>
              </div>
              <div>
                <h4 className="font-medium mb-2">🤖 Android (Chrome)</h4>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Toque no menu (três pontos)</li>
                  <li>Toque em "Adicionar à tela inicial"</li>
                  <li>Toque em "Adicionar"</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Install;
