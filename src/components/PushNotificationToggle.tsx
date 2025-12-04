import { usePushNotifications } from "@/hooks/usePushNotifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff, Loader2, AlertCircle } from "lucide-react";

export const PushNotificationToggle = () => {
  const {
    isSupported,
    permission,
    isSubscribed,
    loading,
    subscribe,
    unsubscribe,
  } = usePushNotifications();

  const handleToggle = async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
  };

  if (!isSupported) {
    return (
      <Card className="border-yellow-500/50 bg-yellow-50/50 dark:bg-yellow-950/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Seu navegador não suporta notificações push.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isSubscribed ? (
              <Bell className="w-5 h-5 text-primary" />
            ) : (
              <BellOff className="w-5 h-5 text-muted-foreground" />
            )}
            <div>
              <CardTitle className="text-lg">Notificações Push</CardTitle>
              <CardDescription>
                Receba alertas de novos pedidos e atualizações
              </CardDescription>
            </div>
          </div>
          <Badge variant={isSubscribed ? "default" : "secondary"}>
            {isSubscribed ? "Ativo" : "Inativo"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="push-toggle">
              {isSubscribed ? "Notificações ativadas" : "Ativar notificações"}
            </Label>
            <p className="text-xs text-muted-foreground">
              {permission === "denied" 
                ? "Permissão negada nas configurações do navegador" 
                : "Novos pedidos, mensagens e atualizações de status"}
            </p>
          </div>
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Switch
              id="push-toggle"
              checked={isSubscribed}
              onCheckedChange={handleToggle}
              disabled={permission === "denied"}
            />
          )}
        </div>

        {permission === "denied" && (
          <div className="mt-4 p-3 bg-destructive/10 rounded-lg">
            <p className="text-sm text-destructive">
              As notificações foram bloqueadas. Para ativar, acesse as configurações do navegador e permita notificações para este site.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
