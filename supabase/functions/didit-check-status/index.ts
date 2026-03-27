import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const DIDIT_API_URL = "https://verification.didit.me/v2/session";

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

    // Get current session id from profile
    const serviceClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: profile, error: profileError } = await serviceClient
      .from("profiles")
      .select("didit_session_id, identity_status")
      .eq("user_id", userId)
      .single();

    if (profileError || !profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // If no session or already approved, return current status
    if (!profile.didit_session_id || profile.identity_status === "approved") {
      return new Response(
        JSON.stringify({ identity_status: profile.identity_status }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Query Didit for session decision
    const diditResponse = await fetch(
      `${DIDIT_API_URL}/${profile.didit_session_id}/decision/`,
      {
        method: "GET",
        headers: { "x-api-key": DIDIT_API_KEY },
      }
    );

    if (!diditResponse.ok) {
      const errorText = await diditResponse.text();
      console.error("Didit API error:", errorText);
      return new Response(
        JSON.stringify({ identity_status: profile.identity_status }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const diditData = await diditResponse.json();

    // Map Didit status to our status
    let newStatus = profile.identity_status;
    const diditStatus = (diditData.status || "").toLowerCase();

    if (diditStatus === "approved") {
      newStatus = "approved";
    } else if (diditStatus === "declined") {
      newStatus = "rejected";
    } else if (diditStatus === "in review" || diditStatus === "not started" || diditStatus === "started") {
      newStatus = "pending";
    }

    // Update profile if status changed
    if (newStatus !== profile.identity_status) {
      await serviceClient
        .from("profiles")
        .update({ identity_status: newStatus })
        .eq("user_id", userId);
    }

    return new Response(
      JSON.stringify({ identity_status: newStatus }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
