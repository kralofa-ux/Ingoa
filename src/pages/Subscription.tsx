import { motion } from "framer-motion";
import { Check, Crown, Sparkles, ArrowLeft, Lock, Zap, Heart, BookOpen, Loader2, ExternalLink, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useSubscriptionActions } from "@/hooks/useSubscriptionActions";
import PremiumBenefits from "@/components/PremiumBenefits";
import { useToast } from "@/hooks/use-toast";
import {
  presentPaywall,
  presentCustomerCenter,
  restorePurchases,
  isNative,
} from "@/lib/revenuecat";

const PRICES = {
  monthly: "price_1THeOlS2YuVDTyoq2oCosiMb",
  lifetime: "price_1THePVS2YuVDTyoqFgQQ1N8d",
};

const Subscription = () => {
  const navigate = useNavigate();

  const { isSubscribed, subscriptionTier, subscriptionEnd, checkSubscription } = useAuth();

  const {loadingPrice,portalLoading,restoring,handleNativePaywall,handleRestore,handleNativeManage,handleCheckout,handleManage}=useSubscriptionActions();

  const native = isNative();

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 max-w-lg mx-auto bg-[#0012ee] flower-bg">
      <button
        onClick={() => navigate(-1)}
        aria-label="Go back"
        className="w-9 h-9 rounded-full frosted-pill flex items-center justify-center text-foreground mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>

      <h1 className="text-3xl font-display font-extrabold text-foreground mb-1 tracking-tight uppercase">
        {isSubscribed ? "Your Plan" : "Choose Your Plan"}
      </h1>
      <p className="text-sm text-foreground/60 font-body mb-6">
        {isSubscribed
          ? `You're on the ${subscriptionTier === "lifetime" ? "Lifetime" : "Monthly"} plan`
          : "Unlock the full Ingoa experience"}
      </p>

      {/* Already subscribed banner */}
      {isSubscribed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5 mb-4 border-2 border-[hsl(var(--accent))]/40"
          style={{ background: "linear-gradient(145deg, hsl(235 50% 22%), hsl(235 55% 14%))" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-5 h-5 text-[hsl(var(--accent))]" />
            <span className="font-display font-extrabold text-foreground uppercase tracking-wide">Premium Active</span>
          </div>
          <p className="text-xs text-foreground/50 font-body mb-1">
            {subscriptionTier === "lifetime"
              ? "Lifetime access — no expiry"
              : subscriptionEnd
                ? `Renews ${new Date(subscriptionEnd).toLocaleDateString()}`
                : "Active subscription"}
          </p>
          {subscriptionTier === "monthly" && (
            <button
              onClick={native ? handleNativeManage : handleManage}
              disabled={portalLoading}
              className="mt-3 w-full py-3 rounded-full frosted-pill text-foreground text-sm font-body font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
              Manage Subscription
            </button>
          )}
        </motion.div>
      )}

      {/* ── Native: single CTA to open RevenueCat Paywall ── */}
      {native && !isSubscribed && (
        <>
          <motion.div
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.35 }}
            className="rounded-2xl p-6 mb-4 relative overflow-hidden"
            style={{ background: "linear-gradient(145deg, hsl(235 50% 22%), hsl(235 55% 14%))" }}
          >
            <h3 className="font-display font-extrabold text-foreground text-xl uppercase tracking-wide mb-1 flex items-center gap-2">
              <Crown className="w-5 h-5 text-[hsl(var(--accent))]" /> INGOA Pro
            </h3>
            <p className="text-sm text-foreground/60 font-body mb-5">
              Unlimited swipes, couple mode, and full catalogue access
            </p>
            <PremiumBenefits className="mb-6" />

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleNativePaywall}
              disabled={loadingPrice === "native"}
              className="w-full py-4 rounded-full bg-[hsl(var(--accent))] text-white text-sm font-body font-bold uppercase tracking-wider shadow-glow-accent active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loadingPrice === "native" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe Now"}
            </motion.button>
          </motion.div>

          {/* Restore purchases */}
          <button
            onClick={handleRestore}
            disabled={restoring}
            className="w-full py-3 rounded-full frosted-pill text-foreground text-sm font-body font-bold uppercase tracking-wider flex items-center justify-center gap-2 mb-4"
          >
            {restoring ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
            Restore Purchases
          </button>
        </>
      )}

      {/* ── Web: show Monthly + Lifetime cards (Stripe) ── */}
      {!native && !isSubscribed && (
        <>
          {/* Monthly plan */}
          <motion.div
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.35 }}
            className="rounded-2xl p-6 mb-4 relative overflow-hidden"
            style={{ background: "linear-gradient(145deg, hsl(235 50% 22%), hsl(235 55% 14%))" }}
          >
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-foreground/10 rounded-full px-2.5 py-1">
              <Sparkles className="w-3 h-3 text-[hsl(var(--accent))]" />
              <span className="text-[10px] font-body font-bold text-foreground/80 uppercase tracking-wider">Popular</span>
            </div>
            <h3 className="font-display font-extrabold text-foreground text-xl uppercase tracking-wide mb-1 flex items-center gap-2">
              <Crown className="w-5 h-5 text-[hsl(var(--accent))]" /> Monthly
            </h3>
            <p className="text-2xl font-display font-extrabold text-foreground mb-1">$9.99<span className="text-sm text-foreground/50 font-body">/mo</span></p>
            <p className="text-xs text-foreground/40 font-body mb-5">Cancel anytime</p>
            <PremiumBenefits />
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => handleCheckout(PRICES.monthly)}
              disabled={loadingPrice === PRICES.monthly}
              className="w-full mt-6 py-4 rounded-full bg-[hsl(var(--accent))] text-white text-sm font-body font-bold uppercase tracking-wider shadow-glow-accent active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loadingPrice === PRICES.monthly ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe Monthly"}
            </motion.button>
          </motion.div>

          {/* Lifetime plan */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="rounded-2xl p-6 mb-4 relative overflow-hidden"
            style={{ background: "linear-gradient(145deg, hsl(235 50% 22%), hsl(235 55% 14%))" }}
          >
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-foreground/10 rounded-full px-2.5 py-1">
              <span className="text-[10px] font-body font-bold text-foreground/80 uppercase tracking-wider">Best Value</span>
            </div>
            <h3 className="font-display font-extrabold text-foreground text-xl uppercase tracking-wide mb-1 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[hsl(var(--accent))]" /> Lifetime
            </h3>
            <p className="text-2xl font-display font-extrabold text-foreground mb-1">$20<span className="text-sm text-foreground/50 font-body"> once</span></p>
            <p className="text-xs text-foreground/40 font-body mb-5">Pay once, premium forever</p>
            <ul className="space-y-3.5 text-sm font-body text-foreground/80">
              <li className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[hsl(var(--accent))]/20 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-[hsl(var(--accent))]" />
                </div>
                Everything in Monthly
              </li>
              <li className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[hsl(var(--accent))]/20 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-[hsl(var(--accent))]" />
                </div>
                No recurring charges
              </li>
            </ul>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => handleCheckout(PRICES.lifetime)}
              disabled={loadingPrice === PRICES.lifetime}
              className="w-full mt-6 py-4 rounded-full frosted-pill text-foreground text-sm font-body font-bold uppercase tracking-wider active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loadingPrice === PRICES.lifetime ? <Loader2 className="w-4 h-4 animate-spin" /> : "Buy Lifetime Access"}
            </motion.button>
          </motion.div>
        </>
      )}

      {/* Free tier */}
      {!isSubscribed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="frosted-pill rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-extrabold text-foreground text-base uppercase tracking-wide">Free</h3>
            <span className="text-[10px] font-body font-bold text-foreground/40 uppercase tracking-wider bg-foreground/10 rounded-full px-2.5 py-1">Current</span>
          </div>
          <ul className="space-y-2.5 text-sm font-body text-foreground/60">
            <li className="flex items-center gap-3"><Check className="w-4 h-4 text-foreground/40 shrink-0" /> 20 swipes per day</li>
            <li className="flex items-center gap-3"><Check className="w-4 h-4 text-foreground/40 shrink-0" /> Save liked names</li>
            <li className="flex items-center gap-3"><Check className="w-4 h-4 text-foreground/40 shrink-0" /> Basic name details</li>
          </ul>
        </motion.div>
      )}

      {/* Locked features */}
      {!isSubscribed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 frosted-pill rounded-2xl p-5"
        >
          <h4 className="text-xs font-body font-bold text-foreground/50 uppercase tracking-widest mb-3">Premium Only</h4>
          <div className="space-y-3">
            {["Unlimited daily swipes", "Partner matching", "Full catalogue", "Name sharing"].map((f) => (
              <div key={f} className="flex items-center gap-3 text-sm font-body text-foreground/40">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <button
        onClick={() => navigate(-1)}
        className="w-full mt-4 py-3 text-sm text-foreground/50 font-body hover:text-foreground transition-colors"
      >
        {isSubscribed ? "Back" : "Continue with Free"}
      </button>

      {!isSubscribed && (
        <div className="mt-4 px-2 text-[11px] leading-relaxed font-body text-foreground/40 text-center space-y-2">
          <p>
            INGOA Pro Monthly is an auto-renewing subscription at $9.99 NZD per month. Lifetime is a one-time purchase of $20 NZD.
            {native
              ? " Payment is charged to your Apple ID or Google Play account at confirmation. The subscription renews automatically unless cancelled at least 24 hours before the end of the current period. Manage or cancel anytime in your account settings."
              : " The subscription renews automatically each month unless cancelled. Manage or cancel anytime from Settings."}
          </p>
          <p>
            <a href="/terms" onClick={(e) => { e.preventDefault(); navigate("/terms"); }} className="underline text-foreground/60">Terms of Use</a>
            {" · "}
            <a href="/privacy" onClick={(e) => { e.preventDefault(); navigate("/privacy"); }} className="underline text-foreground/60">Privacy Policy</a>
          </p>
        </div>
      )}
    </div>

  );
};

export default Subscription;
