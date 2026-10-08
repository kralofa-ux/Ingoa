import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function generateCode(): string {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return String(100000 + (buf[0] % 900000));
}

async function hasPaidAccess(userId: string, email?: string | null): Promise<boolean> {
  // App review demo account always has full access
  if (email?.toLowerCase() === "demo@ingoa.app") return true;
  // RevenueCat (native purchases) — checked when a secret key is configured
  const rcKey = Deno.env.get("REVENUECAT_SECRET_KEY");
  if (rcKey) {
    try {
      const r = await fetch(`https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(userId)}`, {
        headers: { Authorization: `Bearer ${rcKey}` },
      });
      if (r.ok) {
        const j = await r.json();
        const ents = j?.subscriber?.entitlements ?? {};
        const now = Date.now();
        for (const e of Object.values(ents) as any[]) {
          if (!e.expires_date || new Date(e.expires_date).getTime() > now) return true;
        }
      }
    } catch (_) { /* fall through */ }
  }
  // Stripe (web purchases)
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  if (stripeKey && email) {
    const h = { Authorization: `Bearer ${stripeKey}` };
    const c = await fetch(`https://api.stripe.com/v1/customers?email=${encodeURIComponent(email)}&limit=1`, { headers: h }).then((r) => r.json());
    const cid = c?.data?.[0]?.id;
    if (cid) {
      const subs = await fetch(`https://api.stripe.com/v1/subscriptions?customer=${cid}&status=active&limit=1`, { headers: h }).then((r) => r.json());
      if (subs?.data?.length) return true;
      const pays = await fetch(`https://api.stripe.com/v1/checkout/sessions?customer=${cid}&limit=20`, { headers: h }).then((r) => r.json());
      if (pays?.data?.some((s: any) => s.mode === "payment" && s.payment_status === "paid")) return true;
    }
  }
  return false;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing authorization");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // User client for auth
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await userClient.auth.getUser();
    if (authError || !user) throw new Error("Unauthorized");

    // Admin client for operations
    const admin = createClient(supabaseUrl, serviceKey);

    const { action, code: joinCode } = await req.json();

    if (action === "generate") {
      // Invalidate old codes
      await admin
        .from("partner_codes")
        .update({ used: true })
        .eq("user_id", user.id)
        .eq("used", false);

      const code = generateCode();
      const { error } = await admin.from("partner_codes").insert({
        user_id: user.id,
        code,
      });
      if (error) throw error;

      return new Response(JSON.stringify({ code }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "join") {
      if (!joinCode) throw new Error("Code required");

      if (!(await hasPaidAccess(user.id, user.email))) {
        return new Response(JSON.stringify({ error: "A paid plan is required to connect with a partner" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Look up the code
      const { data: codeRow, error: lookupErr } = await admin
        .from("partner_codes")
        .select("*")
        .eq("code", joinCode)
        .eq("used", false)
        .gt("expires_at", new Date().toISOString())
        .single();

      if (lookupErr || !codeRow) {
        return new Response(
          JSON.stringify({ error: "Invalid or expired code" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (codeRow.user_id === user.id) {
        return new Response(
          JSON.stringify({ error: "Cannot join your own code" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check if already connected
      const { data: existing } = await admin
        .from("partner_connections")
        .select("*")
        .or(
          `and(user_a.eq.${codeRow.user_id},user_b.eq.${user.id}),and(user_a.eq.${user.id},user_b.eq.${codeRow.user_id})`
        )
        .eq("status", "active")
        .maybeSingle();

      if (existing) {
        return new Response(
          JSON.stringify({ error: "Already connected with this partner" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Check for previous connection (free reconnect logic)
      const { data: prevConnection } = await admin
        .from("partner_connections")
        .select("*")
        .or(
          `and(user_a.eq.${codeRow.user_id},user_b.eq.${user.id}),and(user_a.eq.${user.id},user_b.eq.${codeRow.user_id})`
        )
        .eq("status", "disconnected")
        .maybeSingle();

      // Check if user has ever had a connection before (first one is free)
      const { data: anyPrev } = await admin
        .from("partner_connections")
        .select("id")
        .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
        .limit(1);

      const isFirstConnection = !anyPrev || anyPrev.length === 0;
      const isFreeReconnect = prevConnection?.is_free_reconnect === true;

      if (!isFirstConnection && !isFreeReconnect && !prevConnection) {
        // New partner, not first connection → would need payment
        // For now, allow it but flag it
        // TODO: integrate payment check
      }

      // Create connection
      const { error: connErr } = await admin.from("partner_connections").insert({
        user_a: codeRow.user_id,
        user_b: user.id,
        status: "active",
        is_free_reconnect: true,
      });
      if (connErr) throw connErr;

      // Mark code as used
      await admin
        .from("partner_codes")
        .update({ used: true })
        .eq("id", codeRow.id);

      // Update both users to couple mode
      await Promise.all([
        admin.from("profiles").update({ mode: "couple" }).eq("user_id", codeRow.user_id),
        admin.from("profiles").update({ mode: "couple" }).eq("user_id", user.id),
      ]);

      // Get partner display name
      const { data: partnerProfile } = await admin
        .from("profiles")
        .select("display_name")
        .eq("user_id", codeRow.user_id)
        .single();

      return new Response(
        JSON.stringify({
          success: true,
          partner_name: partnerProfile?.display_name || "Your partner",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "disconnect") {
      // Find active connection
      const { data: conn } = await admin
        .from("partner_connections")
        .select("*")
        .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
        .eq("status", "active")
        .single();

      if (!conn) {
        return new Response(
          JSON.stringify({ error: "No active connection" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      await admin
        .from("partner_connections")
        .update({ status: "disconnected", disconnected_at: new Date().toISOString() })
        .eq("id", conn.id);

      // Set both users back to solo
      await Promise.all([
        admin.from("profiles").update({ mode: "solo" }).eq("user_id", conn.user_a),
        admin.from("profiles").update({ mode: "solo" }).eq("user_id", conn.user_b),
      ]);

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (action === "status") {
      const { data: conn } = await admin
        .from("partner_connections")
        .select("*")
        .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
        .eq("status", "active")
        .maybeSingle();

      if (!conn) {
        return new Response(
          JSON.stringify({ connected: false }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const partnerId = conn.user_a === user.id ? conn.user_b : conn.user_a;
      const { data: partnerProfile } = await admin
        .from("profiles")
        .select("display_name")
        .eq("user_id", partnerId)
        .single();

      return new Response(
        JSON.stringify({
          connected: true,
          partner_name: partnerProfile?.display_name || "Your partner",
          partner_id: partnerId,
          connection_id: conn.id,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    throw new Error("Invalid action");
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
