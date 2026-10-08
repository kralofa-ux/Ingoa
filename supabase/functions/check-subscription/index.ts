import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const LIFETIME_PRICE = "price_1THePVS2YuVDTyoqFgQQ1N8d";

const logStep = (step: string, details?: any) => {
  const d = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[CHECK-SUBSCRIPTION] ${step}${d}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const authHeader = req.headers.get("Authorization");
    const unauth = () => new Response(JSON.stringify({ subscribed: false, tier: "free" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200,
    });
    if (!authHeader) return unauth();

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    const user = userData?.user;
    if (userError || !user?.email) {
      logStep("No valid session", { message: userError?.message });
      return unauth();
    }
    logStep("User authenticated", { email: user.email });
    if (user.email.toLowerCase() === "demo@ingoa.app") {
      return new Response(JSON.stringify({ subscribed: true, tier: "lifetime", subscription_end: null }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200,
      });
    }


    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });

    if (customers.data.length === 0) {
      logStep("No Stripe customer found");
      return new Response(JSON.stringify({ subscribed: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found customer", { customerId });

    // Check active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length > 0) {
      const sub = subscriptions.data[0];
      const subscriptionEnd = new Date(sub.current_period_end * 1000).toISOString();
      const productId = sub.items.data[0].price.product;
      logStep("Active subscription found", { subscriptionEnd, productId });
      return new Response(JSON.stringify({
        subscribed: true,
        tier: "monthly",
        product_id: productId,
        subscription_end: subscriptionEnd,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Check one-time lifetime purchase
    const sessions = await stripe.checkout.sessions.list({
      customer: customerId,
      limit: 10,
    });

    const lifetimePurchase = sessions.data.find(
      (s) => s.payment_status === "paid" && s.mode === "payment"
    );

    if (lifetimePurchase) {
      logStep("Lifetime purchase found");
      return new Response(JSON.stringify({
        subscribed: true,
        tier: "lifetime",
        product_id: null,
        subscription_end: null,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    logStep("No active subscription or lifetime purchase");
    return new Response(JSON.stringify({ subscribed: false }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: msg });
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
