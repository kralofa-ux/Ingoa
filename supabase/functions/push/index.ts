import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const GATEWAY_URL = "https://connector-gateway.lovable.dev/firebase_messaging";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });



Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Unauthorized" }, 401);
    const url = Deno.env.get("SUPABASE_URL");
    const anonKey=Deno.env.get("SUPABASE_ANON_KEY");
    const serviceKey=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if(!url || !anonKey || !serviceKey)throw new Error("Push configuration unavailable");
    const userClient = createClient(url, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return json({ error: "Unauthorized" }, 401);
    const admin = createClient(url, serviceKey);

    const body = await req.json().catch(() => ({}));
    const action = body?.action;

    if (action === "register") {
      const token = typeof body.token === "string" ? body.token.trim() : "";
      const platform = ["ios", "android", "web"].includes(body.platform) ? body.platform : "unknown";
      if (!token || token.length > 4096) return json({ error: "Invalid token" }, 400);
      const {error}=await admin.from("push_tokens").upsert(
        { user_id: user.id, token, platform, updated_at: new Date().toISOString() },
        { onConflict: "token" },
      );
      if(error)throw error;
      return json({ ok: true });
    }

    if (action === "unregister") {
      const token = typeof body.token === "string" ? body.token : "";
      if (token) {const {error}=await admin.from("push_tokens").delete().eq("token", token).eq("user_id", user.id);if(error)throw error;}
      return json({ ok: true });
    }

    if (action === "liked") {
      const nameId = body.name_id;
      if (typeof nameId !== "string" || !nameId.trim() || nameId.length > 255) return json({ error: "Invalid name" }, 400);

      const { data: conn, error: connectionError } = await admin
        .from("partner_connections")
        .select("user_a, user_b")
        .eq("status", "active")
        .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
        .maybeSingle();
      if(connectionError)throw connectionError;
      if (!conn) return json({ ok: true, match: false });
      const partnerId = conn.user_a === user.id ? conn.user_b : conn.user_a;

      const [{ data: mine, error: mineError }, { data: theirs, error: theirsError }] = await Promise.all([
        admin.from("liked_names").select("name_id").eq("user_id", user.id).eq("name_id", nameId).maybeSingle(),
        admin.from("liked_names").select("name_id").eq("user_id", partnerId).eq("name_id", nameId).maybeSingle(),
      ]);
      if(mineError || theirsError)throw mineError ?? theirsError;
      if (!mine || !theirs) return json({ ok: true, match: false });

      const { data: nameRow, error: nameError } = await admin.from("names").select("name").eq("id", nameId).maybeSingle();
      const { data: tokens, error: tokenError } = await admin.from("push_tokens").select("token").eq("user_id", partnerId);

      if(nameError || tokenError)throw nameError ?? tokenError;
      const lovableKey = Deno.env.get("LOVABLE_API_KEY");
      const fcmKey = Deno.env.get("FIREBASE_MESSAGING_API_KEY");
      if (!lovableKey || !fcmKey || !tokens?.length) return json({ ok: true, match: true, sent: 0, delivery: !tokens?.length ? "no_devices" : "not_configured" });

      let sent = 0;
      for (const { token } of tokens) {
        const res = await fetch(`${GATEWAY_URL}/v1/projects/_/messages:send`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${lovableKey}`,
            "X-Connection-Api-Key": fcmKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: {
              token,
              notification: {
                title: "It's a match! 💙",
                body: `You and your partner both love ${nameRow?.name ?? "a name"}.`,
              },
              data: { path: "/matches" },
              apns: { payload: { aps: { sound: "default" } } },
            },
          }),
        });
        if (res.ok) sent++;
        else {
          const t = await res.text();
          console.error(`FCM send failed [${res.status}]: ${t}`);
          if (res.status === 404 || (res.status === 400 && t.includes("INVALID_ARGUMENT"))) {
            const {error}=await admin.from("push_tokens").delete().eq("token", token);
            if(error)throw error;
          }
        }
      }
      return json({ ok: true, match: true, sent });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    console.error(e);
    return json({ error: e instanceof Error ? e.message : "Error" }, 500);
  }
});
