import { motion } from "framer-motion";
import { Check, Crown, Sparkles, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Subscription = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-24 pt-6 px-4 max-w-lg mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="w-9 h-9 rounded-full frosted-pill flex items-center justify-center text-foreground mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>

      <h1 className="text-3xl font-display font-extrabold text-foreground mb-1 tracking-tight uppercase">
        Choose Your Plan
      </h1>
      <p className="text-sm text-foreground/60 font-body mb-6">
        Unlock the full Ingoa experience
      </p>

      {/* Free tier */}
      <div className="frosted-pill rounded-2xl p-6 mb-3">
        <h3 className="font-display font-extrabold text-foreground text-xl uppercase tracking-wide mb-1">Free</h3>
        <p className="text-xs text-foreground/50 font-body mb-4">Current plan</p>
        <ul className="space-y-3 text-sm font-body text-foreground/70">
          <li className="flex items-center gap-3"><Check className="w-4 h-4 text-foreground/50 shrink-0" /> 20 swipes per day</li>
          <li className="flex items-center gap-3"><Check className="w-4 h-4 text-foreground/50 shrink-0" /> Save liked names</li>
          <li className="flex items-center gap-3"><Check className="w-4 h-4 text-foreground/50 shrink-0" /> Basic name details</li>
        </ul>
      </div>

      {/* Premium tier */}
      <div className="rounded-2xl p-6 bg-primary/20 border border-primary/30 relative overflow-hidden">
        <div className="absolute top-4 right-4">
          <Crown className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-display font-extrabold text-foreground text-xl uppercase tracking-wide mb-1 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" /> Premium
        </h3>
        <p className="text-xs text-foreground/50 font-body mb-4">Everything in Free, plus:</p>
        <ul className="space-y-3 text-sm font-body text-foreground/70">
          <li className="flex items-center gap-3"><Check className="w-4 h-4 text-primary shrink-0" /> Unlimited swipes</li>
          <li className="flex items-center gap-3"><Check className="w-4 h-4 text-primary shrink-0" /> Couple mode — match with partner</li>
          <li className="flex items-center gap-3"><Check className="w-4 h-4 text-primary shrink-0" /> Full name catalogue access</li>
          <li className="flex items-center gap-3"><Check className="w-4 h-4 text-primary shrink-0" /> Name preview & sharing</li>
        </ul>
        <button className="w-full mt-5 py-4 rounded-full bg-primary text-primary-foreground text-sm font-body font-bold uppercase tracking-wider hover:bg-primary/80 active:scale-[0.98] transition-all">
          Upgrade to Premium
        </button>
      </div>

      <button
        onClick={() => navigate(-1)}
        className="w-full mt-4 py-3 text-sm text-foreground/50 font-body hover:text-foreground transition-colors"
      >
        Continue with Free
      </button>
    </div>
  );
};

export default Subscription;
