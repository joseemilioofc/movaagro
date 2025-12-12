import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Send, Loader2, User, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProposalCard } from "./ProposalCard";
import { ProposalForm } from "./ProposalForm";
import { logAuditAction } from "@/hooks/useAuditLog";

interface ChatMessage {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
  sender_name?: string;
  sender_role?: string;
}

interface Proposal {
  id: string;
  transport_request_id: string;
  transporter_id: string;
  description: string;
  price: number;
  mova_account: string;
  status: string;
  payment_proof_url: string | null;
  payment_code: string | null;
  admin_confirmed_at: string | null;
  created_at: string;
  transporter_name?: string;
}

interface TransportChatProps {
  requestId: string;
  requestTitle: string;
}

export const TransportChat = ({ requestId, requestTitle }: TransportChatProps) => {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    fetchProposals();

    // Subscribe to realtime updates for messages
    const messagesChannel = supabase
      .channel(`chat-${requestId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `transport_request_id=eq.${requestId}`,
        },
        async (payload) => {
          const newMsg = payload.new as ChatMessage;
          const { data: profile } = await supabase
            .from("profiles")
            .select("name")
            .eq("user_id", newMsg.sender_id)
            .maybeSingle();
          
          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", newMsg.sender_id)
            .maybeSingle();

          setMessages((prev) => [
            ...prev,
            {
              ...newMsg,
              sender_name: profile?.name || "Usuário",
              sender_role: roleData?.role || "user",
            },
          ]);
        }
      )
      .subscribe();

    // Subscribe to realtime updates for proposals
    const proposalsChannel = supabase
      .channel(`proposals-${requestId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transport_proposals",
          filter: `transport_request_id=eq.${requestId}`,
        },
        () => {
          fetchProposals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(proposalsChannel);
    };
  }, [requestId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("transport_request_id", requestId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const messagesWithSenders = await Promise.all(
        (data || []).map(async (msg) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("name")
            .eq("user_id", msg.sender_id)
            .maybeSingle();
          
          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", msg.sender_id)
            .maybeSingle();

          return {
            ...msg,
            sender_name: profile?.name || "Usuário",
            sender_role: roleData?.role || "user",
          };
        })
      );

      setMessages(messagesWithSenders);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProposals = async () => {
    try {
      const { data, error } = await supabase
        .from("transport_proposals")
        .select("*")
        .eq("transport_request_id", requestId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const proposalsWithNames = await Promise.all(
        (data || []).map(async (proposal) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("name")
            .eq("user_id", proposal.transporter_id)
            .maybeSingle();

          return {
            ...proposal,
            transporter_name: profile?.name || "Transportador",
          };
        })
      );

      setProposals(proposalsWithNames);
    } catch (error) {
      console.error("Error fetching proposals:", error);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !user) return;

    setSending(true);
    try {
      const { data, error } = await supabase.from("chat_messages").insert({
        transport_request_id: requestId,
        sender_id: user.id,
        message: newMessage.trim(),
      }).select().single();

      if (error) throw error;

      // Log the message send
      await logAuditAction({
        action: "send_message",
        entityType: "chat_message",
        entityId: data?.id,
        details: {
          transport_request_id: requestId,
          action_description: "Mensagem enviada no chat",
        },
      });

      setNewMessage("");
    } catch (error: any) {
      toast({
        title: "Erro ao enviar mensagem",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const getRoleBadge = (senderRole: string) => {
    switch (senderRole) {
      case "admin":
        return (
          <Badge className="ml-2 text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-sm">
            <Shield className="w-3 h-3 mr-1" />
            Admin MOVA
          </Badge>
        );
      case "transporter":
        return (
          <Badge variant="secondary" className="ml-2 text-xs">
            Transportador
          </Badge>
        );
      case "cooperative":
        return (
          <Badge variant="outline" className="ml-2 text-xs">
            Cooperativa
          </Badge>
        );
      default:
        return null;
    }
  };

  const hasExistingProposal = proposals.some(p => p.transporter_id === user?.id);

  return (
    <div className="space-y-4">
      {/* Proposals Section */}
      {proposals.length > 0 && (
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              requestId={requestId}
              onUpdate={fetchProposals}
            />
          ))}
        </div>
      )}

      {/* Proposal Form for Transporters */}
      {role === "transporter" && !hasExistingProposal && (
        <ProposalForm
          requestId={requestId}
          onProposalSent={() => {
            fetchProposals();
            setShowProposalForm(false);
          }}
        />
      )}

      {/* Chat Card */}
      <Card className="h-[400px] flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Chat - {requestTitle}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 px-4" ref={scrollRef}>
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <User className="w-8 h-8 mb-2" />
                <p>Nenhuma mensagem ainda</p>
                <p className="text-sm">Inicie a conversa!</p>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                {messages.map((msg) => {
                  const isOwn = msg.sender_id === user?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-center mb-1">
                        <span className="text-xs text-muted-foreground">
                          {msg.sender_name}
                        </span>
                        {getRoleBadge(msg.sender_role || "")}
                      </div>
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          isOwn
                            ? "bg-primary text-primary-foreground"
                            : msg.sender_role === "admin"
                            ? "bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-400/50 shadow-sm"
                            : "bg-muted"
                        }`}
                      >
                        {msg.sender_role === "admin" && !isOwn && (
                          <div className="flex items-center gap-1 mb-1 text-amber-600 dark:text-amber-400">
                            <Shield className="w-3 h-3" />
                            <span className="text-xs font-semibold">Admin MOVA</span>
                          </div>
                        )}
                        <p className="text-sm">{msg.message}</p>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">
                        {new Date(msg.created_at).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
          <div className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <Input
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                disabled={sending}
              />
              <Button type="submit" disabled={sending || !newMessage.trim()}>
                {sending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};