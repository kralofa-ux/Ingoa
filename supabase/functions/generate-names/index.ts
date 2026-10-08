import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const CULTURE_ABBREVS: Record<string, string> = {
  Aotearoa: "ao",
  "Cook Islands": "ck",
  Samoa: "sa",
  Tonga: "to",
  Fiji: "fj",
  Hawaii: "hi",
  Tahiti: "ta",
  Niue: "nu",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const adminCheck = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: u } = await adminCheck.auth.getUser(authHeader.replace("Bearer ", ""));
    if (!u?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const { data: isAdmin } = await adminCheck.rpc("has_role", { _user_id: u.user.id, _role: "admin" });
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const { culture, count = 50 } = await req.json();

    if (!culture || !CULTURE_ABBREVS[culture]) {
      return new Response(JSON.stringify({ error: "Invalid culture" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not set");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get existing names for this culture to avoid duplicates
    const { data: existing } = await supabase
      .from("names")
      .select("name")
      .eq("culture", culture);
    const existingSet = new Set((existing ?? []).map((n: any) => n.name.toLowerCase()));

    // Get max index for ID generation
    const abbrev = CULTURE_ABBREVS[culture];
    const { data: allIds } = await supabase
      .from("names")
      .select("id")
      .like("id", `${abbrev}_%`);
    let maxIdx = 0;
    for (const row of allIds ?? []) {
      const num = parseInt(row.id.split("_").pop() ?? "0", 10);
      if (num > maxIdx) maxIdx = num;
    }

    const batchSize = Math.min(count, 60);
    const batches = Math.ceil(count / batchSize);
    let totalInserted = 0;

    for (let b = 0; b < batches; b++) {
      const thisCount = Math.min(batchSize, count - b * batchSize);

      const prompt = `Generate exactly ${thisCount} culturally authentic ${culture} personal names used in Pacific Island / Polynesian naming traditions.

Requirements:
- Only include REAL names attested in genealogy records, language dictionaries, cultural naming lists, historical figures, or common modern usage
- Do NOT invent names or include misspellings
- Do NOT include sacred/restricted cultural titles, chiefly titles not used as personal names, or religious honorifics
- Include a mix of male, female, and unisex names
- Use proper diacritics (macrons, glottal stops) where culturally appropriate
- For meaning: provide a clear, accurate meaning. If unknown, use null
- For commonality_score: 1=rare, 2=normal/uncommon, 3=common. Distribute roughly 20% rare, 40% normal, 40% common
- Do NOT include these existing names: ${Array.from(existingSet).slice(0, 200).join(", ")}

Return ONLY a JSON array (no markdown, no explanation) of objects with these fields:
- "name": string
- "gender": "male" | "female" | "unisex"
- "meaning": string | null
- "commonality_score": 1 | 2 | 3`;

      const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: "You are a Pacific cultures naming expert. Return only valid JSON arrays." },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!aiResp.ok) {
        const errText = await aiResp.text();
        console.error(`AI error batch ${b}:`, aiResp.status, errText);
        continue;
      }

      const aiData = await aiResp.json();
      let content = aiData.choices?.[0]?.message?.content ?? "";

      // Strip markdown fences if present
      content = content.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();

      let names: any[];
      try {
        names = JSON.parse(content);
      } catch {
        console.error(`Failed to parse AI response batch ${b}:`, content.slice(0, 200));
        continue;
      }

      if (!Array.isArray(names)) continue;

      // De-duplicate and build insert rows
      const rows: any[] = [];
      for (const n of names) {
        if (!n.name || !n.gender) continue;
        const nameLower = n.name.toLowerCase();
        if (existingSet.has(nameLower)) continue;
        existingSet.add(nameLower);

        maxIdx++;
        rows.push({
          id: `${abbrev}_${String(maxIdx).padStart(4, "0")}`,
          name: n.name,
          culture,
          gender: n.gender,
          meaning: n.meaning || null,
          commonality_score: [1, 2, 3].includes(n.commonality_score) ? n.commonality_score : 2,
          status: "active",
        });
      }

      if (rows.length > 0) {
        const { error: insertErr } = await supabase.from("names").insert(rows);
        if (insertErr) {
          console.error(`Insert error batch ${b}:`, insertErr);
        } else {
          totalInserted += rows.length;
        }
      }
    }

    return new Response(
      JSON.stringify({ culture, inserted: totalInserted }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-names error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
