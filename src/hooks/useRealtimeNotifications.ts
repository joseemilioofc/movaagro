import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UseRealtimeNotificationsProps {
  enabled: boolean;
  onNewRequest?: () => void;
}

export const useRealtimeNotifications = ({ enabled, onNewRequest }: UseRealtimeNotificationsProps) => {
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element for notification sound
    audioRef.current = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1sbWhkZWVlZmdjYGBfXV1bW1paWVhXV1dXV1dWVlZWVlZWVlZWVlZWVlZWV1dXWFhYWVlaW1xcXV5fYGFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+");
    audioRef.current.volume = 0.5;

    if (!enabled) return;

    const channel = supabase
      .channel("admin-notifications")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "transport_requests",
        },
        (payload) => {
          console.log("Novo pedido criado:", payload);
          
          // Play sound
          audioRef.current?.play().catch(console.error);
          
          // Show toast notification
          toast({
            title: "🆕 Novo Pedido!",
            description: `Um novo pedido de transporte foi criado: ${(payload.new as any).title}`,
            duration: 5000,
          });
          
          // Callback to refresh data
          onNewRequest?.();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "profiles",
        },
        (payload) => {
          console.log("Novo usuário cadastrado:", payload);
          
          toast({
            title: "👤 Novo Usuário!",
            description: `Um novo usuário se cadastrou: ${(payload.new as any).name}`,
            duration: 5000,
          });
          
          onNewRequest?.();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "transport_proposals",
        },
        (payload) => {
          console.log("Nova proposta criada:", payload);
          
          toast({
            title: "💰 Nova Proposta!",
            description: `Uma nova proposta foi enviada no valor de ${((payload.new as any).price || 0).toLocaleString("pt-MZ")} MZN`,
            duration: 5000,
          });
          
          onNewRequest?.();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enabled, onNewRequest, toast]);
};
