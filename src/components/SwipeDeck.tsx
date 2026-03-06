import { useApp } from "@/context/AppContext";
import { polynesianNames } from "@/data/names";
import SwipeCard from "@/components/SwipeCard";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Heart, X, Undo2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SwipeDeck = () => {
  const {
    likeName, passName, passedIds, likedNames,
    cultureFilter, genderFilter, mode, currentPartner,
    undoLastSwipe, refreshDeck, swipeHistory,
  } = useApp();
  const { toast } = useToast();

  const filteredNames = useMemo(() => {
    const filtered = polynesianNames.filter((n) => {
      if (cultureFilter.length > 0 && !cultureFilter.includes(n.culture)) return false;
      if (genderFilter !== "all" && n.gender !== genderFilter && n.gender !== "unisex") return false;
      if (passedIds.has(n.id)) return false;
      if (likedNames.find((l) => l.id === n.id)) return false;
      return true;
    });
    const shuffled = [...filtered];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [cultureFilter, genderFilter, passedIds, likedNames]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showRefreshConfirm, setShowRefreshConfirm] = useState(false);

  const currentName = filteredNames[currentIndex];
  const nextName = filteredNames[currentIndex + 1];

  const advance = () => {
    if (currentIndex < filteredNames.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setCurrentIndex(filteredNames.length);
    }
  };

  const handleLike = () => {
    if (currentName) { likeName(currentName); advance(); }
  };

  const handlePass = () => {
    if (currentName) { passName(currentName.id, currentName); advance(); }
  };

  const handleUndo = () => {
    const success = undoLastSwipe();
    if (success) {
      setCurrentIndex((i) => Math.max(0, i - 1));
      toast({ title: "Undone" });
    }
  };

  const handleRefresh = () => {
    if (!showRefreshConfirm) { setShowRefreshConfirm(true); return; }
    refreshDeck();
    setCurrentIndex(0);
    setShowRefreshConfirm(false);
    toast({ title: "Deck refreshed" });
  };

  if (!currentName) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-5xl mb-6"
        >
          🌊
        </motion.div>
        <h3 className="text-2xl font-display italic text-foreground mb-2">No more names</h3>
        <p className="text-muted-foreground font-body text-sm mb-6">
          Adjust your filters or refresh the deck.
        </p>
        <button
          onClick={() => { refreshDeck(); setCurrentIndex(0); }}
          className="px-5 py-2.5 rounded-full gradient-ocean text-primary-foreground font-body font-medium text-sm flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center px-4">
      {mode === "couple" && (
        <div className="mb-3 px-3 py-1 rounded-full gradient-ocean text-primary-foreground text-xs font-body font-medium">
          Partner {currentPartner}
        </div>
      )}

      <div className="relative w-full max-w-sm h-[420px] mx-auto">
        <AnimatePresence>
          {nextName && (
            <SwipeCard key={nextName.id} name={nextName} onSwipeLeft={() => {}} onSwipeRight={() => {}} isTop={false} />
          )}
          <SwipeCard key={currentName.id} name={currentName} onSwipeLeft={handlePass} onSwipeRight={handleLike} isTop={true} />
        </AnimatePresence>
      </div>

      {/* Action buttons — minimal */}
      <div className="flex items-center gap-6 mt-8">
        <button
          onClick={handleUndo}
          disabled={swipeHistory.length === 0}
          className="w-10 h-10 rounded-full border border-border text-muted-foreground flex items-center justify-center hover:text-foreground transition-colors disabled:opacity-20"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        <button
          onClick={handlePass}
          className="w-14 h-14 rounded-full border-2 border-destructive text-destructive flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-all"
        >
          <X className="w-6 h-6" />
        </button>

        <button
          onClick={handleLike}
          className="w-16 h-16 rounded-full gradient-ocean text-primary-foreground flex items-center justify-center shadow-glow-ocean hover:scale-105 active:scale-95 transition-transform"
        >
          <Heart className="w-7 h-7" fill="currentColor" />
        </button>

        <button
          onClick={handleRefresh}
          className="w-10 h-10 rounded-full border border-border text-muted-foreground flex items-center justify-center hover:text-foreground transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {showRefreshConfirm && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 px-4 py-2 rounded-xl border border-border text-sm font-body text-center"
        >
          <p className="text-foreground mb-2">Reset passed names?</p>
          <div className="flex gap-2 justify-center">
            <button onClick={handleRefresh} className="px-3 py-1 rounded-full gradient-ocean text-primary-foreground text-xs font-medium">
              Yes
            </button>
            <button onClick={() => setShowRefreshConfirm(false)} className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
              No
            </button>
          </div>
        </motion.div>
      )}

      <p className="mt-4 text-xs text-muted-foreground font-body tracking-wide">
        {currentIndex + 1} / {filteredNames.length}
      </p>
    </div>
  );
};

export default SwipeDeck;
