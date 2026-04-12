import { useApp } from "@/context/AppContext";
import { useNames, buildWeightedDeck } from "@/hooks/useNames";
import SwipeCard from "@/components/SwipeCard";
import SwipeTutorial from "@/components/SwipeTutorial";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import { RefreshCw, Sparkles, Crown, Zap, Heart, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { supabase } from "@/integrations/supabase/client";

const triggerHaptic = async () => {
  try { await Haptics.impact({ style: ImpactStyle.Medium }); } catch {}
};

const DAILY_SWIPE_LIMIT = 20;

const SwipeDeck = () => {
  const {
    likeName, passName, passedIds, likedNames,
    cultureFilter, genderFilter, mode, currentPartner,
    undoLastSwipe, refreshDeck, swipeHistory
  } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isSubscribed, user } = useAuth();
  const { data: allNames, isLoading } = useNames();
  const [dailySwipes, setDailySwipes] = useState(0);
  const [swipeCount, setSwipeCount] = useState(() => {
    const stored = localStorage.getItem("ingoa_swipe_count");
    return stored ? parseInt(stored, 10) : 0;
  });

  // Load today's swipe count from server
  useEffect(() => {
    if (!user) return;
    const loadSwipes = async () => {
      const { data } = await supabase
        .from("daily_swipes")
        .select("swipe_count")
        .eq("user_id", user.id)
        .eq("swipe_date", new Date().toISOString().split("T")[0])
        .maybeSingle();
      if (data) setDailySwipes(data.swipe_count);
    };
    loadSwipes();
  }, [user]);

  const filteredNames = useMemo(() => {
    if (!allNames) return [];
    const filtered = allNames.filter((n) => {
      if (cultureFilter.length > 0 && !cultureFilter.includes(n.culture)) return false;
      if (genderFilter !== "all" && n.gender !== genderFilter && n.gender !== "unisex") return false;
      return true;
    });
    const likedIds = new Set(likedNames.map((l) => l.id));
    return buildWeightedDeck(filtered, passedIds, likedIds);
  }, [allNames, cultureFilter, genderFilter, passedIds, likedNames]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentName = filteredNames[currentIndex];

  const advance = () => {
    setSwipeCount((c) => {
      const next = c + 1;
      localStorage.setItem("ingoa_swipe_count", String(next));
      return next;
    });
    // Record swipe server-side
    if (user) {
      supabase.rpc("record_swipe").then(({ data }) => {
        if (typeof data === "number") setDailySwipes(data);
      });
    } else {
      setDailySwipes((c) => c + 1);
    }
    if (currentIndex < filteredNames.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setCurrentIndex(filteredNames.length);
    }
  };

  // Premium users bypass daily limit
  const isAtLimit = !isSubscribed && dailySwipes >= DAILY_SWIPE_LIMIT;

  const handleLike = () => {
    if (currentName) { triggerHaptic(); likeName(currentName); advance(); }
  };

  const handlePass = () => {
    if (currentName) { triggerHaptic(); passName(currentName.id, currentName); advance(); }
  };

  const handleUndo = () => {
    const success = undoLastSwipe();
    if (success) {
      triggerHaptic();
      setCurrentIndex((i) => Math.max(0, i - 1));
      toast({ title: "Undo", description: "Last swipe undone" });
    }
  };


  const showTutorial = swipeCount < 5;

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center px-4 relative">
        <div className="relative w-full max-w-sm h-[560px] mx-auto">
          <div className="h-full rounded-3xl bg-foreground/10 animate-pulse flex flex-col items-center justify-center p-8">
            <div className="w-20 h-4 rounded-full bg-foreground/10 mb-8" />
            <div className="w-48 h-10 rounded-full bg-foreground/10 mb-4" />
            <div className="w-36 h-4 rounded-full bg-foreground/10 mb-6" />
            <div className="w-56 h-5 rounded-full bg-foreground/10 mb-6" />
            <div className="w-24 h-8 rounded-full bg-foreground/10" />
          </div>
        </div>
      </div>
    );
  }

  if (isAtLimit) {
    return (
      <div className="flex-1 flex flex-col items-center px-4 pt-8 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-6"
        >
          <div className="inline-flex items-center gap-1.5 bg-foreground/10 rounded-full px-3 py-1.5 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[hsl(var(--accent))]" />
            <span className="text-[10px] font-body font-bold text-foreground/70 uppercase tracking-wider">Daily limit reached</span>
          </div>
          <h3 className="text-2xl font-display font-extrabold text-foreground uppercase tracking-tight mb-1">
            Unlock Unlimited Names
          </h3>
          <p className="text-sm text-foreground/50 font-body">
            Upgrade for the full Ingoa experience
          </p>
        </motion.div>

        {/* Premium card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.35 }}
          className="w-full max-w-sm rounded-2xl p-6 mb-4 relative overflow-hidden"
          style={{ background: "linear-gradient(145deg, hsl(235 50% 22%), hsl(235 55% 14%))" }}
        >
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-foreground/10 rounded-full px-2.5 py-1">
            <Crown className="w-3 h-3 text-[hsl(var(--accent))]" />
            <span className="text-[10px] font-body font-bold text-foreground/80 uppercase tracking-wider">Pro</span>
          </div>

          <h4 className="font-display font-extrabold text-foreground text-lg uppercase tracking-wide mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5 text-[hsl(var(--accent))]" /> INGOA Pro
          </h4>

          <ul className="space-y-3 text-sm font-body text-foreground/80 mb-6">
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
          </ul>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/subscribe")}
            className="w-full py-4 rounded-full bg-[hsl(var(--accent))] text-white text-sm font-body font-bold uppercase tracking-wider shadow-glow-accent active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Go Premium
          </motion.button>
        </motion.div>

        {/* Free tier reminder */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.3 }}
          className="w-full max-w-sm frosted-pill rounded-2xl p-5 text-center"
        >
          <p className="text-xs text-foreground/40 font-body">
            Or come back tomorrow for {DAILY_SWIPE_LIMIT} more free swipes
          </p>
        </motion.div>
      </div>
    );
  }

  if (!currentName) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-6xl mb-6">
          
          🌊
        </motion.div>
        <h3 className="text-2xl font-display font-extrabold text-foreground mb-2 uppercase">You've reached the end!</h3>
        <p className="text-foreground/60 font-body mb-6">
          You've gone through all available names. Refresh to bring back passed names.
        </p>
        <button
          onClick={() => {refreshDeck();setCurrentIndex(0);}}
          className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-body font-bold flex items-center gap-2 uppercase tracking-wider transition-opacity hover:opacity-90">
          
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>);

  }

  return (
    <div className="flex-1 flex flex-col items-center px-4 relative">
      {mode === "couple" &&
      <div className="mb-3 px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-body font-semibold">
          Couple Mode
        </div>
      }

      <div className="relative w-full max-w-sm h-[560px] mx-auto">
        <AnimatePresence mode="wait">
          <SwipeCard
            key={currentName.id}
            name={currentName}
            onSwipeLeft={handlePass}
            onSwipeRight={handleLike}
            isTop={true}
            onUndo={handleUndo}
            canUndo={swipeHistory.length > 0}
            swipeCount={swipeCount} />
          
        </AnimatePresence>

        {showTutorial && <SwipeTutorial swipeCount={swipeCount} />}
      </div>
    </div>);

};

export default SwipeDeck;