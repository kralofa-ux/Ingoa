import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { PolynesianName } from "@/data/names";
import { useApp } from "@/context/AppContext";
import { cultureEmoji } from "@/lib/cultureColors";
import { getGenderColor, genderLabel } from "@/lib/genderColors";
import { Undo2 } from "lucide-react";

interface SwipeCardProps {
  name: PolynesianName;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isTop: boolean;
  onUndo?: () => void;
  canUndo?: boolean;
}

const SwipeCard = ({ name, onSwipeLeft, onSwipeRight, isTop, onUndo, canUndo }: SwipeCardProps) => {
  const { showNamePreview, lastName, middleName } = useApp();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x > 100) onSwipeRight();
    else if (info.offset.x < -100) onSwipeLeft();
  };

  const namePreview = showNamePreview
    ? [name.name, middleName, lastName].filter(Boolean).join(" ")
    : null;

  const gColor = getGenderColor(name.gender);

  return (
    <motion.div
      className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ x: 300, opacity: 0, transition: { duration: 0.3 } }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className={`h-full rounded-3xl ${gColor.bg} overflow-hidden flex flex-col relative shadow-card-hover`}>
        {/* Undo button */}
        {onUndo && (
          <button
            onClick={(e) => { e.stopPropagation(); onUndo(); }}
            disabled={!canUndo}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white transition-all active:scale-95 disabled:opacity-25"
            title="Undo last swipe"
          >
            <Undo2 className="w-4 h-4" />
          </button>
        )}

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
          {/* Culture badge */}
          <div className="flex items-center gap-2 mb-8">
            <span className="text-2xl">{cultureEmoji[name.culture]}</span>
            <span className="text-xs font-body font-bold text-white/70 uppercase tracking-[0.2em]">
              {name.culture}
            </span>
          </div>

          {/* Name */}
          <h2 className="text-6xl md:text-7xl font-display font-extrabold text-white mb-3 text-center leading-none tracking-tight">
            {name.name}
          </h2>

          {/* Name preview */}
          {namePreview && (
            <p className="text-base text-white/60 font-body mb-5 text-center">
              {namePreview}
            </p>
          )}

          {/* Meaning */}
          <p className="text-lg text-white/80 font-body text-center max-w-[280px] leading-relaxed font-medium mb-6">
            {name.meaning}
          </p>

          {/* Gender pill */}
          <span className="inline-block px-5 py-2 rounded-full text-xs font-body font-bold tracking-widest uppercase bg-white/15 text-white backdrop-blur-sm">
            {genderLabel[name.gender] || "Unisex"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default SwipeCard;
