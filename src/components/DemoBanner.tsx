import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function DemoBanner() {
  const { user } = useAuth();
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    let active = true;
    if (!user) {
      setIsDemo(false);
      return;
    }
    supabase
      .from("profiles")
      .select("is_demo")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (active) setIsDemo(!!data?.is_demo);
      });
    return () => {
      active = false;
    };
  }, [user?.id]);

  if (!isDemo) return null;

  return (
    <div className="bg-destructive/10 border-b border-destructive/30 text-destructive">
      <div className="container mx-auto px-3 sm:px-4 py-2 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
        <p className="text-xs sm:text-sm leading-snug">
          <strong>MODO DEMO</strong> — Todos os dados apresentados são fictícios e servem
          apenas para demonstração. Nenhuma transação apresentada nesta conta representa uma
          operação comercial real.
        </p>
      </div>
    </div>
  );
}
