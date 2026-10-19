import { useApp } from "@/context/AppContext";
import { useNames, buildWeightedDeck } from "@/hooks/useNames";
import PremiumBenefits from "@/components/PremiumBenefits";
import SwipeCard from "@/components/SwipeCard";
import SwipeTutorial from "@/components/SwipeTutorial";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState, useEffect, useRef } from "react";
import { RefreshCw, Sparkles, Crown, Zap, Heart, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { useDailySwipes, DAILY_SWIPE_LIMIT } from "@/hooks/useDailySwipes";
import { Button } from "@/components/ui/button";

const MotionButton = motion(Button);

const triggerHaptic = async () => {
  try { await Haptics.impact({ style: ImpactStyle.Medium }); } catch { /* Haptics are optional in browsers. */ }
};



const SwipeDeck = () => {
  const {
    likeName, passName, passedIds, likedNames,
    cultureFilter, genderFilter, mode, swipeLoading, swipeError, retrySwipes,
    undoLastSwipe, refreshDeck, swipeHistory
  } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isSubscribed, user } = useAuth();
  const { data: allNames, isLoading, error: namesError, refetch } = useNames();
  const { count: dailySwipes, loading: countLoading, error: countError, refresh: refreshCount, record } = useDailySwipes(user?.id);
  const pendingRef = useRef(false);
  const [pending, setPending] = useState(false);
  const [swipeCount, setSwipeCount] = useState(() => {
    const stored = localStorage.getItem("ingoa_swipe_count");
    return stored ? parseInt(stored, 10) : 0;
  });

  const filterKey = JSON.stringify([cultureFilter, genderFilter, user?.id]);
  const availableNames = useMemo(() => (allNames ?? []).filter(n =>
    (!cultureFilter.length || cultureFilter.includes(n.culture)) &&
    (genderFilter === 'all' || n.gender === genderFilter || n.gender === 'unisex')
  ), [allNames, cultureFilter, genderFilter]);
  const ordered = useRef<string[]>([]);
  const previousFilter = useRef('');
  const filteredNames = useMemo(() => {
    const available = availableNames.filter(n => !passedIds.has(n.id) && !likedNames.some(l=>l.id===n.id));
    if (previousFilter.current !== filterKey) { ordered.current=[];previousFilter.current=filterKey; }
    const byId = new Map(available.map(n=>[n.id,n]));
    const retained = ordered.current.filter(id=>byId.has(id));
    const existing = new Set(retained);
    const additions = buildWeightedDeck(available.filter(n=>!existing.has(n.id)),new Set(),new Set());
    ordered.current = [...retained,...additions.map(n=>n.id)];
    return ordered.current.flatMap(id=>{const name=byId.get(id);return name?[name]:[];});
  },[availableNames,passedIds,likedNames,filterKey]);
  const currentName = filteredNames[0];
  const isAtLimit = !isSubscribed && dailySwipes >= DAILY_SWIPE_LIMIT;
  const perform = async (operation: () => Promise<void>) => {
    if (pendingRef.current) return;
    pendingRef.current=true;setPending(true);
    try { await operation(); }
    catch (error) { toast({title:'Unable to save',description:error instanceof Error?error.message:'Please try again',variant:'destructive'}); }
    finally { pendingRef.current=false;setPending(false); }
  };
  const swipe = (action: 'like' | 'pass') => {
    if (!currentName || isAtLimit || countLoading || countError) return;
    void perform(async()=> {
      await record();
      await (action==='like'?likeName(currentName):passName(currentName.id,currentName));
      void triggerHaptic();
      setSwipeCount(count=> {const next=count+1;localStorage.setItem('ingoa_swipe_count',String(next));return next;});
    });
  };
  const handleLike = () => swipe('like');
  const handlePass = () => swipe('pass');
  const handleUndo = () => void perform(async()=> {
    const name = await undoLastSwipe();
    if (!name) return;
    ordered.current=[name.id,...ordered.current.filter(id=>id!==name.id)];
    toast({title:'Undo',description:'Last swipe undone'});
  });

  const showTutorial = swipeCount < 5;

  if (namesError || swipeError || countError) return <div className="flex-1 p-8 text-center"><p className="text-foreground mb-4">Unable to load your names. Please try again.</p><Button onClick={()=>{void refetch();retrySwipes();void refreshCount();}}>Retry</Button></div>;

  if (isLoading || swipeLoading || countLoading) {
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
          className="w-full max-w-sm rounded-2xl p-6 mb-4 relative overflow-hidden premium-surface"
          
        >
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-foreground/10 rounded-full px-2.5 py-1">
            <Crown className="w-3 h-3 text-[hsl(var(--accent))]" />
            <span className="text-[10px] font-body font-bold text-foreground/80 uppercase tracking-wider">Pro</span>
          </div>

          <h4 className="font-display font-extrabold text-foreground text-lg uppercase tracking-wide mb-4 flex items-center gap-2">
            <Crown className="w-5 h-5 text-[hsl(var(--accent))]" /> INGOA Pro
          </h4>

          <PremiumBenefits className="mb-6" />

          <MotionButton variant="unstyled"
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/subscribe")}
            className="w-full py-4 rounded-full bg-[hsl(var(--accent))] text-foreground text-sm font-body font-bold uppercase tracking-wider shadow-glow-accent active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Go Premium
          </MotionButton>
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
        <Button variant="unstyled"
          onClick={() => void perform(async()=>{await refreshDeck();ordered.current=[];})}
          className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-body font-bold flex items-center gap-2 uppercase tracking-wider transition-opacity hover:opacity-90">
          
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
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
            canUndo={!pending && swipeHistory.length > 0}
            disabled={pending}
            swipeCount={swipeCount} />
          
        </AnimatePresence>

        {showTutorial && <SwipeTutorial swipeCount={swipeCount} />}
      </div>
    </div>);

};

export default SwipeDeck;