import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface TransporterProfile {
  id: string;
  is_company: boolean;
  approval_status: "pending" | "approved" | "rejected";
  company_name: string | null;
  company_nuit: string | null;
  company_address: string | null;
}

export function useTransporterProfile() {
  const { user, role } = useAuth();
  const [profile, setProfile] = useState<TransporterProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refetch = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await (supabase as any)
      .from("transporter_details")
      .select("id, is_company, approval_status, company_name, company_nuit, company_address")
      .eq("user_id", user.id)
      .maybeSingle();
    setProfile((data as TransporterProfile) || null);
    setLoading(false);
  };

  useEffect(() => {
    if (role === "transporter") refetch();
    else {
      setProfile(null);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, role]);

  return { profile, loading, refetch, isCompany: !!profile?.is_company };
}
