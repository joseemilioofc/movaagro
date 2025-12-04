import { supabase } from "@/integrations/supabase/client";

type AuditAction = "create" | "update" | "delete" | "login" | "logout" | "email_sent";
type EntityType = "user" | "transport_request" | "transport_proposal" | "profile";

interface LogOptions {
  action: AuditAction;
  entityType: EntityType;
  entityId?: string;
  details?: Record<string, any>;
}

export const logAuditAction = async ({ action, entityType, entityId, details }: LogOptions) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn("No user found for audit log");
      return;
    }

    const { error } = await supabase.from("audit_logs").insert({
      user_id: user.id,
      action,
      entity_type: entityType,
      entity_id: entityId || null,
      details: details || null,
    });

    if (error) {
      console.error("Error creating audit log:", error);
    }
  } catch (error) {
    console.error("Error in logAuditAction:", error);
  }
};

export const useAuditLog = () => {
  return { logAuditAction };
};
