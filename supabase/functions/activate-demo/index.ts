import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const demoEmail = "Teste@demo.com";
    const demoPassword = "123teste123";
    const demoName = "Conta Demo";

    // Check if demo user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingDemo = existingUsers?.users?.find(u => u.email?.toLowerCase() === demoEmail.toLowerCase());

    if (existingDemo) {
      // Delete existing demo user to recreate
      await supabaseAdmin.auth.admin.deleteUser(existingDemo.id);
    }

    // Create demo user
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: demoEmail,
      password: demoPassword,
      email_confirm: true,
      user_metadata: { name: demoName, role: "cooperative" },
    });

    if (createError) throw createError;

    const userId = userData.user.id;

    // Wait for trigger
    await new Promise(resolve => setTimeout(resolve, 500));

    // Add transporter role
    await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: userId, role: "transporter" }, { onConflict: "user_id,role" });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Conta demo ativada com sucesso!",
        credentials: {
          email: demoEmail,
          password: demoPassword,
          roles: ["cooperative", "transporter"]
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});
