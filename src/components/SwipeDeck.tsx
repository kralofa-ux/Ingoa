import { useApp } from "@/context/AppContext";
import { useNames, buildWeightedDeck } from "@/hooks/useNames";
import SwipeCard from "@/components/SwipeCard";
import SwipeTutorial from "@/components/SwipeTutorial";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { RefreshCw, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const DAILY_SWIPE_LIMIT = 20;

const getDailySwipeData = () => {
  const stored = localStorage.getItem("ingoa_daily_swipes");
  if (stored) {
    const parsed = JSON.parse(stored);
    const today = new Date().toDateString();
    if (parsed.date === today) return parsed.count;
  }
  return 0;
};

const setDailySwipeData = (count: number) => {
  localStorage.setItem("ingoa_daily_swipes", JSON.stringify({
    date: new Date().toDateString(),
    count,
  }));
};

const SwipeDeck = () => {
  const {
    likeName, passName, passedIds, likedNames,
    cultureFilter, genderFilter, mode, currentPartner,
    undoLastSwipe, refreshDeck, swipeHistory
  } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: allNames, isLoading } = useNames();
  const [dailySwipes, setDailySwipes] = useState(getDailySwipeData);
  const [swipeCount, setSwipeCount] = useState(() => {
    const stored = localStorage.getItem("ingoa_swipe_count");
    return stored ? parseInt(stored, 10) : 0;
  });

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
    if (currentIndex < filteredNames.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setCurrentIndex(filteredNames.length);
    }
  };

  const handleLike = () => {
    if (currentName) {likeName(currentName);advance();}
  };

  const handlePass = () => {
    if (currentName) {passName(currentName.id, currentName);advance();}
  };

  const handleUndo = () => {
    const success = undoLastSwipe();
    if (success) {
      setCurrentIndex((i) => Math.max(0, i - 1));
      toast({ title: "Undo", description: "Last swipe undone" });
    }
  };

  const showTutorial = swipeCount < 5;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-foreground/50" />
      </div>);

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
          Partner {currentPartner}'s turn
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