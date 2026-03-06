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
    // Shuffle using Fisher-Yates
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
    if (currentName) {
      likeName(currentName);
      advance();
    }
  };

  const handlePass = () => {
    if (currentName) {
      passName(currentName.id, currentName);
      advance();
    }
  };

  const handleUndo = () => {
    const success = undoLastSwipe();
    if (success) {
      setCurrentIndex((i) => Math.max(0, i - 1));
      toast({ title: "Undo", description: "Last swipe undone" });
    }
  };

  const handleRefresh = () => {
    if (!showRefreshConfirm) {
      setShowRefreshConfirm(true);
      return;
    }
    refreshDeck();
    setCurrentIndex(0);
    setShowRefreshConfirm(false);
    toast({ title: "Deck refreshed", description: "Passed names are back in the deck" });
  };

  if (!currentName) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-6xl mb-6"
        >
          🌊
        </motion.div>
        <h3 className="text-2xl font-display text-foreground mb-2">No more names!</h3>
        <p className="text-muted-foreground font-body mb-6">
          You've gone through all the names. Check your liked list or adjust filters.
        </p>
        <button
          onClick={() => {
            refreshDeck();
            setCurrentIndex(0);
          }}
          className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-body font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh passed names
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center px-4">
      {/* Partner indicator for couple mode */}
      {mode === "couple" && (
        <div className="mb-3 px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-body font-medium">
          Partner {currentPartner}'s turn
        </div>
      )}

      {/* Card stack */}
      <div className="relative w-full max-w-sm h-[420px] mx-auto">
        <AnimatePresence>
          {nextName && (
            <SwipeCard
              key={nextName.id}
              name={nextName}
              onSwipeLeft={() => {}}
              onSwipeRight={() => {}}
              isTop={false}
            />
          )}
          <SwipeCard
            key={currentName.id}
            name={currentName}
            onSwipeLeft={handlePass}
            onSwipeRight={handleLike}
            isTop={true}
          />
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-4 mt-6">
        {/* Undo */}
        <button
          onClick={handleUndo}
          disabled={swipeHistory.length === 0}
          className="w-12 h-12 rounded-full bg-card border border-border text-muted-foreground flex items-center justify-center shadow-card hover:shadow-card-hover transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
          title="Undo last swipe"
        >
          <Undo2 className="w-5 h-5" />
        </button>

        {/* Pass */}
        <button
          onClick={handlePass}
          className="w-16 h-16 rounded-full bg-card border-2 border-destructive text-destructive flex items-center justify-center shadow-card hover:shadow-card-hover transition-all hover:scale-105 active:scale-95"
        >
          <X className="w-7 h-7" />
        </button>

        {/* Like */}
        <button
          onClick={handleLike}
          className="w-20 h-20 rounded-full gradient-sunset text-accent-foreground flex items-center justify-center shadow-glow-coral hover:scale-105 active:scale-95 transition-all"
        >
          <Heart className="w-9 h-9" fill="currentColor" />
        </button>

        {/* Refresh */}
        <button
          onClick={handleRefresh}
          className="w-12 h-12 rounded-full bg-card border border-border text-muted-foreground flex items-center justify-center shadow-card hover:shadow-card-hover transition-all hover:scale-105 active:scale-95"
          title="Refresh passed names"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Refresh confirmation */}
      {showRefreshConfirm && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 px-4 py-2 rounded-xl bg-card border border-border shadow-card text-sm font-body text-center"
        >
          <p className="text-foreground mb-2">Bring back all passed names?</p>
          <div className="flex gap-2 justify-center">
            <button
              onClick={handleRefresh}
              className="px-3 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-medium"
            >
              Yes, refresh
            </button>
            <button
              onClick={() => setShowRefreshConfirm(false)}
              className="px-3 py-1 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Progress */}
      <p className="mt-4 text-sm text-muted-foreground font-body">
        {currentIndex + 1} of {filteredNames.length} names
      </p>
    </div>
  );
};

export default SwipeDeck;
