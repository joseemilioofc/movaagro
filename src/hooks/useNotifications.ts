import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: "proposal" | "message" | "status" | "user";
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
}

export const useNotifications = (enabled: boolean) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();

  const addNotification = useCallback((notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev].slice(0, 50));

    // Play sound
    const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1sbWhkZWVlZmdjYGBfXV1bW1paWVhXV1dXV1dWVlZWVlZWVlZWVlZWVlZWV1dXWFhYWVlaW1xcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+");
    audio.volume = 0.3;
    audio.play().catch(() => {});

    toast({
      title: notification.title,
      description: notification.description,
      duration: 4000,
    });
  }, [toast]);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const proposalsChannel = supabase
      .channel("proposals-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "transport_proposals" },
        (payload) => {
          addNotification({
            type: "proposal",
            title: "Nova Proposta!",
            description: `Nova proposta de ${((payload.new as any).price || 0).toLocaleString("pt-MZ")} MZN recebida`,
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "transport_proposals" },
        (payload) => {
          const status = (payload.new as any).status;
          if (status === "paid") {
            addNotification({
              type: "status",
              title: "Pagamento Enviado",
              description: "Um pagamento foi enviado e aguarda confirmação",
            });
          } else if (status === "confirmed") {
            addNotification({
              type: "status",
              title: "Pagamento Confirmado!",
              description: "O pagamento foi confirmado pelo administrador",
            });
          }
        }
      )
      .subscribe();

    const messagesChannel = supabase
      .channel("messages-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        (payload) => {
          addNotification({
            type: "message",
            title: "Nova Mensagem",
            description: (payload.new as any).message?.substring(0, 50) + "..." || "Nova mensagem recebida",
          });
        }
      )
      .subscribe();

    const requestsChannel = supabase
      .channel("requests-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "transport_requests" },
        (payload) => {
          addNotification({
            type: "status",
            title: "Novo Pedido",
            description: `Novo pedido: ${(payload.new as any).title}`,
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "transport_requests" },
        (payload) => {
          const status = (payload.new as any).status;
          if (status === "in_progress") {
            addNotification({
              type: "status",
              title: "Transporte Iniciado",
              description: "Um transporte foi iniciado",
            });
          } else if (status === "completed") {
            addNotification({
              type: "status",
              title: "Transporte Concluído!",
              description: "Um transporte foi marcado como concluído",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(proposalsChannel);
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(requestsChannel);
    };
  }, [enabled, addNotification]);

  return {
    notifications,
    clearAll,
    markAsRead,
    unreadCount: notifications.filter((n) => !n.read).length,
  };
};
