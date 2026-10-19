import { motion } from 'framer-motion';
import { Check, Crown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
const MotionButton=motion(Button);
export default function OnboardingPlan({onPlan,submitting}:{onPlan:()=>void;submitting:boolean}) {
 return (
      <motion.div key="subscription" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="text-left pt-8">
        <h2 className="text-3xl font-display font-extrabold text-foreground uppercase tracking-tight leading-tight mb-3">
          Choose Your Plan
        </h2>
        <p className="text-sm text-foreground/50 font-body mb-8">
          Unlock the full experience
        </p>

        {/* Premium tier — featured */}
        <motion.div
          initial={{ scale: 0.97 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, duration: 0.35 }}
          className="onboarding-premium rounded-2xl p-6 mb-4 relative overflow-hidden"
          
        >
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-foreground/10 rounded-full px-2.5 py-1">
            <Sparkles className="w-3 h-3 text-[hsl(var(--action-cyan))]" />
            <span className="text-[10px] font-body font-bold text-foreground/80 uppercase tracking-wider">Recommended</span>
          </div>
          <h3 className="font-display font-extrabold text-foreground text-xl uppercase tracking-wide mb-1 flex items-center gap-2">
            <Crown className="w-5 h-5 text-[hsl(var(--action-cyan))]" /> Premium
          </h3>
          <p className="text-xs text-foreground/40 font-body mb-4">Everything you need</p>
          <ul className="space-y-3 text-sm font-body text-foreground/80">
            <li className="flex items-center gap-3"><Check className="w-4 h-4 text-[hsl(var(--action-cyan))] shrink-0" /> Unlimited swipes</li>
            <li className="flex items-center gap-3"><Check className="w-4 h-4 text-[hsl(var(--action-cyan))] shrink-0" /> Couple mode — match together</li>
            <li className="flex items-center gap-3"><Check className="w-4 h-4 text-[hsl(var(--action-cyan))] shrink-0" /> Full name catalogue</li>
            <li className="flex items-center gap-3"><Check className="w-4 h-4 text-[hsl(var(--action-cyan))] shrink-0" /> Name preview & sharing</li>
          </ul>
          <div className="flex gap-2 mt-5">
            <MotionButton variant="unstyled"
              whileTap={{ scale: 0.97 }}
              onClick={onPlan}
              disabled={submitting}
              className="flex-1 py-3 rounded-full bg-[hsl(var(--action-cyan))] text-[hsl(var(--preference-tahiti))] text-xs font-body font-bold uppercase tracking-wider shadow-lg active:scale-[0.98] transition-all"
            >
              $9.99/mo
            </MotionButton>
            <MotionButton variant="unstyled"
              whileTap={{ scale: 0.97 }}
              onClick={onPlan}
              disabled={submitting}
              className="flex-1 py-3 rounded-full bg-[hsl(var(--preference-aotearoa))] text-foreground text-xs font-body font-bold uppercase tracking-wider shadow-lg active:scale-[0.98] transition-all"
            >
              $20 Lifetime
            </MotionButton>
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-foreground/40 font-body text-center">
            Monthly auto-renews until cancelled. Lifetime is a one-time purchase.{" "}
            <a href="/terms" target="_blank" rel="noreferrer" className="underline">Terms</a> ·{" "}
            <a href="/privacy" target="_blank" rel="noreferrer" className="underline">Privacy</a>
          </p>
        </motion.div>

        {/* Free tier */}
        <div className="rounded-2xl p-5 bg-foreground/5 border border-foreground/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-extrabold text-foreground text-base uppercase tracking-wide">Free</h3>
            <span className="text-[10px] font-body font-bold text-foreground/40 uppercase tracking-wider bg-foreground/10 rounded-full px-2.5 py-1">Current</span>
          </div>
          <ul className="space-y-2.5 text-sm font-body text-foreground/50">
            <li className="flex items-center gap-3"><Check className="w-4 h-4 text-foreground/30 shrink-0" /> 20 swipes per day</li>
            <li className="flex items-center gap-3"><Check className="w-4 h-4 text-foreground/30 shrink-0" /> Save liked names</li>
            <li className="flex items-center gap-3"><Check className="w-4 h-4 text-foreground/30 shrink-0" /> Basic name details</li>
          </ul>
        </div>
      </motion.div>
 );
}
