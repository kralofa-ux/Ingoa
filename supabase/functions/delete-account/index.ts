import { deleteApplicationData } from "./cleanup.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

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

    const url=Deno.env.get("SUPABASE_URL");
    const anonKey=Deno.env.get("SUPABASE_ANON_KEY");
    const serviceKey=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if(!url || !anonKey || !serviceKey)throw new Error("Account configuration unavailable");
    const supabaseUser = createClient(
      url,
      anonKey,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimsError } = await supabaseUser.auth.getClaims(token);
    if (claimsError || !claims?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claims.claims.sub as string;

    const supabaseAdmin = createClient(
      url,
      serviceKey
    );

    // Find active partner connections and reset partner's mode to solo
    const { data: connections, error: connectionsError } = await supabaseAdmin
      .from("partner_connections")
      .select("user_a, user_b")
      .or(`user_a.eq.${userId},user_b.eq.${userId}`)
      .eq("status", "active");

    if (connectionsError) throw connectionsError;
    if (connections && connections.length > 0) {
      for (const conn of connections) {
        const partnerId = conn.user_a === userId ? conn.user_b : conn.user_a;
        const { error: partnerError } = await supabaseAdmin
          .from("profiles")
          .update({ mode: "solo" })
          .eq("user_id", partnerId);
        if(partnerError)throw partnerError;
      }
    }

    await deleteApplicationData(supabaseAdmin, userId);

    // Delete auth user
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (deleteError) {
      return new Response(JSON.stringify({ error: deleteError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
