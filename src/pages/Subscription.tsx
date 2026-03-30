import { motion } from "framer-motion";
import { Check, Crown, Sparkles, ArrowLeft, Lock, Zap, Heart, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Subscription = () => {
  const navigate = useNavigate();

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
        Choose Your Plan
      </h1>
      <p className="text-sm text-foreground/60 font-body mb-6">
        Unlock the full Ingoa experience
      </p>

      {/* Premium tier — featured */}
      <motion.div
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.35 }}
        className="rounded-2xl p-6 mb-4 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, hsl(235 50% 22%), hsl(235 55% 14%))" }}
      >
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-foreground/10 rounded-full px-2.5 py-1">
          <Sparkles className="w-3 h-3 text-[hsl(var(--accent))]" />
          <span className="text-[10px] font-body font-bold text-foreground/80 uppercase tracking-wider">Recommended</span>
        </div>
        <h3 className="font-display font-extrabold text-foreground text-xl uppercase tracking-wide mb-1 flex items-center gap-2">
          <Crown className="w-5 h-5 text-[hsl(var(--accent))]" /> Premium
        </h3>
        <p className="text-xs text-foreground/40 font-body mb-5">Everything you need</p>
        <ul className="space-y-3.5 text-sm font-body text-foreground/80">
          <li className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[hsl(var(--accent))]/20 flex items-center justify-center shrink-0">
              <Zap className="w-3.5 h-3.5 text-[hsl(var(--accent))]" />
            </div>
            Unlimited swipes
          </li>
          <li className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[hsl(var(--accent))]/20 flex items-center justify-center shrink-0">
              <Heart className="w-3.5 h-3.5 text-[hsl(var(--accent))]" />
            </div>
            Couple mode — match together
          </li>
          <li className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[hsl(var(--accent))]/20 flex items-center justify-center shrink-0">
              <BookOpen className="w-3.5 h-3.5 text-[hsl(var(--accent))]" />
            </div>
            Full name catalogue access
          </li>
          <li className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-[hsl(var(--accent))]/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--accent))]" />
            </div>
            Name preview & sharing
          </li>
        </ul>
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="w-full mt-6 py-4 rounded-full bg-[hsl(var(--accent))] text-white text-sm font-body font-bold uppercase tracking-wider shadow-glow-accent active:scale-[0.98] transition-all"
        >
          Upgrade to Premium
        </motion.button>
      </motion.div>

      {/* Free tier */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.3 }}
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

      {/* Locked features */}
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
