import { useApp } from "@/context/AppContext";
import { polynesianNames } from "@/data/names";
import SwipeCard from "@/components/SwipeCard";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Heart, X, Filter, RotateCcw } from "lucide-react";

const SwipeDeck = () => {
  const {
    likeName, passName, passedIds, likedNames,
    cultureFilter, genderFilter, mode, currentPartner,
  } = useApp();

  const filteredNames = useMemo(() => {
    return polynesianNames.filter((n) => {
      if (cultureFilter !== "all" && n.culture !== cultureFilter) return false;
      if (genderFilter !== "all" && n.gender !== genderFilter) return false;
      if (passedIds.has(n.id)) return false;
      if (likedNames.find((l) => l.id === n.id)) return false;
      return true;
    });
  }, [cultureFilter, genderFilter, passedIds, likedNames]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const currentName = filteredNames[currentIndex];
  const nextName = filteredNames[currentIndex + 1];

  const advance = () => {
    if (currentIndex < filteredNames.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setCurrentIndex(filteredNames.length); // signals end
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
      passName(currentName.id);
      advance();
    }
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
        <p className="text-muted-foreground font-body">
          You've gone through all the names. Check your liked list or adjust filters.
        </p>
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
      <div className="flex items-center gap-6 mt-6">
        <button
          onClick={handlePass}
          className="w-16 h-16 rounded-full bg-card border-2 border-destructive text-destructive flex items-center justify-center shadow-card hover:shadow-card-hover transition-all hover:scale-105 active:scale-95"
        >
          <X className="w-7 h-7" />
        </button>
        <button
          onClick={handleLike}
          className="w-20 h-20 rounded-full gradient-sunset text-accent-foreground flex items-center justify-center shadow-glow-coral hover:scale-105 active:scale-95 transition-all"
        >
          <Heart className="w-9 h-9" fill="currentColor" />
        </button>
      </div>

      {/* Progress */}
      <p className="mt-4 text-sm text-muted-foreground font-body">
        {currentIndex + 1} of {filteredNames.length} names
      </p>
    </div>
  );
};

export default SwipeDeck;
