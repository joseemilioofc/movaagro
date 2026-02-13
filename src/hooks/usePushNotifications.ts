import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

const VAPID_PUBLIC_KEY = "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U";

interface PushNotificationState {
  isSupported: boolean;
  permission: NotificationPermission;
  subscription: PushSubscription | null;
}

export const usePushNotifications = () => {
  const { toast } = useToast();
  const [state, setState] = useState<PushNotificationState>({
    isSupported: false,
    permission: "default",
    subscription: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if push notifications are supported
    const isSupported = "Notification" in window && "serviceWorker" in navigator && "PushManager" in window;
    
    setState(prev => ({
      ...prev,
      isSupported,
      permission: isSupported ? Notification.permission : "denied",
    }));

    // Get existing subscription if available
    if (isSupported && Notification.permission === "granted") {
      getExistingSubscription();
    }
  }, []);

  const getExistingSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await (registration as any).pushManager.getSubscription();
      setState(prev => ({ ...prev, subscription }));
    } catch (error) {
      console.error("Error getting subscription:", error);
    }
  };

  const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!state.isSupported) {
      toast({
        title: "Não suportado",
        description: "Seu navegador não suporta notificações push.",
        variant: "destructive",
      });
      return false;
    }

    setLoading(true);
    try {
      const permission = await Notification.requestPermission();
      setState(prev => ({ ...prev, permission }));

      if (permission === "granted") {
        toast({
          title: "Notificações ativadas!",
          description: "Você receberá notificações importantes.",
        });
        return true;
      } else {
        toast({
          title: "Permissão negada",
          description: "Você não receberá notificações push.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Error requesting permission:", error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [state.isSupported, toast]);

  const subscribe = useCallback(async (): Promise<PushSubscription | null> => {
    if (!state.isSupported || state.permission !== "granted") {
      const granted = await requestPermission();
      if (!granted) return null;
    }

    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Unsubscribe from any existing subscription
      const existingSubscription = await (registration as any).pushManager.getSubscription();
      if (existingSubscription) {
        await existingSubscription.unsubscribe();
      }

      // Subscribe to push notifications
      const subscription = await (registration as any).pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY).buffer as ArrayBuffer,
      });

      setState(prev => ({ ...prev, subscription }));

      toast({
        title: "Inscrito com sucesso!",
        description: "Você receberá notificações de novos pedidos e atualizações.",
      });

      return subscription;
    } catch (error) {
      console.error("Error subscribing to push:", error);
      toast({
        title: "Erro ao inscrever",
        description: "Não foi possível ativar as notificações push.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [state.isSupported, state.permission, requestPermission, toast]);

  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!state.subscription) return true;

    setLoading(true);
    try {
      await state.subscription.unsubscribe();
      setState(prev => ({ ...prev, subscription: null }));

      toast({
        title: "Desinscrito",
        description: "Você não receberá mais notificações push.",
      });

      return true;
    } catch (error) {
      console.error("Error unsubscribing:", error);
      toast({
        title: "Erro",
        description: "Não foi possível desativar as notificações.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [state.subscription, toast]);

  const showLocalNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (state.permission === "granted") {
      new Notification(title, {
        icon: "/pwa-192x192.png",
        badge: "/pwa-192x192.png",
        ...options,
      });
    }
  }, [state.permission]);

  return {
    isSupported: state.isSupported,
    permission: state.permission,
    subscription: state.subscription,
    isSubscribed: !!state.subscription,
    loading,
    requestPermission,
    subscribe,
    unsubscribe,
    showLocalNotification,
  };
};
