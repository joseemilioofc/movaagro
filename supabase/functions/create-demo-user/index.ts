import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("create-demo-user function called");
  
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify that the caller is authenticated and is an admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header");
      throw new Error("Não autorizado - faça login como admin");
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Verify the caller is an admin
    const token = authHeader.replace("Bearer ", "");
    const { data: { user: callerUser }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !callerUser) {
      console.error("Authentication failed");
      throw new Error("Não autorizado");
    }

    // Check if caller has admin role
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", callerUser.id)
      .eq("role", "admin")
      .single();

    if (roleError || !roleData) {
      console.error("Caller is not admin");
      throw new Error("Apenas administradores podem criar contas demo");
    }

    const demoEmail = "Teste@demo.com";
    const demoPassword = "123teste123";
    const demoName = "Conta Demo";

    // Check if demo user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingDemo = existingUsers?.users?.find(u => u.email?.toLowerCase() === demoEmail.toLowerCase());

    if (existingDemo) {
      // Delete existing demo user to recreate
      await supabaseAdmin.auth.admin.deleteUser(existingDemo.id);
      console.log("Existing demo user deleted");
    }

    // Create demo user
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: demoEmail,
      password: demoPassword,
      email_confirm: true,
      user_metadata: { name: demoName, role: "admin" },
    });

    if (createError) {
      console.error("Error creating user:", createError.message);
      throw createError;
    }

    const userId = userData.user.id;

    // The trigger will create profile and one role, we need to add the other two roles
    // Wait a bit for trigger to execute
    await new Promise(resolve => setTimeout(resolve, 500));

    // Add all three roles (admin is already added by trigger)
    const rolesToAdd = ["cooperative", "transporter"];
    
    for (const role of rolesToAdd) {
      const { error: roleInsertError } = await supabaseAdmin
        .from("user_roles")
        .upsert({ 
          user_id: userId, 
          role: role 
        }, { 
          onConflict: "user_id,role" 
        });

      if (roleInsertError) {
        console.error(`Error adding ${role} role:`, roleInsertError.message);
      } else {
        console.log(`${role} role added successfully`);
      }
    }

    console.log("Demo user created successfully with all roles");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Conta demo criada com sucesso!",
        credentials: {
          email: demoEmail,
          password: "********", // Don't expose password in response
          roles: ["admin", "cooperative", "transporter"]
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    console.error("Error in create-demo-user:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
    );
  }
});
