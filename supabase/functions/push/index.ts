import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};
const GATEWAY_URL = "https://connector-gateway.lovable.dev/firebase_messaging";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const UUID = /^[0-9a-f-]{36}$/i;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Unauthorized" }, 401);
    const url = Deno.env.get("SUPABASE_URL")!;
    const userClient = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return json({ error: "Unauthorized" }, 401);
    const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const body = await req.json().catch(() => ({}));
    const action = body?.action;

    if (action === "register") {
      const token = typeof body.token === "string" ? body.token.trim() : "";
      const platform = ["ios", "android", "web"].includes(body.platform) ? body.platform : "unknown";
      if (!token || token.length > 4096) return json({ error: "Invalid token" }, 400);
      await admin.from("push_tokens").upsert(
        { user_id: user.id, token, platform, updated_at: new Date().toISOString() },
        { onConflict: "token" },
      );
      return json({ ok: true });
    }

    if (action === "unregister") {
      const token = typeof body.token === "string" ? body.token : "";
      if (token) await admin.from("push_tokens").delete().eq("token", token).eq("user_id", user.id);
      return json({ ok: true });
    }

    if (action === "liked") {
      const nameId = body.name_id;
      if (typeof nameId !== "string" || !UUID.test(nameId)) return json({ error: "Invalid name" }, 400);

      const { data: conn } = await admin
        .from("partner_connections")
        .select("user_a, user_b")
        .eq("status", "active")
        .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
        .maybeSingle();
      if (!conn) return json({ ok: true, match: false });
      const partnerId = conn.user_a === user.id ? conn.user_b : conn.user_a;

      const [{ data: mine }, { data: theirs }] = await Promise.all([
        admin.from("liked_names").select("name_id").eq("user_id", user.id).eq("name_id", nameId).maybeSingle(),
        admin.from("liked_names").select("name_id").eq("user_id", partnerId).eq("name_id", nameId).maybeSingle(),
      ]);
      if (!mine || !theirs) return json({ ok: true, match: false });

      const { data: nameRow } = await admin.from("names").select("name").eq("id", nameId).maybeSingle();
      const { data: tokens } = await admin.from("push_tokens").select("token").eq("user_id", partnerId);

      const lovableKey = Deno.env.get("LOVABLE_API_KEY");
      const fcmKey = Deno.env.get("FIREBASE_MESSAGING_API_KEY");
      if (!lovableKey || !fcmKey || !tokens?.length) return json({ ok: true, match: true, sent: 0 });

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
            await admin.from("push_tokens").delete().eq("token", token);
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
