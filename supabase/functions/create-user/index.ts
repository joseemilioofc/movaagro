import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const maskEmail = (email: string): string => {
  const [local, domain] = email.split('@');
  if (!local || !domain) return '***@***.***';
  return `${local[0]}***@${domain}`;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, password, name, role, companyName, phone } = await req.json();
    console.log("Creating user:", maskEmail(email), "role:", role);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Não autorizado");
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Verify caller identity
    const token = authHeader.replace("Bearer ", "");
    const { data: { user: callerUser }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !callerUser) {
      throw new Error("Não autorizado");
    }

    // Check caller's role
    const { data: callerRoles } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", callerUser.id)
      .single();

    if (!callerRoles) {
      throw new Error("Não autorizado");
    }

    const callerRole = callerRoles.role;

    // Supreme admin can create any role; secondary admin can only create cooperative/transporter
    if (callerRole === "secondary_admin") {
      if (role !== "cooperative" && role !== "transporter") {
        throw new Error("Admin secundário só pode criar cooperativas e transportadoras");
      }
    } else if (callerRole !== "admin") {
      throw new Error("Apenas administradores podem criar usuários");
    }

    // Create user via admin API (doesn't affect caller's session)
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role },
    });

    if (createError) {
      console.error("Error creating user:", createError.message);
      throw createError;
    }

    // Update profile with additional info
    if (userData.user && (companyName || phone)) {
      await supabaseAdmin
        .from("profiles")
        .update({
          company_name: companyName || null,
          phone: phone || null,
        })
        .eq("user_id", userData.user.id);
    }

    console.log("User created successfully");

    return new Response(
      JSON.stringify({ success: true, user: userData.user }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    console.error("Error in create-user:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});
