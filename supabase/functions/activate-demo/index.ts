import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const demoEmail = "Teste@demo.com";
    const demoPassword = "123teste123";
    const demoName = "Conta Demo";

    const { data: existing } = await supabaseAdmin.auth.admin.listUsers();
    const existingDemo = existing?.users?.find(u => u.email?.toLowerCase() === demoEmail.toLowerCase());
    if (existingDemo) await supabaseAdmin.auth.admin.deleteUser(existingDemo.id);

    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: demoEmail,
      password: demoPassword,
      email_confirm: true,
      user_metadata: { name: demoName, role: "cooperative" },
    });
    if (createError) throw createError;
    const userId = userData.user.id;

    await new Promise(r => setTimeout(r, 600));

    // Add transporter + admin roles
    for (const role of ["transporter", "admin"]) {
      await supabaseAdmin.from("user_roles").upsert(
        { user_id: userId, role },
        { onConflict: "user_id,role" }
      );
    }

    return new Response(
      JSON.stringify({ success: true, userId, email: demoEmail, password: demoPassword, roles: ["cooperative", "transporter", "admin"] }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 });
  }
});
