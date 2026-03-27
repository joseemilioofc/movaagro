import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const DIDIT_API_URL = "https://verification.didit.me/v3/session/";
const WORKFLOW_ID = "9682ad99-ba02-4540-a67a-74227cbcbb69";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;
    const { user_id } = await req.json();

    if (user_id !== userId) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const DIDIT_API_KEY = Deno.env.get("DIDIT_API_KEY");
    if (!DIDIT_API_KEY) {
      return new Response(JSON.stringify({ error: "Didit API key not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get user profile for callback info
    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("user_id", userId)
      .single();

    // Create Didit verification session
    const diditResponse = await fetch(DIDIT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": DIDIT_API_KEY,
      },
      body: JSON.stringify({
        workflow_id: WORKFLOW_ID,
        vendor_data: userId,
        callback: `${Deno.env.get("SUPABASE_URL")}/functions/v1/didit-webhook`,
        contact_details: profile?.email
          ? { email: profile.email, send_notification_emails: false }
          : undefined,
      }),
    });

    if (!diditResponse.ok) {
      const errorText = await diditResponse.text();
      console.error("Didit API error:", errorText);
      return new Response(JSON.stringify({ error: "Failed to start verification" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const diditData = await diditResponse.json();

    // Update profile with session id and set status to pending
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    await serviceClient
      .from("profiles")
      .update({
        didit_session_id: diditData.session_id,
        identity_status: "pending",
      })
      .eq("user_id", userId);

    return new Response(
      JSON.stringify({ url: diditData.url, session_id: diditData.session_id }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
