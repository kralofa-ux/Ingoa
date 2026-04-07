import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const logStep = (step: string, details?: any) => {
  const d = details ? ` - ${JSON.stringify(details)}` : "";
  console.log(`[STRIPE-WEBHOOK] ${step}${d}`);
};

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!stripeKey || !webhookSecret) {
    logStep("ERROR", { message: "Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET" });
    return new Response("Server misconfigured", { status: 500 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (err) {
    logStep("Signature verification failed", { error: (err as Error).message });
    return new Response("Invalid signature", { status: 400 });
  }

  logStep("Event received", { type: event.type, id: event.id });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerEmail = session.customer_details?.email;
      if (!customerEmail) {
        logStep("No customer email in session");
        return new Response("OK", { status: 200 });
      }

      // Determine tier from mode
      const tier = session.mode === "subscription" ? "monthly" : "lifetime";
      logStep("Checkout completed", { email: customerEmail, tier });

      // Find user by email
      const { data: userData } = await supabase.auth.admin.listUsers();
      const user = userData?.users?.find((u) => u.email === customerEmail);
      if (!user) {
        logStep("User not found for email", { email: customerEmail });
        return new Response("OK", { status: 200 });
      }

      await supabase
        .from("profiles")
        .update({ subscription_status: tier })
        .eq("user_id", user.id);

      logStep("Profile updated to " + tier, { userId: user.id });
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      // Look up customer email
      const customer = await stripe.customers.retrieve(customerId);
      if (customer.deleted || !("email" in customer) || !customer.email) {
        logStep("Customer deleted or no email");
        return new Response("OK", { status: 200 });
      }

      const { data: userData } = await supabase.auth.admin.listUsers();
      const user = userData?.users?.find((u) => u.email === customer.email);
      if (!user) {
        logStep("User not found for cancelled sub", { email: customer.email });
        return new Response("OK", { status: 200 });
      }

      await supabase
        .from("profiles")
        .update({ subscription_status: "free" })
        .eq("user_id", user.id);

      logStep("Subscription cancelled, reverted to free", { userId: user.id });
    }
  } catch (err) {
    logStep("ERROR processing event", { error: (err as Error).message });
    return new Response("Webhook handler error", { status: 500 });
  }

  return new Response("OK", { status: 200 });
});
